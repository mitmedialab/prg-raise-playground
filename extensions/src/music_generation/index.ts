import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, extension, block, scratch, scratchVersions } from "$common";
import { Timer } from '$common/utils'
import BlockUtility from "$scratch-vm/engine/block-utility";
//import * as mm from '@magenta/music/es6';
//import mvae from '@magenta/music/node/music_vae';
//import * as fs from 'fs';
//import { chromium } from 'playwright';
// import puppeteer from 'puppeteer';
import { now, start, getTransport, Synth } from 'tone';
import piano24 from './assets/instruments/1-piano/24.mp3';
//import { INSTRUMENT_INFO } from "./asset_loader";
import { instrumentSamples, INSTRUMENT_INFO } from './asset_loader';

//import * as JSDOM from 'jsdom';
//import { createWindow } from 'domino';
//import * as posenet from '@tensorflow-models/posenet';


/** 👋 Hi!

Below is a working Extension that you should adapt to fit your needs. 

It makes use of JSDoc comments (anything inside of the '/**   * /' regions) 
to add explanations to what you're seeing. These do not affect the code 
and can be delete when you no longer need them.

Anywhere you find something that looks like: @see {ExplanationOfSomething} 
hover over the 'ExplanationOfSomething' part to get a popup that tells you more about the code.

Try out hovering by reviewing the below terminology.
NOTE: When the documentation refers to these terms, they will be capitalized.

@see {Extension}
@see {Block}
@see {BlockProgrammingEnvironment}

If you don't see anything when hovering, or find some documentation is missing, please contact: 
Parker Malachowsky (pmalacho@media.mit.edu)

Happy coding! 👋 */

/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/** @see {ExplanationOfDetails} */
const details: ExtensionMenuDisplayDetails = {
  name: "Replace me with name of your extension",
  description: "Replace me with a description of your extension",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

/** @see {ExplanationOfClass} */
/** @see {ExplanationOfInitMethod} */
export default class ExtensionNameGoesHere extends extension(details, "ui") {

  userEnteredNotes;
  userChordProgression: string[];
  lastTime: number;
  generatedNotes;
  originalMelody;

  setNotes(notes) {
    this.generatedNotes = notes;
    console.log(this.generatedNotes);
  }

  setSequence(notes) {
    this.originalMelody = notes;
  }

  quantizeNotes(notes, stepsPerQuarter, tempo=getTransport().bpm.value) {
    // Calculate the step duration based on steps per quarter and tempo
    const quartersPerMinute = tempo;
    const quartersPerSecond = quartersPerMinute / 60;
    const stepDuration = 1 / (stepsPerQuarter * quartersPerSecond); // Duration of each step in seconds
  
    // Function to quantize a single note
    function quantizeNote(note) {
      const quantizedStartStep = Math.round(note.startTime / stepDuration);
      const quantizedEndStep = Math.round(note.endTime / stepDuration);
      return {
        pitch: note.pitch,
        quantizedStartStep,
        quantizedEndStep
      };
    }
  
    // Quantize each note in the list
    const quantizedNotes = notes.map(quantizeNote);
  
    return quantizedNotes;
  }


  

  init(env: Environment) {
    this.userEnteredNotes = [];
    this.lastTime = 0;
    this.generatedNotes = [];
    this.userChordProgression = [];
    this.originalMelody = [];
    start(); // Ensure Transport is started
    getTransport().start();
    console.log(this.runtime);
    this._instrumentPlayerArrays = {};
    this._instrumentPlayerNoteArrays = {};
    this._loadAllSounds();
    console.log(piano24);
    
  }


  @(scratch.command`Add note at pitch ${"number"} with start time ${"number"} and end time ${"number"}`)
  addNote(pitch: number, startTime: number, endTime: number) {
    this.userEnteredNotes.push({pitch: pitch, startTime: startTime, endTime: endTime});
    if (endTime > this.lastTime) {
      this.lastTime = endTime;
    }
  }

  @(scratch.command`Add chord ${"string"} to progression`)
  addChord(chord: string) {
    this.userChordProgression.push(chord);
  }

  @(scratch.command`Generate song`)
  generateSong() {
    this.openUI("UI")
  }

  midiToFrequency(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  playbackCompleted = true;
  startTime = 0;
  playUserEnteredNotes(notes): number {
    console.log(notes);
    if (getTransport().now() > this.startTime) {
      this.startTime = getTransport().now();
    }
    let lastSeconds = 0;
    this.playbackCompleted = false;
    const synth = new Synth({
      oscillator: {
        type: "amtriangle",
        harmonicity: 0.5,
        modulationType: "sine",
      },
      envelope: {
        attackCurve: "exponential",
        attack: 0.05,
        decay: 0.2,
        sustain: 0.2,
        release: 1.5,
      },
      portamento: 0.05,
    }).toDestination();

    notes.forEach(note => {
        getTransport().schedule((time) => {
            synth.triggerAttackRelease(this.midiToFrequency(note.pitch), `${(note.quantizedEndStep - note.quantizedStartStep)/8}n`, time);
        }, this.startTime + note.quantizedStartStep/8);
        if ((this.startTime + note.quantizedStartStep/8 + (note.quantizedEndStep - note.quantizedStartStep)/8 + 1) > lastSeconds) {
          lastSeconds = this.startTime + note.quantizedStartStep/8 + (note.quantizedEndStep - note.quantizedStartStep)/8 + 1;
        }
    });
    return lastSeconds;

}


  @(scratch.command`Play generated song`)
  playNotes() {
    let lastSeconds = this.playUserEnteredNotes(this.generatedNotes);
    this.startTime = lastSeconds;
  }

  @(scratch.command`Play original song`)
  playOriginalSong() {
    let lastSeconds = this.playUserEnteredNotes(this.originalMelody);
    this.startTime = lastSeconds;
  }

  @(scratch.command`Play note at pitch ${"number"} from ${"number"} to ${"number"}`)
  playNote(pitch: number, startTime: number, endTime: number) {
    let oneNote = [
      {pitch: pitch, startTime: startTime, endTime: endTime}
    ]
    console.log(this.quantizeNotes(oneNote, 4));
    let lastSeconds = this.playUserEnteredNotes(this.quantizeNotes(oneNote, 4));
    this.startTime = lastSeconds;
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

  _storeSound (filePath, index, playerArray) {
    const fullPath = `${filePath}.mp3`;

    if (!instrumentSamples[fullPath]) return;

    // The sound player has already been downloaded via the manifest file required above.
    const soundbase64 = instrumentSamples[fullPath];
    console.log("sound buffer");
    console.log(soundbase64);
    const soundBuffer = this.base64ToArrayBuffer(soundbase64);
    console.log(soundBuffer);


    return this._decodeSound(soundBuffer).then(player => {
        playerArray[index] = player;
    });
  }


  _instrumentPlayerArrays;
  _instrumentPlayerNoteArrays;
  _loadAllSounds () {
    const loadingPromises = [];
    INSTRUMENT_INFO().forEach((instrumentInfo, instrumentIndex) => {
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
        console.log(this._instrumentPlayerArrays);
        console.log(this._instrumentPlayerNoteArrays);
    });
  }

  _selectSampleIndexForNote (note, samples) {
    // Step backwards through the array of samples, i.e. in descending pitch, in order to find
    // the sample that is the closest one below (or matching) the pitch of the input note.
    for (let i = samples.length - 1; i >= 0; i--) {
        if (note >= samples[i]) {
            return i;
        }
    }
    return 0;
  }

  _ratioForPitchInterval (interval) {
    return Math.pow(2, (interval / 12));
  }


  _playNote (util, inst, note, durationSec) {
    if (util.runtime.audioEngine === null) return;

    // // If we're playing too many sounds, do not play the note.
    // if (this._concurrencyCounter > Scratch3MusicBlocks.CONCURRENCY_LIMIT) {
    //     return;
    // }

    // Determine which of the audio samples for this instrument to play
    console.log(INSTRUMENT_INFO());
    const instrumentInfo = INSTRUMENT_INFO()[0];
    const sampleArray = instrumentInfo.samples;
    const sampleIndex = this._selectSampleIndexForNote(note, sampleArray);

    // If the audio sample has not loaded yet, bail out
    if (typeof this._instrumentPlayerArrays[inst] === 'undefined') return;
    if (typeof this._instrumentPlayerArrays[inst][sampleIndex] === 'undefined') return;

    // Fetch the sound player to play the note.
    const engine = util.runtime.audioEngine;

    if (!this._instrumentPlayerNoteArrays[inst][note]) {
        this._instrumentPlayerNoteArrays[inst][note] = this._instrumentPlayerArrays[inst][sampleIndex].take();
    }

    const player = this._instrumentPlayerNoteArrays[inst][note];

    if (player.isPlaying && !player.isStarting) {
        // Take the internal player state and create a new player with it.
        // `.play` does this internally but then instructs the sound to
        // stop.
        player.take();
    }

    // Set its pitch.
    const sampleNote = sampleArray[sampleIndex];
    console.log("sample note");
    console.log(sampleNote);
    const notePitchInterval = this._ratioForPitchInterval(note - sampleNote);

    // Create gain nodes for this note's volume and release, and chain them
    // to the output.
    const context = engine.audioContext;
    const volumeGain = context.createGain();
    //volumeGain.gain.setValueAtTime(this.target.volume / 100, engine.currentTime);
    volumeGain.gain.setValueAtTime(util.target.volume / 100, engine.currentTime);
    const releaseGain = context.createGain();
    volumeGain.connect(releaseGain);
    releaseGain.connect(engine.getInputNode());

    // Schedule the release of the note, ramping its gain down to zero,
    // and then stopping the sound.
    let releaseDuration = INSTRUMENT_INFO()[0].releaseTime;
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
    console.log("player");
    console.log(player);
    player.play();
    // Connect the player to the gain node.
    player.connect({getInputNode () {
        console.log("volume gain");
        console.log(volumeGain);
        return volumeGain;
    }});
    // Set playback now after play creates the outputNode.
    player.outputNode.playbackRate.value = notePitchInterval;
    // Schedule playback to stop.
    player.outputNode.stop(releaseEnd);
  }

  _decodeSound (soundBuffer) {
    const engine = this.runtime.audioEngine;

    if (!engine) {
        return Promise.reject(new Error('No Audio Context Detected'));
    }

    // Check for newer promise-based API
    return engine.decodeSoundPlayer({data: {buffer: soundBuffer}});
  }

  _stackTimerNeedsInit (util) {
    return !util.stackFrame.timer;
  }

  _startStackTimer (util, duration) {
    util.stackFrame.timer = new Timer();
    util.stackFrame.timer.start();
    util.stackFrame.duration = duration;
    util.yield();
  }

  _checkStackTimer (util) {
    const timeElapsed = util.stackFrame.timer.timeElapsed();
    if (timeElapsed < util.stackFrame.duration * 1000) {
        util.yield();
    }
  }

  tempo = 120;

  _beatsToSec (beats) {
    return (60 / this.tempo) * beats;
  }

  @(scratch.command`UTIL Play note at pitch ${"number"} for ${"number"}`)
  playNoteBlock(pitch: number, beats: number, util: BlockUtility) {
    if (this._stackTimerNeedsInit(util)) {
      let note = pitch;
      note = Math.min(Math.max(note, 0), 130);
      beats = Math.min(Math.max(beats, 0), 100);
      // If the duration is 0, do not play the note. In Scratch 2.0, "play drum for 0 beats" plays the drum,
      // but "play note for 0 beats" is silent.
      if (beats === 0) return;

      const durationSec = this._beatsToSec(beats);

      this._playNote(util, 0, note, durationSec);

      this._startStackTimer(util, durationSec);
    } else {
        this._checkStackTimer(util);
    }
  }


  
}