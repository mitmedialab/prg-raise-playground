const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const Timer = require('../../util/timer');
const log = require('../../util/log');
const { clamp } = require('../../util/math-util');
const { p } = require('./letters');
const BlockUtility = require('../../engine/block-utility');
const VizHelpers = require('./vizhelpers');

/**
 * The instrument and drum sounds, loaded as static assets.
 * @type {object}
 */
let assetData = {};

try {
    assetData = require('./manifest');
} catch (e) {
    // Non-webpack environment, don't worry about assets.
}

var globalVolume;

class MusicCreationHelpers {
    constructor(runtime) {
        this.runtime = runtime;
        this._stopped = false;

        /**
         * An array of arrays of sound players. Each instrument has one or more audio players.
         * @type {Array[]}
         * @private
         */
        this._instrumentPlayerArrays = [];

        /**
         * An array of arrays of sound players. Each instrument mya have an audio player for each playable note.
         * @type {Array[]}
         * @private
         */
        this._instrumentPlayerNoteArrays = [];
        this._loadAllSounds();

        this.noteList = [];

        this.instrumentNames = this._buildMenu(this.INSTRUMENT_INFO);

        this._onTargetCreated = this._onTargetCreated.bind(this);
        this.runtime.on('targetWasCreated', this._onTargetCreated);

        this.volumes = [{ text: "pianissimo", value: 15 },
        { text: "piano", value: 30 },
        { text: "mezzo-piano", value: 45 },
        { text: "mezzo-forte", value: 60 },
        { text: "forte", value: 85 },
        { text: "fortissimo", value: 100 }];

        globalVolume = "mezzo-forte";
    }

    /**
     * The key to load & store a target's music-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return 'Scratch.musiccreation';
    }

    /**
     * The default music-related state, to be used when a target has no existing music state.
     * @type {MusicState}
     */
    static get DEFAULT_MUSIC_STATE() {
        return {
            currentInstrument: 0
        };
    }

    /**
     * The minimum and maximum MIDI note numbers, for clamping the input to play note.
     * @type {{min: number, max: number}}
     */
    static get MIDI_NOTE_RANGE() {
        return { min: 0, max: 130 };
    }

    /**
     * The minimum and maximum beat values, for clamping the duration of play note, play drum and rest.
     * 100 beats at the default tempo of 60bpm is 100 seconds.
     * @type {{min: number, max: number}}
     */
    static get BEAT_RANGE() {
        return { min: 0, max: 100 };
    }

    /**
     * The maximum number of sounds to allow to play simultaneously.
     * @type {number}
     */
    static get CONCURRENCY_LIMIT() {
        return 30;
    }

    /**
     * An array of info about each instrument.
     * @type {object[]}
     * @param {string} name - the translatable name to display in the instruments menu.
     * @param {string} dirName - the name of the directory containing audio samples for this instrument.
     * @param {number} [releaseTime] - an optional duration for the release portion of each note.
     * @param {number[]} samples - an array of numbers representing the MIDI note number for each
     *                           sampled sound used to play this instrument.
     */
    get INSTRUMENT_INFO() {
        return [
            {
                name: formatMessage({
                    id: 'musiccreation.instrumentPiano',
                    default: 'Piano',
                    description: 'Sound of a piano'
                }),
                dirName: '1-piano',
                releaseTime: 0.5,
                samples: [24, 36, 48, 60, 72, 84, 96, 108]
            },
            {
                name: formatMessage({
                    id: 'musiccreation.instrumentGuitar',
                    default: 'Guitar',
                    description: 'Sound of an accoustic guitar'
                }),
                dirName: '4-guitar',
                releaseTime: 0.5,
                samples: [60]
            }, {
                name: formatMessage({
                    id: 'musiccreation.instrumentBass',
                    default: 'Bass',
                    description: 'Sound of an accoustic upright bass'
                }),
                dirName: '6-bass',
                releaseTime: 0.25,
                samples: [36, 48]
            },
            {
                name: formatMessage({
                    id: 'musiccreation.instrumentCello',
                    default: 'Cello',
                    description: 'Sound of a cello being played with a bow'
                }),
                dirName: '8-cello',
                releaseTime: 0.1,
                samples: [36, 48, 60]
            },
            {
                name: formatMessage({
                    id: 'musiccreation.instrumentSaxophone',
                    default: 'Saxophone',
                    description: 'Sound of a saxophone being played'
                }),
                dirName: '11-saxophone',
                samples: [36, 60, 84]
            },
            {
                name: formatMessage({
                    id: 'musiccreation.instrumentClarinet',
                    default: 'Clarinet',
                    description: 'Sound of a clarinet being played'
                }),
                dirName: '10-clarinet',
                samples: [48, 60]
            },
            {
                name: formatMessage({
                    id: 'musiccreation.instrumentSynthLead',
                    default: 'Synth',
                    description: 'Sound of a "lead" synthesizer being played'
                }),
                dirName: '20-synth-lead',
                releaseTime: 0.1,
                samples: [24, 36, 48, 60, 72, 84, 96, 108, 120]
            }
        ];
    }

    /**
     * When a music-playing Target is cloned, clone the music state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated(newTarget, sourceTarget) {
        if (sourceTarget) {
            const musicState = sourceTarget.getCustomState(MusicCreationHelpers.STATE_KEY);
            if (musicState) {
                newTarget.setCustomState(MusicCreationHelpers.STATE_KEY, Clone.simple(musicState));
            }
        }
    }

    /**
     * Decode the full set of drum and instrument sounds, and store the audio buffers in arrays.
     */
    _loadAllSounds() {
        const loadingPromises = [];
        this.INSTRUMENT_INFO.forEach((instrumentInfo, instrumentIndex) => {
            this._instrumentPlayerArrays[instrumentIndex] = [];
            this._instrumentPlayerNoteArrays[instrumentIndex] = [];
            instrumentInfo.samples.forEach((sample, noteIndex) => {
                const filePath = `instruments/${instrumentInfo.dirName}/${sample}`;
                const promise = this._storeSound(filePath, noteIndex, this._instrumentPlayerArrays[instrumentIndex]);
                loadingPromises.push(promise);
            });
        });
        Promise.all(loadingPromises).then(() => {
            // @TODO: Update the extension status indicator.
        });
    }

    /**
     * Decode a sound and store the player in an array.
     * @param {string} filePath - the audio file name.
     * @param {number} index - the index at which to store the audio player.
     * @param {array} playerArray - the array of players in which to store it.
     * @return {Promise} - a promise which will resolve once the sound has been stored.
     */
    _storeSound(filePath, index, playerArray) {
        const fullPath = `${filePath}.mp3`;

        if (!assetData[fullPath]) return;

        // The sound player has already been downloaded via the manifest file required above.
        const soundBuffer = assetData[fullPath];

        return this._decodeSound(soundBuffer).then(player => {
            playerArray[index] = player;
        });
    }


    /**
     * Decode a sound and return a promise with the audio buffer.
     * @param  {ArrayBuffer} soundBuffer - a buffer containing the encoded audio.
     * @return {Promise} - a promise which will resolve once the sound has decoded.
     */
    _decodeSound(soundBuffer) {
        return this.runtime.awaitAudioEngine().then(e => e.decodeSoundPlayer({ data: { buffer: soundBuffer } }));
    }

    /**
     * Create data for a menu in scratch-blocks format, consisting of an array of objects with text and
     * value properties. The text is a translated string, and the value is one-indexed.
     * @param  {object[]} info - An array of info objects each having a name property.
     * @return {array} - An array of objects with text and value properties.
     * @private
     */
    _buildMenu(info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = String(index + 1);
            return obj;
        });
    }

    /**
 * @param {Target} target - collect music state for this target.
 * @returns {MusicState} the mutable music state associated with that target. This will be created if necessary.
 * @private
 */
    _getMusicState(target) {
        let musicState = target.getCustomState(MusicCreationHelpers.STATE_KEY);
        if (!musicState) {
            musicState = Clone.simple(MusicCreationHelpers.DEFAULT_MUSIC_STATE);
            target.setCustomState(MusicCreationHelpers.STATE_KEY, musicState);
        }
        return musicState;
    }

    getInstrument(util) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            if (!stage.instrument) {
                stage.instrument = "Piano";
            }
            return stage.instrument;
        }
        return 0;
    }

    /**
     * Internal code to select an instrument for playing notes. If mapMidi is true, set the instrument according to
     * the MIDI to Scratch instrument mapping.
     * @param {number} instNum - the instrument number.
     * @param {object} util - utility object provided by the runtime.
     * @param {boolean} mapMidi - whether or not instNum is a MIDI instrument number.
     */
    _setInstrument(instNum, util, mapMidi) {
        const musicState = this._getMusicState(util.target);
        musicState.currentInstrument = this.getInstrumentValue(instNum);
    }

    getInstrumentValue(instNum) {
        instNum = Cast.toNumber(instNum);
        instNum = Math.round(instNum);
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.instrument = this.findInstrumentForNumber(instNum);
        }
        instNum -= 1; // instruments are one-indexed
        return MathUtil.wrapClamp(instNum, 0, this.INSTRUMENT_INFO.length - 1);
    }

    findInstrumentForNumber(number) {
        for (var m in this.instrumentNames) {
            if (this.instrumentNames[m].value == number) {
                return this.instrumentNames[m].text;
            }
        }
        return "Piano";
    }

    findVolumeForNumber(number) {
        for (var m in this.volumes) {
            if (this.volumes[m].value == number) {
                return this.volumes[m].text;
            }
        }
        return "mezzo-forte";
    }

    /**
     * Convert volume name to number
     * @param {string} volume_name 
     * @returns {number} the matching numerical volume [0,100] or 
     *                          60 as default if no match is found
     */
    findNumberForVolume(volume_name) {
        for (var m in this.volumes) {
            if (this.volumes[m].text === volume_name) {
                return this.volumes[m].value;
            }
        }
        return 60;
    }

    /**
     * Update the current tempo, clamping it to the min and max allowable range.
     * @param {number} tempo - the tempo to set, in beats per minute.
     * @private
     */
    _updateVolume(volume, util) {
        volume = MathUtil.clamp(volume, 0, 100);
        util.target.volume = volume;
        const stage = this.runtime.getTargetForStage();
        globalVolume = this.findVolumeForNumber(volume);
    }

    getVolume(util) {
        return globalVolume;
    }

    /**
     * 
     * @param {object} noteInfo - contains 'NOTE' and 'SECS' fields
     * @param {*} index - the index of this note in 
     *                    the sequence of notes to be played
     * @returns an object with 'note', 'duration', and 'index' fields
     * @private 
     */
    _clamp(noteInfo, index) {
        let note = Cast.toNumber(noteInfo.NOTE);
        note = MathUtil.clamp(note,
            MusicCreationHelpers.MIDI_NOTE_RANGE.min, MusicCreationHelpers.MIDI_NOTE_RANGE.max);
        let beats = Cast.toNumber(noteInfo.SECS);
        beats = this._clampBeats(beats);
        return { note: note, duration: beats, index: index };
    }

    /**
     * Gets the SoundPlayer for this note/instrument combo
     * @param {number} inst 
     * @param {number} note 
     * @returns {SoundPlayer} object for the player 
     * 
     * @see {SoundPlayer} is in the scratch audio node module
     */
    _getPlayer(inst, note) {
        if (!this._instrumentPlayerNoteArrays[inst][note]) {
            this._instrumentPlayerNoteArrays[inst][note] = this._instrumentPlayerArrays[inst][sampleIndex].take();
        }

        const player = this._instrumentPlayerNoteArrays[inst][note];

        if (player.isPlaying && !player.isStarting) {
            // Take the internal player state and create a new player with it.
            player.take();
        }
        return player;
    }

    /**
     * Creates a SoundPlayer for the given note and returns it,
     * along with an object that contains data about the note
     * (including @param dur)
     * @param util 
     * @param {number} note - the frequency of the note to be played
     * @param {flot} dur - duration in secs
     * @returns an object with 'player' and 'data' fields, or null on error
     */
    createPlayer(util, note, dur, inst) {
        // Determine which of the audio samples for this instrument to play
        const instrumentInfo = this.INSTRUMENT_INFO[inst];
        const sampleArray = instrumentInfo.samples;
        const sampleIndex = this._selectSampleIndexForNote(note, sampleArray);
        // If the audio sample has not loaded yet, bail out
        if (typeof this._instrumentPlayerArrays[inst] === 'undefined' ||
            typeof this._instrumentPlayerArrays[inst][sampleIndex] === 'undefined') {
            console.log('uninitialized instruments');
            return null;
        }

        if (!this._instrumentPlayerNoteArrays[inst][note]) {
            this._instrumentPlayerNoteArrays[inst][note] = this._instrumentPlayerArrays[inst][sampleIndex].take();
        }

        const player = this._getPlayer(inst, note);

        return {
            player: player,
            data:
            {
                instInfo: instrumentInfo,
                sampleArray: sampleArray,
                sampleIndex: sampleIndex,
                note: note,
                duration: dur
            }
        };
    }

    /**
     * Plays the note given by @param noteInfo and recursively
     * sets up an event chain to play the rest of the notes in @param seq
     * @param {object} noteInfo - element of @param seq containing
     *                       'note', 'index', and 'beats' fields.
     * @param {Array[]} seq - array of objects containing information about a note and its duration
     * @param {BlockUtility} util 
     * @param {number} l - length of @param seq 
     * @param {VizHelpers} vizHelper
     * @private
     * @augments @param util's stackFrame.duration to be 0 once the last note in @param seq 
     *           has stopped playing. 
     */
    _playNoteFromSeq(noteInfo, seq, util, l, inst, vol, vizHelper, raw_notes) {
        const i = noteInfo['index'];
        const last = i === l - 1;
        const raw_note = raw_notes[i];
        if (this._concurrencyCounter > this.CONCURRENCY_LIMIT) return;
        const playerAndData = this.createPlayer(util, noteInfo['note'], noteInfo['duration'], inst);
        if (!playerAndData) {
            console.log(`null data for note ${noteInfo}`);
            return;
        }
        const player = playerAndData['player'];
        util.sequencer.runtime.once('PROJECT_STOP_ALL', () => {
            this._stopped = true;
            player.stopImmediately();
            if (util.thread && util.thread.peekStackFrame()) util.stackFrame.duration = 0;
            return;
        });
        player.once('stop', () => {
            if ((last || this._stopped) && util.thread && util.thread.peekStackFrame()) {
                util.stackFrame.duration = 0;
            } else {
                this._playNoteFromSeq(seq[i + 1], seq, util, l, inst, vol, vizHelper, raw_notes);
            }
        });
        if (!this._stopped) {
            vizHelper.requestViz(raw_note, util);
            this._activatePlayer(util, playerAndData, vol);
        }
    }

    /**
     * Plays the first note of the given @param seq
     * (note that this also sets off an event chain that plays
     * the rest of the notes in @param seq)
     * @param {BlockUtility} util 
     * @param {Array[]} seq 
     * @param {VizHelpers} vizHelper
     * @requires - each elem in @param seq has 'note', 'duration' and
     * 'index' fields
     */
    playFirstNote(util, seq, inst, vol, vizHelper, raw_notes) {
        const l = seq.length
        if (l === 0) return;
        util.sequencer.runtime.setMaxListeners(Infinity);
        this._playNoteFromSeq(seq[0], seq, util, l, inst, vol, vizHelper, raw_notes);
    }

    /**
     * Plays the sequence of notes given by @param args
     * @param {object} args - contains raw (magenta) notes and 
     *                        cleaned notes with 'mutation', 'NOTE', and 'SECS' fields
     *                        @param args: raw notes --> ['notes']
     *                                     cleaned notes --> ['args']
     * @param {BlockUtility} util 
     * @param {VizHelpers} vizHelper
     */
    playNotes(args, util, inst, vol, vizHelper) {
        let clean_notes = args['args'];
        let raw_notes = args['notes'];
        const l = clean_notes.length;
        let seq = [];
        for (let i = 0; i < l; i++) {
            const noteArg = clean_notes[i];
            seq.push(this._clamp(noteArg, i));
        }
        if (l === 0) return;
        this._stopped = false;
        //begins the chain of events that plays the seq of notes
        this.playFirstNote(util, seq, inst, vol, vizHelper, raw_notes);

        //set the duration to MAX. duration is cut off when the last note ends
        util.stackFrame.duration = Number.MAX_SAFE_INTEGER;
    }

    /**
     * plays the given note
     * @param {BlockUtility} util
     * @param {Array[]} sampleArray - array of samples specific to the instrument
     * @param {number} sampleIndex - an index into @param sampleArray
     * @param {number} note - number corresponding to freq. of the note
     * @param {SoundPlayer} player - sound player specific to this note/inst
     * @param {object} instInfo - contains fields specific to the instrument
     * @param {number} durationSec - duration, in seconds
     * @private
     */
    _initNote(util, sampleArray, sampleIndex, note, player, instInfo, durationSec, vol) {
        // Set its pitch.
        const sampleNote = sampleArray[sampleIndex];
        const notePitchInterval = this._ratioForPitchInterval(note - sampleNote);

        // Fetch the sound player to play the note.
        const engine = util.runtime.audioEngine;

        // Create gain nodes for this note's volume and release, and chain them
        // to the output.
        const context = engine.audioContext;
        const volumeGain = context.createGain();
        volumeGain.gain.setValueAtTime(vol / 100, engine.currentTime);
        const releaseGain = context.createGain();
        volumeGain.connect(releaseGain);
        releaseGain.connect(engine.getInputNode());

        // Schedule the release of the note, ramping its gain down to zero,
        // and then stopping the sound.
        const releaseRatio = instInfo.releaseTime ? instInfo.releaseTime : 0.1;
        const releaseDuration = durationSec * releaseRatio;
        const releaseStart = context.currentTime + durationSec * (1 - releaseRatio);
        const releaseEnd = releaseStart + releaseDuration;
        releaseGain.gain.setValueAtTime(1, releaseStart);
        releaseGain.gain.linearRampToValueAtTime(0.0001, releaseEnd);

        this._concurrencyCounter++;
        player.once('stop', () => {
            this._concurrencyCounter--;
        });
        util.runtime.once('PROJECT_STOP_ALL', () => {
            player.stopImmediately();
            if (util.thread && util.thread.peekStackFrame()) util.stackFrame.duration = 0;
        });

        // Start playing the note
        player.play();
        // Connect the player to the gain node.
        player.connect({
            getInputNode() {
                return volumeGain;
            }
        });
        // Set playback now after play creates the outputNode.
        player.outputNode.playbackRate.value = notePitchInterval;
        // Schedule playback to stop.
        player.outputNode.stop(releaseEnd);
    }

    /**
     * Activates the player in @param playerAndData to play its
     * note, using the data in @param playerAndData to determine
     * the instrument and duration
     * @param {BlockUtility} util 
     * @param {object} playerAndData - contains 'player' and 'data' fields
     * @private
     */
    _activatePlayer(util, playerAndData, vol) {
        // If we're playing too many sounds, do not play the note.
        if (this._concurrencyCounter > MusicCreationHelpers.CONCURRENCY_LIMIT) {
            console.log('concurrency limit reached');
            return;
        }

        if (!playerAndData) {
            console.log('null data');
            return;
        }

        //get note and instrument data
        let player = playerAndData['player'];
        let data = playerAndData['data'];
        let sampleArray = data['sampleArray'];
        let sampleIndex = data['sampleIndex'];
        let instInfo = data['instInfo'];
        let note = data['note'];
        let durationSec = data['duration'];

        this._initNote(util, sampleArray, sampleIndex, note, player, instInfo, durationSec, vol);
    }

    internalPlayNote(args, util, instrument, vol, start_timer) {
        let note = Cast.toNumber(args.NOTE);
        note = MathUtil.clamp(note,
            MusicCreationHelpers.MIDI_NOTE_RANGE.min, MusicCreationHelpers.MIDI_NOTE_RANGE.max);
        let beats = Cast.toNumber(args.SECS);
        beats = this._clampBeats(beats);
        // If the duration is 0, do not play the note. In Scratch 2.0, "play drum for 0 beats" plays the drum,
        // but "play note for 0 beats" is silent.
        if (beats === 0) return;

        const durationSec = beats;
        if (start_timer) this._startStackTimer(util, durationSec);
        this._playNote(util, note, durationSec, instrument, vol);

        // this._startStackTimer(util, durationSec);
        const musicState = this._getMusicState(util.target);
        const inst = musicState.currentInstrument;
        const instrumentInfo = this.INSTRUMENT_INFO[inst]
        return [note, beats, instrumentInfo.name];
    }

    playNote(args, util, instrument, vol) {
        if (this.stackTimerNeedsInit(util)) {
            return this.internalPlayNote(args, util, instrument, vol, true);
        } else {
            this._checkStackTimer(util);
            return [];
        }
    }

    /**
     * Play a note using the current instrument for a duration in seconds.
     * This function actually plays the sound, and handles the timing of the sound, including the
     * "release" portion of the sound, which continues briefly after the block execution has finished.
     * @param {object} util - utility object provided by the runtime.
     * @param {number} note - the pitch of the note to play, interpreted as a MIDI note number.
     * @param {number} durationSec - the duration in seconds to play the note.
     * @private
     */
    _playNote(util, note, durationSec, instrument, vol) {
        if (util.runtime.audioEngine === null) return;
        if (util.target.sprite.soundBank === null) return;

        // If we're playing too many sounds, do not play the note.
        if (this._concurrencyCounter > MusicCreationHelpers.CONCURRENCY_LIMIT) {
            return;
        }

        // Determine which of the audio samples for this instrument to play
        const musicState = this._getMusicState(util.target);
        const inst = (instrument !== undefined && instrument !== null) ? instrument : musicState.currentInstrument;
        const instrumentInfo = this.INSTRUMENT_INFO[inst];
        const sampleArray = instrumentInfo.samples;
        const sampleIndex = this._selectSampleIndexForNote(note, sampleArray);
        // If the audio sample has not loaded yet, bail out
        if (typeof this._instrumentPlayerArrays[inst] === 'undefined') return;
        if (typeof this._instrumentPlayerArrays[inst][sampleIndex] === 'undefined') return;

        if (!this._instrumentPlayerNoteArrays[inst][note]) {
            this._instrumentPlayerNoteArrays[inst][note] = this._instrumentPlayerArrays[inst][sampleIndex].take();
        }

        const player = this._getPlayer(inst, note);

        this._initNote(util, sampleArray, sampleIndex, note, player, instrumentInfo,
            durationSec, vol);
    }

    /**
     * The samples array for each instrument is the set of pitches of the available audio samples.
     * This function selects the best one to use to play a given input note, and returns its index
     * in the samples array.
     * @param  {number} note - the input note to select a sample for.
     * @param  {number[]} samples - an array of the pitches of the available samples.
     * @return {index} the index of the selected sample in the samples array.
     * @private
     */
    _selectSampleIndexForNote(note, samples) {
        // Step backwards through the array of samples, i.e. in descending pitch, in order to find
        // the sample that is the closest one below (or matching) the pitch of the input note.
        for (let i = samples.length - 1; i >= 0; i--) {
            if (note >= samples[i]) {
                return i;
            }
        }
        return 0;
    }

    /**
     * Calcuate the frequency ratio for a given musical interval.
     * @param  {number} interval - the pitch interval to convert.
     * @return {number} a ratio corresponding to the input interval.
     * @private
     */
    _ratioForPitchInterval(interval) {
        return Math.pow(2, (interval / 12));
    }

    /**
 * Start the stack timer and the yield the thread if necessary.
 * @param {object} util - utility object provided by the runtime.
 * @param {number} duration - a duration in seconds to set the timer for.
 * @private
 */
    _startStackTimer(util, duration) {
        util.stackFrame.timer = new Timer();
        util.stackFrame.timer.start();
        util.stackFrame.duration = duration;
        util.yield();
    }

    /**
     * Check if the stack timer needs initialization.
     * @param {object} util - utility object provided by the runtime.
     * @return {boolean} - true if the stack timer needs to be initialized.
     */
    stackTimerNeedsInit(util) {
        return !util.stackFrame.timer;
    }

    /**
     * Check the stack timer, and if its time is not up yet, yield the thread.
     * @param {object} util - utility object provided by the runtime.
     * @private
     */
    _checkStackTimer(util) {
        const timeElapsed = util.stackFrame.timer.timeElapsed();
        if (timeElapsed < util.stackFrame.duration * 1000) {
            util.yield();
        }
    }

    /**
     * Clamp a duration in beats to the allowed min and max duration.
     * @param  {number} beats - a duration in beats.
     * @return {number} - the clamped duration.
     * @private
     */
    _clampBeats(beats) {
        return MathUtil.clamp(beats, MusicCreationHelpers.BEAT_RANGE.min, MusicCreationHelpers.BEAT_RANGE.max);
    }


}

module.exports = MusicCreationHelpers;