import type Target from "$root/packages/scratch-vm/src/engine/target";
import type { EventEmitter } from "events";

/**
 * Built from utility repo: https://github.com/mitmedialab/scratch-audio-with-types
 */

export declare class SoundBank {
    /**
     * A bank of sounds that can be played.
     * @constructor
     * @param {AudioEngine} audioEngine - related AudioEngine
     * @param {EffectChain} effectChainPrime - original EffectChain cloned for
     *     playing sounds
     */
    constructor(audioEngine: AudioEngine, effectChainPrime: EffectChain);
    /**
     * AudioEngine this SoundBank is related to.
     * @type {AudioEngine}
     */
    audioEngine: AudioEngine;
    /**
     * Map of ids to soundPlayers.
     * @type {object<SoundPlayer>}
     */
    soundPlayers: object;
    /**
     * Map of targets by sound id.
     * @type {Map<string, Target>}
     */
    playerTargets: Map<string, Target>;
    /**
     * Map of effect chains by sound id.
     * @type {Map<string, EffectChain>}
     */
    soundEffects: Map<string, EffectChain>;
    /**
     * Original EffectChain cloned for every playing sound.
     * @type {EffectChain}
     */
    effectChainPrime: EffectChain;
    /**
     * Add a sound player instance likely from AudioEngine.decodeSoundPlayer
     * @param {SoundPlayer} soundPlayer - SoundPlayer to add
     */
    addSoundPlayer(soundPlayer: SoundPlayer): void;
    /**
     * Get a sound player by id.
     * @param {string} soundId - sound to look for
     * @returns {SoundPlayer} instance of sound player for the id
     */
    getSoundPlayer(soundId: string): SoundPlayer;
    /**
     * Get a sound EffectChain by id.
     * @param {string} sound - sound to look for an EffectChain
     * @returns {EffectChain} available EffectChain for this id
     */
    getSoundEffects(sound: string): EffectChain;
    /**
     * Play a sound.
     * @param {Target} target - Target to play for
     * @param {string} soundId - id of sound to play
     * @returns {Promise} promise that resolves when the sound finishes playback
     */
    playSound(target: Target, soundId: string): Promise<any>;
    /**
     * Set the effects (pan, pitch, and volume) from values on the given target.
     * @param {Target} target - target to set values from
     */
    setEffects(target: Target): void;
    /**
     * Stop playback of sound by id if was lasted played by the target.
     * @param {Target} target - target to check if it last played the sound
     * @param {string} soundId - id of the sound to stop
     */
    stop(target: Target, soundId: string): void;
    /**
     * Stop all sounds for all targets or a specific target.
     * @param {Target|string} target - a symbol for all targets or the target
     *     to stop sounds for
     */
    stopAllSounds(target?: Target | string): void;
    /**
     * Dispose of all EffectChains and SoundPlayers.
     */
    dispose(): void;
}

export declare class AudioEngine {
    constructor(audioContext?: any);
    /**
     * AudioContext to play and manipulate sounds with a graph of source
     * and effect nodes.
     * @type {AudioContext}
     */
    audioContext: AudioContext;
    /**
     * Master GainNode that all sounds plays through. Changing this node
     * will change the volume for all sounds.
     * @type {GainNode}
     */
    inputNode: GainNode;
    /**
     * a map of soundIds to audio buffers, holding sounds for all sprites
     * @type {Object<String, ArrayBuffer>}
     */
    audioBuffers: any;
    /**
     * A Loudness detector.
     * @type {Loudness}
     */
    loudness: Loudness;
    /**
     * Array of effects applied in order, left to right,
     * Left is closest to input, Right is closest to output
     */
    effects: (typeof VolumeEffect | typeof PanEffect | typeof PitchEffect)[];
    /**
     * Current time in the AudioEngine.
     * @type {number}
     */
    get currentTime(): number;
    /**
     * Names of the audio effects.
     * @enum {string}
     */
    get EFFECT_NAMES(): {
        pitch: string;
        pan: string;
    };
    /**
     * A short duration to transition audio prarameters.
     *
     * Used as a time constant for exponential transitions. A general value
     * must be large enough that it does not cute off lower frequency, or bass,
     * sounds. Human hearing lower limit is ~20Hz making a safe value 25
     * milliseconds or 0.025 seconds, where half of a 20Hz wave will play along
     * with the DECAY. Higher frequencies will play multiple waves during the
     * same amount of time and avoid clipping.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime}
     * @const {number}
     */
    get DECAY_DURATION(): number;
    /**
     * Some environments cannot smoothly change parameters immediately, provide
     * a small delay before decaying.
     *
     * @see {@link https://bugzilla.mozilla.org/show_bug.cgi?id=1228207}
     * @const {number}
     */
    get DECAY_WAIT(): number;
    /**
     * Get the input node.
     * @return {AudioNode} - audio node that is the input for this effect
     */
    getInputNode(): AudioNode;
    /**
     * Decode a sound, decompressing it into audio samples.
     * @param {object} sound - an object containing audio data and metadata for
     *     a sound
     * @param {Buffer} sound.data - sound data loaded from scratch-storage
     * @returns {?Promise} - a promise which will resolve to the sound id and
     *     buffer if decoded
     */
    _decodeSound(sound: {
        data: Buffer;
    }): Promise<any> | null;
    /**
     * An empty sound buffer, for use when we are unable to decode a sound file.
     * @returns {AudioBuffer} - an empty audio buffer.
     */
    _emptySound(): AudioBuffer;
    /**
     * Decode a sound, decompressing it into audio samples.
     *
     * Store a reference to it the sound in the audioBuffers dictionary,
     * indexed by soundId.
     *
     * @param {object} sound - an object containing audio data and metadata for
     *     a sound
     * @param {Buffer} sound.data - sound data loaded from scratch-storage
     * @returns {?Promise} - a promise which will resolve to the sound id
     */
    decodeSound(sound: {
        data: Buffer;
    }): Promise<any> | null;
    /**
     * Decode a sound, decompressing it into audio samples.
     *
     * Create a SoundPlayer instance that can be used to play the sound and
     * stop and fade out playback.
     *
     * @param {object} sound - an object containing audio data and metadata for
     *     a sound
     * @param {Buffer} sound.data - sound data loaded from scratch-storage
     * @returns {?Promise} - a promise which will resolve to the buffer
     */
    decodeSoundPlayer(sound: {
        data: Buffer;
    }): Promise<SoundPlayer> | null;
    /**
     * Get the current loudness of sound received by the microphone.
     * Sound is measured in RMS and smoothed.
     * @return {number} loudness scaled 0 to 100
     */
    getLoudness(): number;
    /**
     * Create an effect chain.
     * @returns {EffectChain} chain of effects defined by this AudioEngine
     */
    createEffectChain(): EffectChain;
    /**
     * Create a sound bank and effect chain.
     * @returns {SoundBank} a sound bank configured with an effect chain
     *     defined by this AudioEngine
     */
    createBank(): SoundBank;
}

export type EffectChain = {
    /**
     * Chain of effects that can be applied to a group of SoundPlayers.
     * @param {AudioEngine} audioEngine - engine whose effects these belong to
     * @param {Array<Effect>} effects - array of Effect classes to construct
     */
    constructor(audioEngine: AudioEngine, effects: Array<Effect>);
    /**
     * AudioEngine whose effects these belong to.
     * @type {AudioEngine}
     */
    audioEngine: AudioEngine;
    /**
     * Node incoming connections will attach to. This node than connects to
     * the items in the chain which finally connect to some output.
     * @type {AudioNode}
     */
    inputNode: AudioNode;
    /**
     * List of Effect types to create.
     * @type {Array<Effect>}
     */
    effects: Array<Effect>;
    /**
     * List of instantiated Effects.
     * @type {Array<Effect>}
     */
    _effects: Array<Effect>;
    /**
     * First effect of this chain.
     * @type {Effect}
     */
    firstEffect: Effect;
    /**
     * Last effect of this chain.
     * @type {Effect}
     */
    lastEffect: Effect;
    /**
     * A set of players this chain is managing.
     */
    _soundPlayers: Set<any>;
    /**
     * Create a clone of the EffectChain.
     * @returns {EffectChain} a clone of this EffectChain
     */
    clone(): EffectChain;
    /**
     * Add a sound player.
     * @param {SoundPlayer} soundPlayer - a sound player to manage
     */
    addSoundPlayer(soundPlayer: SoundPlayer): void;
    /**
     * Remove a sound player.
     * @param {SoundPlayer} soundPlayer - a sound player to stop managing
     */
    removeSoundPlayer(soundPlayer: SoundPlayer): void;
    /**
     * Get the audio input node.
     * @returns {AudioNode} audio node the upstream can connect to
     */
    getInputNode(): AudioNode;
    /**
     * Connnect this player's output to another audio node.
     * @param {object} target - target whose node to should be connected
     */
    connect(target: object): void;
    target: any;
    /**
     * Array of SoundPlayers managed by this EffectChain.
     * @returns {Array<SoundPlayer>} sound players managed by this chain
     */
    getSoundPlayers(): Array<SoundPlayer>;
    /**
     * Set Effect values with named values on target.soundEffects if it exist
     * and then from target itself.
     * @param {Target} target - target to set values from
     */
    setEffectsFromTarget(target: Target): void;
    /**
     * Set an effect value by its name.
     * @param {string} effect - effect name to change
     * @param {number} value - value to set effect to
     */
    set(effect: string, value: number): void;
    /**
     * Update managed sound players with the effects on this chain.
     */
    update(): void;
    /**
     * Clear all effects to their default values.
     */
    clear(): void;
    /**
     * Dispose of all effects in this chain. Nothing is done to managed
     * SoundPlayers.
     */
    dispose(): void;
}

export declare class AudioPlayer {
    // ?? No idea what this is!! //
}

export declare class Effect {
    /**
     * @param {AudioEngine} audioEngine - audio engine this runs with
     * @param {AudioPlayer} audioPlayer - audio player this affects
     * @param {Effect} lastEffect - effect in the chain before this one
     * @constructor
     */
    constructor(audioEngine: AudioEngine, audioPlayer: AudioPlayer, lastEffect: Effect);
    audioEngine: AudioEngine;
    audioPlayer: AudioPlayer;
    lastEffect: Effect;
    value: number;
    initialized: boolean;
    inputNode: any;
    outputNode: any;
    target: any;
    /**
     * Return the name of the effect.
     * @type {string}
     */
    get name(): string;
    /**
     * Default value to set the Effect to when constructed and when clear'ed.
     * @const {number}
     */
    get DEFAULT_VALUE(): number;
    /**
     * Should the effect be connected to the audio graph?
     * The pitch effect is an example that does not need to be patched in.
     * Instead of affecting the graph it affects the player directly.
     * @return {boolean} is the effect affecting the graph?
     */
    get _isPatch(): boolean;
    /**
     * Get the input node.
     * @return {AudioNode} - audio node that is the input for this effect
     */
    getInputNode(): AudioNode;
    /**
     * Initialize the Effect.
     * Effects start out uninitialized. Then initialize when they are first set
     * with some value.
     * @throws {Error} throws when left unimplemented
     */
    initialize(): void;
    /**
     * Set the effects value.
     * @private
     * @param {number} value - new value to set effect to
     */
    private _set;
    /**
     * Set the effects value.
     * @param {number} value - new value to set effect to
     */
    set(value: number): void;
    _lastPatch: any;
    /**
     * Update the effect for changes in the audioPlayer.
     */
    update(): void;
    /**
     * Clear the value back to the default.
     */
    clear(): void;
    /**
     * Connnect this effect's output to another audio node
     * @param {object} target - target whose node to should be connected
     */
    connect(target: object): void;
    /**
     * Clean up and disconnect audio nodes.
     */
    dispose(): void;
}

export declare class VolumeEffect extends Effect { }

export declare class PitchEffect extends Effect {
    /**
     * The playback rate ratio
     * @type {Number}
     */
    ratio: number;

    /**
     * Compute the playback ratio for an effect value.
     * The playback ratio is scaled so that a change of 10 in the effect value
     * gives a change of 1 semitone in the ratio.
     * @param {number} val - an effect value
     * @returns {number} a playback ratio
     */
    getRatio(val: number): number;
    /**
     * Update a sound player's playback rate using the current ratio for the
     * effect
     * @param {object} player - a SoundPlayer object
     */
    updatePlayer(player: object): void;
    /**
     * Update a sound player's playback rate using the current ratio for the
     * effect
     * @param {object} players - a dictionary of SoundPlayer objects to update,
     *     indexed by md5
     */
    updatePlayers(players: object): void;
}

export declare class PanEffect extends Effect {
    leftGain: any;
    rightGain: any;
    channelMerger: any;
}

export declare class Loudness {
    /**
     * Instrument and detect a loudness value from a local microphone.
     * @param {AudioContext} audioContext - context to create nodes from for
     *     detecting loudness
     * @constructor
     */
    constructor(audioContext: AudioContext);
    /**
     * AudioContext the mic will connect to and provide analysis of
     * @type {AudioContext}
     */
    audioContext: AudioContext;
    /**
     * Are we connecting to the mic yet?
     * @type {Boolean}
     */
    connectingToMic: boolean;
    /**
     * microphone, for measuring loudness, with a level meter analyzer
     * @type {MediaStreamSourceNode}
     */
    mic: ReturnType<AudioContext["createMediaStreamSource"]>;
    /**
     * Get the current loudness of sound received by the microphone.
     * Sound is measured in RMS and smoothed.
     * Some code adapted from Tone.js: https://github.com/Tonejs/Tone.js
     * @return {number} loudness scaled 0 to 100
     */
    getLoudness(): number;
    audioStream: MediaStream;
    analyser: AnalyserNode;
    micDataArray: Float32Array;
    _lastValue: number;
}

export declare class SoundPlayer extends EventEmitter {
    /**
     * Play sounds that stop without audible clipping.
     *
     * @param {AudioEngine} audioEngine - engine to play sounds on
     * @param {object} data - required data for sound playback
     * @param {string} data.id - a unique id for this sound
     * @param {ArrayBuffer} data.buffer - buffer of the sound's waveform to play
     * @constructor
     */
    constructor(audioEngine: AudioEngine, { id, buffer }: {
        id: string;
        buffer: ArrayBuffer;
    });
    /**
     * Unique sound identifier set by AudioEngine.
     * @type {string}
     */
    id: string;
    /**
     * AudioEngine creating this sound player.
     * @type {AudioEngine}
     */
    audioEngine: AudioEngine;
    /**
     * Decoded audio buffer from audio engine for playback.
     * @type {AudioBuffer}
     */
    buffer: AudioBuffer;
    /**
     * Output audio node.
     * @type {AudioNode}
     */
    outputNode: AudioNode;
    /**
     * VolumeEffect used to fade out playing sounds when stopping them.
     * @type {VolumeEffect}
     */
    volumeEffect: VolumeEffect;
    /**
     * Target engine, effect, or chain this player directly connects to.
     * @type {AudioEngine|Effect|EffectChain}
     */
    target: AudioEngine | Effect | EffectChain;
    /**
     * Internally is the SoundPlayer initialized with at least its buffer
     * source node and output node.
     * @type {boolean}
     */
    initialized: boolean;
    /**
     * Is the sound playing or starting to play?
     * @type {boolean}
     */
    isPlaying: boolean;
    /**
     * Timestamp sound is expected to be starting playback until. Once the
     * future timestamp is reached the sound is considered to be playing
     * through the audio hardware and stopping should fade out instead of
     * cutting off playback.
     * @type {number}
     */
    startingUntil: number;
    /**
     * Rate to play back the audio at.
     * @type {number}
     */
    playbackRate: number;
    /**
     * Handle any event we have told the output node to listen for.
     * @param {Event} event - dom event to handle
     */
    handleEvent(event: Event): void;
    /**
     * Is plaback currently starting?
     * @type {boolean}
     */
    get isStarting(): boolean;
    /**
     * Event listener for when playback ends.
     */
    onEnded(): void;
    /**
     * Create the buffer source node during initialization or secondary
     * playback.
     */
    _createSource(): void;
    /**
     * Initialize the player for first playback.
     */
    initialize(): void;
    /**
     * Connect the player to the engine or an effect chain.
     * @param {object} target - object to connect to
     * @returns {object} - return this sound player
     */
    connect(target: object): object;
    /**
     * Teardown the player.
     */
    dispose(): void;
    /**
     * Take the internal state of this player and create a new player from
     * that. Restore the state of this player to that before its first playback.
     *
     * The returned player can be used to stop the original playback or
     * continue it without manipulation from the original player.
     *
     * @returns {SoundPlayer} - new SoundPlayer with old state
     */
    take(): SoundPlayer;
    /**
     * Start playback for this sound.
     *
     * If the sound is already playing it will stop playback with a quick fade
     * out.
     */
    play(): void;
    /**
     * Stop playback after quickly fading out.
     */
    stop(): void;
    /**
     * Stop immediately without fading out. May cause audible clipping.
     */
    stopImmediately(): void;
    /**
     * Return a promise that resolves when the sound next finishes.
     * @returns {Promise} - resolves when the sound finishes
     */
    finished(): Promise<any>;
    /**
     * Set the sound's playback rate.
     * @param {number} value - playback rate. Default is 1.
     */
    setPlaybackRate(value: number): void;
}
