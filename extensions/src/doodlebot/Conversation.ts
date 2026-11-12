// Turn-based voice conversation with Doodlebot (study prototype).
//
// One button press = one turn. The laptop mic is ONLY open while listening:
// the robot's speaker sits right next to the mic, so it must never be live
// while Doodlebot talks.
//
//   idle --press--> listening (mic ON) --speech ends--> thinking (mic OFF)
//        --> speaking (mic OFF) --> idle
//
// Voice activity detection: Silero VAD in the browser (@ricky0123/vad-web,
// loaded from a pinned CDN). Speech to text: Chrome's Web Speech API (a
// prototype stand-in; it sends audio to Google, so swap before the study).
// The reply comes from `respond`, a placeholder until the LLM is hooked up.

const VAD_BASE = "https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.31/dist/";
const ORT_BASE = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/";

export type Reply = { say: string; motion?: string };

export type ConversationHooks = {
  /** r1d1v2 face command, e.g. ("tega", "SILENT_THINKING") */
  face: (...args: (string | number)[]) => void;
  /** speak via TTS on the robot; calls onSent as the audio heads to the
   * robot, resolves when playback should be done */
  speak: (text: string, onSent: () => void) => Promise<void>;
  /** show a short status in the Doodlebot category; returns a closer */
  status: (msg: string) => Promise<() => void>;
  /** produce the robot's reply to what the child said */
  respond: (heard: string) => Promise<Reply>;
};

export const TURN = {
  LISTEN_FACE: "SILENT_INTERESTED",
  THINK_FACE: "SILENT_THINKING",
  NO_SPEECH_TIMEOUT_MS: 8000, // mic closes if nobody starts talking
  MAX_UTTERANCE_MS: 20000, // hard cap on one turn of child speech
  END_OF_SPEECH_MS: 700, // silence that ends the child's turn (lower = snappier, more cut-offs)
  TRANSCRIPT_WAIT_MS: 1200, // max wait for the final transcript after speech ends
};

type Phase = "idle" | "loading" | "listening" | "thinking" | "speaking";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export class Conversation {
  phase: Phase = "idle";
  private vad: any = null;
  private recognizer: any = null;
  private transcript = { final: "", interim: "" };
  private recognizerEnded: Promise<void> = Promise.resolve();
  private closeStatus: (() => void) | null = null;
  private timers: ReturnType<typeof setTimeout>[] = [];
  private t: Record<string, number> = {};

  constructor(private hooks: ConversationHooks) { }

  /** The "Speak to Doodlebot" button: start one listening turn. */
  async startTurn() {
    if (this.phase !== "idle") {
      console.log(`conversation: busy (${this.phase}), ignoring button`);
      return;
    }
    this.t = { pressed: performance.now() };
    try {
      if (!this.vad) {
        this.phase = "loading";
        await this.setStatus("Getting ready to listen…");
        this.vad = await this.createVad();
      }
      this.phase = "listening";
      this.transcript = { final: "", interim: "" };
      this.hooks.face("tega", TURN.LISTEN_FACE);
      this.startRecognizer();
      await this.vad.start();
      this.t.micOpen = performance.now();
      await this.setStatus("🎤 Listening… talk to Doodlebot");
      this.later(TURN.NO_SPEECH_TIMEOUT_MS, () => {
        if (this.phase === "listening" && !this.t.speechStart) {
          console.log("conversation: no speech, closing the mic");
          this.endTurn();
        }
      });
    } catch (error) {
      console.error("conversation: could not start listening", error);
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

  private startRecognizer() {
    const w = window as any;
    const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Recognition) {
      console.warn("conversation: no Web Speech API in this browser (use Chrome)");
      this.recognizer = null;
      return;
    }
    const recognizer = new Recognition();
    recognizer.lang = "en-US";
    recognizer.interimResults = true;
    recognizer.continuous = true;
    recognizer.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) this.transcript.final += result[0].transcript;
        else interim += result[0].transcript;
      }
      this.transcript.interim = interim;
    };
    recognizer.onerror = (event: any) => console.log("conversation: speech recognition", event.error);
    this.recognizerEnded = new Promise((resolve) => { recognizer.onend = () => resolve(); });
    recognizer.start();
    this.recognizer = recognizer;
  }

  private onSpeechStart() {
    if (this.phase !== "listening") return;
    this.t.speechStart = performance.now();
    this.later(TURN.MAX_UTTERANCE_MS, () => {
      if (this.phase === "listening") this.onSpeechEnd();
    });
  }

  private async onSpeechEnd() {
    if (this.phase !== "listening") return;
    this.phase = "thinking";
    this.t.speechEnd = performance.now();
    await this.closeMic();
    this.hooks.face("tega", TURN.THINK_FACE);
    await this.setStatus("Thinking…");

    // the final transcript lands shortly after the recognizer stops
    await Promise.race([
      this.recognizerEnded,
      new Promise((resolve) => setTimeout(resolve, TURN.TRANSCRIPT_WAIT_MS)),
    ]);
    const heard = (this.transcript.final || this.transcript.interim).trim();
    this.t.transcript = performance.now();
    console.log(`conversation: heard "${heard}"`);

    try {
      const reply = await this.hooks.respond(heard);
      this.t.reply = performance.now();
      this.phase = "speaking";
      await this.setStatus("Doodlebot is talking…");
      if (reply.motion) this.hooks.face("tega", reply.motion);
      await this.hooks.speak(reply.say, () => { this.t.audioSent = performance.now(); });
    } catch (error) {
      console.error("conversation: reply failed", error);
    }
    this.t.done = performance.now();
    this.logTimings(heard);
    this.endTurn();
  }

  private async closeMic() {
    try { await this.vad?.pause(); } catch (error) { console.log("conversation: vad pause", error); }
    try { this.recognizer?.stop(); } catch (error) { console.log("conversation: recognizer stop", error); }
  }

  private async endTurn() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    await this.closeMic();
    this.recognizer = null;
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

  private later(ms: number, fn: () => void) {
    this.timers.push(setTimeout(fn, ms));
  }

  /** Per-turn latency log: where did the time go? */
  private logTimings(heard: string) {
    const t = this.t;
    const ms = (a: string, b: string) => (t[a] && t[b] ? Math.round(t[b] - t[a]) : null);
    console.table({
      "press → mic open": ms("pressed", "micOpen"),
      "child talking": ms("speechStart", "speechEnd"),
      "speech end → transcript": ms("speechEnd", "transcript"),
      "transcript → reply text": ms("transcript", "reply"),
      "reply → audio sent (TTS)": ms("reply", "audioSent"),
      "⏱ speech end → robot starts talking": ms("speechEnd", "audioSent"),
      "robot talking": ms("audioSent", "done"),
    });
    console.log(`conversation: turn done (heard "${heard}")`);
  }
}
