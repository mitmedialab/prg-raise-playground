import { instrumentSamples, INSTRUMENT_INFO } from './asset_loader';
import { Timer } from '$common/utils'

export class Music {
    _instrumentPlayerArrays;
    _instrumentPlayerNoteArrays;
    tempo = 120;
    volume;
    instrument;

    init(runtime) {
        this._instrumentPlayerArrays = {};
        this._instrumentPlayerNoteArrays = {};
        this._loadAllSounds(runtime);
        this.volume = 50;
        this.instrument = 0;
    }

    setVolume(volume) {
        this.volume = volume;
    }

    setInstrument(instrument) {
        this.instrument = instrument;
    }

    base64ToArrayBuffer(base64) {
        const cleanedBase64 = base64.replace(/^data:audio\/mp3;base64,/, '');
        var binaryString = atob(cleanedBase64);
        var bytes = new Uint8Array(binaryString.length);
        for (var i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    extractAndFormatDirNames() {
        return INSTRUMENT_INFO().map((instrument, index) => {
            let formattedName = instrument.dirName;

            // Remove leading numbers and dashes, and replace dashes with spaces
            formattedName = formattedName.replace(/^\d+-/, '').replace(/-/g, ' ');

            return {
                value: index,
                text: formattedName
            };
        });
    }

    _storeSound(filePath, index, playerArray, runtime) {
        const fullPath = `${filePath}.mp3`;

        if (!instrumentSamples[fullPath]) return;

        // The sound player has already been downloaded via the manifest file required above.
        const soundbase64 = instrumentSamples[fullPath];
        console.log("sound buffer");
        console.log(soundbase64);
        const soundBuffer = this.base64ToArrayBuffer(soundbase64);
        console.log(soundBuffer);


        return this._decodeSound(soundBuffer, runtime).then(player => {
            playerArray[index] = player;
        });
    }



    _loadAllSounds(runtime) {
        const loadingPromises = [];
        INSTRUMENT_INFO().forEach((instrumentInfo, instrumentIndex) => {
            this._instrumentPlayerArrays[instrumentIndex] = [];
            this._instrumentPlayerNoteArrays[instrumentIndex] = [];
            instrumentInfo.samples.forEach((sample, noteIndex) => {
                const filePath = `instruments/${instrumentInfo.dirName}/${sample}`;
                const promise = this._storeSound(filePath, noteIndex, this._instrumentPlayerArrays[instrumentIndex], runtime);
                loadingPromises.push(promise);
            });
        });
    }

    _selectSampleIndexForNote(note, samples) {
        for (let i = samples.length - 1; i >= 0; i--) {
            if (note >= samples[i]) {
                return i;
            }
        }
        return 0;
    }

    _ratioForPitchInterval(interval) {
        return Math.pow(2, (interval / 12));
    }


    _playNote(util, note, durationSec) {
        if (util.runtime.audioEngine === null) return;

        // // If we're playing too many sounds, do not play the note.
        // if (this._concurrencyCounter > Scratch3MusicBlocks.CONCURRENCY_LIMIT) {
        //     return;
        // }

        // Determine which of the audio samples for this instrument to play
        const instrumentInfo = INSTRUMENT_INFO()[this.instrument];
        const sampleArray = instrumentInfo.samples;
        const sampleIndex = this._selectSampleIndexForNote(note, sampleArray);

        // If the audio sample has not loaded yet, bail out
        if (typeof this._instrumentPlayerArrays[this.instrument] === 'undefined') return;
        if (typeof this._instrumentPlayerArrays[this.instrument][sampleIndex] === 'undefined') return;

        // Fetch the sound player to play the note.
        const engine = util.runtime.audioEngine;

        if (!this._instrumentPlayerNoteArrays[this.instrument][note]) {
            this._instrumentPlayerNoteArrays[this.instrument][note] = this._instrumentPlayerArrays[this.instrument][sampleIndex].take();
        }

        const player = this._instrumentPlayerNoteArrays[this.instrument][note];

        if (player.isPlaying && !player.isStarting) {
            // Take the internal player state and create a new player with it.
            // `.play` does this internally but then instructs the sound to
            // stop.
            player.take();
        }

        // Set its pitch.
        const sampleNote = sampleArray[sampleIndex];
        const notePitchInterval = this._ratioForPitchInterval(note - sampleNote);

        // Create gain nodes for this note's volume and release, and chain them
        // to the output.
        const context = engine.audioContext;
        const volumeGain = context.createGain();
        //volumeGain.gain.setValueAtTime(this.target.volume / 100, engine.currentTime);
        volumeGain.gain.setValueAtTime(this.volume / 100, engine.currentTime);
        const releaseGain = context.createGain();
        volumeGain.connect(releaseGain);
        releaseGain.connect(engine.getInputNode());

        // Schedule the release of the note, ramping its gain down to zero,
        // and then stopping the sound.
        let releaseDuration = INSTRUMENT_INFO()[this.instrument].releaseTime;
        if (typeof releaseDuration === 'undefined') {
            releaseDuration = 0.01;
        }
        const releaseStart = context.currentTime + durationSec;
        const releaseEnd = releaseStart + releaseDuration;
        releaseGain.gain.setValueAtTime(1, releaseStart);
        releaseGain.gain.linearRampToValueAtTime(0.0001, releaseEnd);

        // this._concurrencyCounter++;
        // player.once('stop', () => {
        //     this._concurrencyCounter--;
        // });

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

    _decodeSound(soundBuffer, runtime) {
        const engine = runtime.audioEngine;

        if (!engine) {
            return Promise.reject(new Error('No Audio Context Detected'));
        }

        // Check for newer promise-based API
        return engine.decodeSoundPlayer({ data: { buffer: soundBuffer } });
    }

    _stackTimerNeedsInit(util) {
        return !util.stackFrame.timer;
    }

    _startStackTimer(util, duration) {
        util.stackFrame.timer = new Timer();
        util.stackFrame.timer.start();
        util.stackFrame.duration = duration;
        util.yield();
    }

    _checkStackTimer(util) {
        const timeElapsed = util.stackFrame.timer.timeElapsed();
        if (timeElapsed < util.stackFrame.duration * 1000) {
            util.yield();
        }
    }

    _beatsToSec(beats) {
        return (60 / this.tempo) * beats;
    }
}