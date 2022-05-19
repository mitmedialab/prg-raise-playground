const log = require('../../util/log');
const Cast = require('../../util/cast');
const hrtime = require('browser-hrtime');
const mvae = require('@magenta/music/node/music_vae');
const core = require('@magenta/music/node/core');
const rnn = require('@magenta/music/node/music_rnn');
const regeneratorRuntime = require("regenerator-runtime");

const symbols = require('./symbols');
const { time } = require('format-message');


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

class MusicAccompanimentHelpers {
    constructor (runtime) {
        this.runtime = runtime;
        TWINKLE_TWINKLE = {
            notes: [
              {pitch: 60, startTime: 0.0, endTime: 0.5},
              {pitch: 60, startTime: 0.5, endTime: 1.0},
              {pitch: 67, startTime: 1.0, endTime: 1.5},
              {pitch: 67, startTime: 1.5, endTime: 2.0},
              {pitch: 69, startTime: 2.0, endTime: 2.5},
              {pitch: 69, startTime: 2.5, endTime: 3.0},
              {pitch: 67, startTime: 3.0, endTime: 4.0},
              {pitch: 65, startTime: 4.0, endTime: 4.5},
              {pitch: 65, startTime: 4.5, endTime: 5.0},
              {pitch: 64, startTime: 5.0, endTime: 5.5},
              {pitch: 64, startTime: 5.5, endTime: 6.0},
              {pitch: 62, startTime: 6.0, endTime: 6.5},
              {pitch: 62, startTime: 6.5, endTime: 7.0},
              {pitch: 60, startTime: 7.0, endTime: 8.0},  
            ],
            totalTime: 8
          };

          this.noteList = [];
          player = new core.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
          rnnPlayer = new core.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
          vaePlayer = new core.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');

          music_rnn = new rnn.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
          music_rnn.initialize();

          music_vae = new mvae.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_small_q2');
          music_vae.initialize();

    }

    configure(noteList) {
        newNotes = {
            notes: [

            ],
            totalTime: 0
        };
        t = 0;
        for (var i in noteList) {
            note = noteList[i];
            newNotes.notes.push({pitch: note[0], startTime: t, endTime: t + note[1]});
            t = t + note[1];
            newNotes.totalTime += note[1];
        }
        return newNotes;
    }

    processed(notes) {
        newNoteList = [];
        for (var i in notes) {
            note = notes[i];
            newNoteList.push([note.pitch, (note.quantizedEndStep-note.quantizedStartStep)/4, "Piano", 60]);
        }
        return newNoteList;
    }

    async testMagentaRNN (noteList, args, utils) {
        if (rnnPlayer.isPlaying()) {
            rnnPlayer.stop();
            return;
        }
        notes = this.configure(noteList);

        rnn_steps = Cast.toNumber(args.STEPS);
        rnn_temperature = Cast.toNumber(args.TEMP);
              
        // The model expects a quantized sequence, and ours was unquantized:
        const qns = core.sequences.quantizeNoteSequence(notes, 4);
        var newNotes = [];
        await music_rnn
        .continueSequence(qns, rnn_steps, rnn_temperature)
        .then((sample) => {
            newNotes.push(sample);
            /*rnnPlayer.start(sample)*/});
        const magentaN = async () => {
            const a = await newNotes;
            magentaNotes = this.processed(a[0].notes);
            return magentaNotes;
            };
        console.log('newNotes',newNotes);
        magentaNotes = await magentaN();
        console.log('magenta notes', magentaNotes);
        return magentaNotes;
        var magentaNotes = newNotes[0].notes;
        return this.processed(magentaNotes);
        
    }

    async testMagentaMVAE (utils) {
        if (vaePlayer.isPlaying()) {
            vaePlayer.stop();
            return;
        }
        var vae_temperature = 3;
        var samples = [];
        await music_vae.sample(1, vae_temperature)
        .then((sample) => {
            samples.push(sample);
            vaePlayer.start(sample[0])});
        const magentaN = async () => {
            const a = await samples;
            magentaNotes = this.processed(a[0][0].notes);
            return magentaNotes;
          };
        magentaNotes = await magentaN();
        return magentaNotes;
    }

}

module.exports = MusicAccompanimentHelpers;