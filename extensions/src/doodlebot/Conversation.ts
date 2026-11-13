// Doodlebot's conversation layer (study prototype).
//
// Always listening once connected. "Hey <name>" (e.g. "Hey Meringue") or a
// bumper tap starts a conversation; follow-ups within ENGAGED_MS need no wake
// word. He's interruptible: while he talks, a bumper tap or new words like
// "stop" / "wait" / "Hey Meringue" cut him off mid-sentence and he listens.
//
// This is one layer in a subsumption-style stack (Behaviors.ts): it CLAIMS
// the ring, gaze and mouth while engaged and releases them after, so other
// behaviors (glancing at the screen while blocks are dragged) keep running
// alongside and take over the body/gaze when they outrank it.
//
// The laptop mic sits right next to his speaker, so while he talks the
// listener only reacts to words that are NOT in his own sentence (his echo
// transcribes as his own words); the voice detector is paused then.
//
// Voice activity detection: Silero VAD in the browser (@ricky0123/vad-web,
// pinned CDN). Speech to text: Chrome's Web Speech API (prototype only: it
// sends audio to Google, so swap it before the study).

import type { Resource } from "./Behaviors";

const VAD_BASE = "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.31/dist/";
const ORT_BASE = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/";

/** done: the exchange wrapped up ("okay thanks, bye!") — stop listening for
 * follow-ups and go back to waiting for his name */
export type Reply = { say: string; motion?: string; done?: boolean };

export type ConversationHooks = {
  /** r1d1v2 face command, e.g. ("tega", "SILENT_THINKING") */
  face: (...args: (string | number)[]) => void;
  /** a reply's expression: face animation plus any matching body gesture
   * (e.g. SILENT_NO also shakes his body "no") */
  express: (motion: string) => void;
  /** speak via TTS on the robot; onSent(durationMs) fires as the audio heads
   * to the robot; resolves when playback should be done */
  speak: (text: string, onSent: (durationMs: number) => void) => Promise<void>;
  /** cut off the speech playing on the robot right now */
  hush: () => void;
  /** show a short status in the Doodlebot category; returns a closer */
  status: (msg: string) => Promise<() => void>;
  /** produce the robot's reply to what the child said */
  respond: (heard: string) => Promise<Reply>;
  /** he was cut off: `spoken` is roughly what he got out */
  interrupted: (spoken: string) => void;
  /** the robot's name, for the "Hey <name>" wake word (e.g. "meringue") */
  robotName: () => string;
  /** something social just started (someone talks, he's addressed, he thinks
   * or speaks): lower layers like idle should stop what they're doing now */
  activity: () => void;
  /** subsumption arbiter: claim/release resources for the conversation layer */
  claim: (resource: Resource, value: unknown) => void;
  release: (...resources: Resource[]) => void;
};

export const TURN = {
  LISTEN_FACE: "SILENT_INTERESTED",
  THINK_FACE: "SILENT_THINKING",
  NO_SPEECH_TIMEOUT_MS: 8000, // push-to-talk: mic closes if nobody starts talking
  MAX_UTTERANCE_MS: 20000, // hard cap on one turn of child speech
  END_OF_SPEECH_MS: 700, // silence that ends the child's turn (lower = snappier, more cut-offs)
  TRANSCRIPT_WAIT_MS: 1200, // max wait for the final transcript after speech ends
  RESUME_AFTER_SPEECH_MS: 600, // mic stays closed this long after he stops talking
  ENGAGED_MS: 10000, // after he replies, follow-ups need no wake word for this long
  RESUME_AFTER_INTERRUPT_MS: 250, // after a hush, his audio is gone almost at once
};

// words that cut him off when they're not part of his own sentence
const STOP_WORDS = new Set(["stop", "wait", "hold", "no", "nope", "quiet", "shh", "shush", "pause", "enough"]);

type Phase = "idle" | "loading" | "listening" | "thinking" | "speaking" | "muted";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(script);
  });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const words = (text: string) => text.toLowerCase().replace(/[^a-z\s']/g, " ").split(/\s+/).filter(Boolean);

/** Edit distance, for forgiving name matching ("merengue" ~ "meringue"). */
function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]!;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const next = row[j]!;
      row[j] = Math.min(row[j]! + 1, row[j - 1]! + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = next;
    }
  }
  return row[b.length]!;
}

/** Does the utterance start by addressing the robot ("hey meringue, ...")?
 * Looks for the name (or "doodlebot") among the first few words, forgiving
 * speech-recognition spellings; returns the rest of the utterance, or null. */
export function matchWakeWord(text: string, name: string): string | null {
  const said = words(text);
  const names = [name.toLowerCase(), "doodlebot"].filter(Boolean);
  const close = (word: string) => names.some((n) =>
    word === n || (n.length >= 5 && editDistance(word, n) <= Math.floor(n.length / 4)));
  for (let i = 0; i < Math.min(said.length, 5); i++) {
    const one = said[i]!;
    const two = one + (said[i + 1] ?? ""); // "my ring" -> "myring", "doodle bot" -> "doodlebot"
    if (close(one)) return said.slice(i + 1).join(" ");
    if (said[i + 1] && close(two)) return said.slice(i + 2).join(" ");
  }
  return null;
}

/** Words the child said over him that aren't his own (echo) words — does
 * any of them mean "stop" or address him? */
export function isBargeIn(heardOverSpeech: string, robotSentence: string, name: string): boolean {
  const own = new Set(words(robotSentence));
  const fresh = words(heardOverSpeech).filter((w) => !own.has(w));
  if (fresh.some((w) => STOP_WORDS.has(w))) return true;
  return fresh.length > 0 && matchWakeWord(fresh.join(" "), name) !== null;
}

export class Conversation {
  phase: Phase = "idle";
  continuous = false;
  private vad: any = null;
  private recognizer: any = null;
  private transcript = { final: "", interim: "" };
  private recognizerEnded: Promise<void> = Promise.resolve();
  private closeStatus: (() => void) | null = null;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private mutedUntil = 0;
  private engagedUntil = 0; // no wake word needed before this time
  private wakeHeard = false; // this utterance addressed him (seen in the live transcript)
  private bargeListener: any = null;
  private stopSpeaking: (() => void) | null = null; // resolves the current speech early
  private t: Record<string, number> = {};

  constructor(private hooks: ConversationHooks) { }

  private get engaged() { return performance.now() < this.engagedUntil; }
  /** Is he in a conversation right now (for other behaviors, e.g. to stay quiet)? */
  get busy() {
    return this.engaged || this.wakeHeard || ["thinking", "speaking"].includes(this.phase)
      || (this.phase === "listening" && !!this.t.speechStart); // someone is talking
  }

  /** Push-to-talk button: one listening turn (when not always-listening). */
  async startTurn() {
    if (this.continuous) return this.engage("button");
    if (this.phase !== "idle") return console.log(`conversation: busy (${this.phase}), ignoring button`);
    await this.listen({ timeout: true });
  }

  /** Always-listening on/off (on by default once connected). Returns the new state. */
  async setContinuous(on: boolean): Promise<boolean> {
    if (on === this.continuous) return on;
    this.continuous = on;
    if (!on) {
      if (this.phase === "listening" || this.phase === "muted") await this.endTurn();
      this.disengage();
      await this.flash("🔇 Not listening");
    } else if (this.phase === "idle") {
      await this.listen({ timeout: false });
    }
    return on;
  }

  /** Bumper tap: interrupts him if he's talking, otherwise starts a
   * conversation without the wake word. */
  bumperTap() {
    if (this.phase === "speaking") return this.interrupt("bumper");
    if (this.continuous) this.engage("bumper");
  }

  /** Start a conversation without the wake word (bumper tap, button). */
  private engage(why: string) {
    console.log(`conversation: engaged by ${why}`);
    this.engagedUntil = performance.now() + TURN.ENGAGED_MS;
    if (this.phase === "listening") this.showAttentive();
  }

  /** Doodlebot is about to talk outside the conversation (drag comment,
   * green flag): keep the mic closed until he's done. */
  muteFor(ms: number) {
    this.mutedUntil = Math.max(this.mutedUntil, performance.now() + ms + TURN.RESUME_AFTER_SPEECH_MS);
    if (this.phase !== "listening" || this.t.speechStart) return; // mid-utterance: let the child finish
    this.phase = "muted";
    this.clearTimers();
    void this.closeMic();
    this.later(this.mutedUntil - performance.now(), () => this.resume());
  }

  private async resume() {
    const wait = this.mutedUntil - performance.now();
    if (wait > 0) return this.later(wait, () => this.resume());
    if (this.phase !== "muted" && this.phase !== "idle") return;
    if (this.continuous) await this.listen({ timeout: false });
    else await this.endTurn();
  }

  // ---- what he shows while listening

  /** Ring on, ready face. */
  private showAttentive() {
    this.hooks.claim("ring", this.t.speechStart ? "hear" : "listen");
    this.hooks.claim("mouth", "none");
    this.hooks.face("tega", TURN.LISTEN_FACE);
  }

  /** Conversation over: hand the ring/gaze/mouth back to the other layers. */
  private disengage() {
    this.engagedUntil = 0;
    this.wakeHeard = false;
    this.hooks.release("ring", "gaze", "mouth");
  }

  // ---- listening

  private async listen({ timeout }: { timeout: boolean }) {
    this.clearTimers();
    this.t = { pressed: performance.now() };
    try {
      if (!this.vad) {
        this.phase = "loading";
        await this.setStatus("Getting ready to listen…");
        this.vad = await this.createVad();
      }
      if (performance.now() < this.mutedUntil) {
        this.phase = "muted";
        return this.later(this.mutedUntil - performance.now(), () => this.resume());
      }
      this.phase = "listening";
      this.transcript = { final: "", interim: "" };
      this.wakeHeard = false;
      const waiting = this.continuous && !this.engaged;
      if (waiting) this.hooks.release("ring", "gaze", "mouth"); // just ambient listening
      else this.showAttentive();
      this.startRecognizer();
      await this.vad.start();
      this.t.micOpen = performance.now();
      await this.setStatus(waiting
        ? `🎙 Say "Hey ${this.displayName()}" or tap his bumper`
        : this.continuous ? "👂 Listening…" : "🎤 Listening… talk to Doodlebot");
      if (timeout) {
        this.later(TURN.NO_SPEECH_TIMEOUT_MS, () => {
          if (this.phase === "listening" && !this.t.speechStart) {
            console.log("conversation: no speech, closing the mic");
            this.endTurn();
          }
        });
      }
      if (this.continuous && this.engaged) {
        // follow-up window closes: go back to waiting for his name
        this.later(this.engagedUntil - performance.now(), () => {
          if (this.phase === "listening" && !this.t.speechStart && !this.engaged) {
            this.disengage();
            void this.setStatus(`🎙 Say "Hey ${this.displayName()}" or tap his bumper`);
          }
        });
      }
    } catch (error) {
      console.error("conversation: could not start listening", error);
      this.continuous = false;
      await this.setStatus("Couldn't open the microphone");
      this.later(3000, () => this.endTurn());
    }
  }

  private async createVad() {
    await loadScript(`${ORT_BASE}ort.wasm.min.js`);
    await loadScript(`${VAD_BASE}bundle.min.js`);
    const w = window as any;
    w.ort.env.wasm.numThreads = 1; // no cross-origin isolation on this page
    return await w.vad.MicVAD.new({
      model: "v5",
      baseAssetPath: VAD_BASE,
      onnxWASMBasePath: ORT_BASE,
      startOnLoad: false,
      redemptionMs: TURN.END_OF_SPEECH_MS,
      minSpeechMs: 250,
      preSpeechPadMs: 300,
      onSpeechStart: () => this.onSpeechStart(),
      onSpeechEnd: () => this.onSpeechEnd(),
      onVADMisfire: () => console.log("conversation: too short to count as speech"),
    });
  }

  private newRecognizer(onText: (final: string, interim: string) => void) {
    const w = window as any;
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) {
      console.warn("conversation: no Web Speech API in this browser (use Chrome)");
      return null;
    }
    const recognizer = new Recognition();
    recognizer.lang = "en-US";
    recognizer.interimResults = true;
    recognizer.continuous = true;
    let final = "";
    recognizer.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) final += result[0].transcript;
        else interim += result[0].transcript;
      }
      onText(final, interim);
    };
    recognizer.onerror = (event: any) => {
      if (event.error !== "no-speech" && event.error !== "aborted") console.log("conversation: speech recognition", event.error);
    };
    return recognizer;
  }

  private startRecognizer() {
    const recognizer = this.newRecognizer((final, interim) => {
      this.transcript = { final, interim };
      // react the moment he hears his name, while the child is still talking
      if (this.continuous && !this.engaged && !this.wakeHeard && this.phase === "listening"
        && matchWakeWord(`${final} ${interim}`, this.hooks.robotName()) !== null) {
        this.wakeHeard = true;
        this.hooks.activity();
        this.showAttentive();
        void this.setStatus("👂 Listening…");
      }
    });
    if (!recognizer) return (this.recognizer = null);
    this.recognizerEnded = new Promise((resolve) => {
      recognizer.onend = () => {
        resolve();
        // Chrome ends recognition on its own after a while of silence; while
        // we're still listening, start it again
        if (this.recognizer === recognizer && this.phase === "listening") {
          try { recognizer.start(); } catch { /* already restarting */ }
        }
      };
    });
    recognizer.start();
    this.recognizer = recognizer;
  }

  private onSpeechStart() {
    if (this.phase !== "listening") return;
    this.t.speechStart = performance.now();
    this.hooks.activity();
    if (!this.continuous || this.engaged || this.wakeHeard) this.hooks.claim("ring", "hear");
    this.later(TURN.MAX_UTTERANCE_MS, () => {
      if (this.phase === "listening") this.onSpeechEnd();
    });
  }

  private async onSpeechEnd() {
    if (this.phase !== "listening") return;
    this.phase = "thinking";
    this.clearTimers();
    this.t.speechEnd = performance.now();
    const recognizer = this.recognizer;
    this.recognizer = null; // stop the auto-restart
    await this.closeMic(recognizer);

    // the final transcript lands shortly after the recognizer stops
    await Promise.race([this.recognizerEnded, sleep(TURN.TRANSCRIPT_WAIT_MS)]);
    const heard = (this.transcript.final || this.transcript.interim).trim();
    this.t.transcript = performance.now();

    if (!heard && this.continuous) {
      // noise (motors, a cough, chatter): don't answer, just keep listening
      console.log("conversation: nothing intelligible; still listening");
      return this.listen({ timeout: false });
    }
    if (this.continuous && !this.engaged && matchWakeWord(heard, this.hooks.robotName()) === null) {
      // not addressed to him: side talk, talking to the researcher, ...
      console.log(`conversation: not addressed to ${this.displayName()}: "${heard}"`);
      return this.listen({ timeout: false });
    }
    console.log(`conversation: heard "${heard}"`);
    this.hooks.activity();
    this.hooks.claim("ring", "think");
    this.hooks.face("tega", TURN.THINK_FACE);
    await this.setStatus("Thinking…");

    let interrupted = false;
    let finished = false;
    try {
      const reply = await this.hooks.respond(heard);
      this.t.reply = performance.now();
      interrupted = await this.say(reply);
      finished = !!reply.done && !interrupted;
    } catch (error) {
      console.error("conversation: reply failed", error);
    }
    this.t.done = performance.now();
    this.logTimings(heard, interrupted);

    if (this.continuous) {
      const pause = interrupted ? TURN.RESUME_AFTER_INTERRUPT_MS : TURN.RESUME_AFTER_SPEECH_MS;
      this.phase = "muted";
      this.mutedUntil = interrupted ? performance.now() + pause : Math.max(this.mutedUntil, performance.now() + pause);
      if (finished) {
        // "okay thanks, bye!": the exchange is over, so don't hold the floor
        console.log("conversation: wrapped up; waiting for his name again");
        this.disengage();
      } else {
        // follow-ups within the window need no wake word
        this.engagedUntil = performance.now() + pause + TURN.ENGAGED_MS;
      }
      this.later(pause, () => this.resume());
    } else {
      this.disengage();
      await this.endTurn();
    }
  }

  // ---- speaking (interruptible)

  /** Speak a reply; returns true if he was cut off. */
  private async say(reply: Reply): Promise<boolean> {
    this.phase = "speaking";
    this.hooks.activity();
    this.hooks.release("ring"); // ring off while he talks, like Jibo
    await this.setStatus("💬 Doodlebot is talking… (say “stop” or tap him to interrupt)");
    if (reply.motion) this.hooks.express(reply.motion);

    let sentAt = 0;
    let durationMs = 0;
    let wasInterrupted = false;
    const cutOff = new Promise<void>((resolve) => {
      this.stopSpeaking = () => { wasInterrupted = true; resolve(); };
    });
    this.startBargeListener(reply.say);
    await Promise.race([
      this.hooks.speak(reply.say, (ms) => { sentAt = performance.now(); durationMs = ms; this.t.audioSent = sentAt; }),
      cutOff,
    ]);
    this.stopBargeListener();
    this.stopSpeaking = null;

    if (wasInterrupted) {
      // tell the LLM roughly what he got out before being cut off
      const fraction = sentAt && durationMs ? Math.min(1, (performance.now() - sentAt) / durationMs) : 0;
      const all = reply.say.split(/\s+/);
      this.hooks.interrupted(all.slice(0, Math.round(all.length * fraction)).join(" "));
    }
    return wasInterrupted;
  }

  /** Cut him off mid-sentence (reflex): stop the audio, start listening. */
  interrupt(why: string) {
    if (this.phase !== "speaking" || !this.stopSpeaking) return;
    console.log(`conversation: interrupted (${why})`);
    this.hooks.hush();
    this.hooks.claim("ring", "listen");
    this.hooks.face("tega", TURN.LISTEN_FACE);
    this.stopSpeaking();
  }

  /** While he talks, listen only for NEW words that mean "stop" or address him. */
  private startBargeListener(sentence: string) {
    const listener = this.newRecognizer((final, interim) => {
      if (isBargeIn(`${final} ${interim}`, sentence, this.hooks.robotName())) this.interrupt("voice");
    });
    if (!listener) return;
    listener.onend = () => {
      if (this.bargeListener === listener) {
        try { listener.start(); } catch { /* already restarting */ }
      }
    };
    try { listener.start(); } catch (error) { console.log("conversation: barge-in listener", error); }
    this.bargeListener = listener;
  }

  private stopBargeListener() {
    const listener = this.bargeListener;
    this.bargeListener = null;
    try { listener?.abort(); } catch { /* already stopped */ }
  }

  // ---- plumbing

  private async closeMic(recognizer = this.recognizer) {
    try { await this.vad?.pause(); } catch (error) { console.log("conversation: vad pause", error); }
    try { recognizer?.stop(); } catch (error) { console.log("conversation: recognizer stop", error); }
  }

  private async endTurn() {
    this.clearTimers();
    const recognizer = this.recognizer;
    this.recognizer = null;
    await this.closeMic(recognizer);
    this.closeStatus?.();
    this.closeStatus = null;
    this.phase = "idle";
  }

  private async setStatus(msg: string) {
    this.closeStatus?.();
    this.closeStatus = null;
    try {
      this.closeStatus = await this.hooks.status(msg);
    } catch (error) {
      console.log("conversation: status", error);
    }
  }

  private async flash(msg: string) {
    await this.setStatus(msg);
    setTimeout(() => { if (this.phase === "idle") { this.closeStatus?.(); this.closeStatus = null; } }, 2000);
  }

  private displayName() {
    const name = this.hooks.robotName() || "Doodlebot";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private later(ms: number, fn: () => void) {
    this.timers.push(setTimeout(fn, Math.max(0, ms)));
  }

  private clearTimers() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  /** Per-turn latency log: where did the time go? */
  private logTimings(heard: string, interrupted: boolean) {
    const t = this.t;
    const ms = (a: string, b: string) => (t[a] && t[b] ? Math.round(t[b] - t[a]) : null);
    console.table({
      "child talking": ms("speechStart", "speechEnd"),
      "speech end → transcript": ms("speechEnd", "transcript"),
      "transcript → reply text": ms("transcript", "reply"),
      "reply → audio sent (TTS)": ms("reply", "audioSent"),
      "⏱ speech end → robot starts talking": ms("speechEnd", "audioSent"),
      "robot talking": ms("audioSent", "done"),
    });
    console.log(`conversation: turn done (heard "${heard}")${interrupted ? " — he was interrupted" : ""}`);
  }
}
