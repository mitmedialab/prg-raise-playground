import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, extension, block, scratch, scratchVersions } from "$common";
import BlockUtility from "$scratch-vm/engine/block-utility";
//import * as mm from '@magenta/music/es6';
//import mvae from '@magenta/music/node/music_vae';
//import * as fs from 'fs';
//import { chromium } from 'playwright';
// import puppeteer from 'puppeteer';
import { now, start, getTransport, Synth } from 'tone';

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


  
}