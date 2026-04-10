const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const Timer = require('../../util/timer');
const log = require('../../util/log');
const musicPlayers = require("./musicplayer");

class AnalysisHelpers {
    constructor (runtime) {
        this.runtime = runtime;

        this.musicPlayer = new musicPlayers(runtime);

        this.filenameToNote = {
            1: {instrument: "synth", volume: "piano", pitch: "60"},
            2: {instrument: "cello", volume: "mezzo-piano", pitch: "65"},
            3: {instrument: "piano", volume: "forte", pitch: "68"},
            4: {instrument: "saxophone", volume: "forte", pitch: "72"},
            5: {instrument: "clarinet", volume: "fortissimo", pitch: "60"},
            6: {instrument: "bass", volume: "mezzo-forte", pitch: "63"}
        }

        this.compareVolumes = {
            "pianissimo": 0,
            "piano": 1,
            "mezzo-piano": 2,
            "mezzo-forte": 3,
            "forte": 4,
            "fortissimo": 5
        }

        this.louder = "";
        this.higher = "";
        this.inst1 = "";
        this.inst2 = "";

    }

    playFile (args, util) {
        note1 = this.filenameToNote[Cast.toNumber(args.FILE)];
        this.play(note1, util);
    }

    compareFiles (args, util) {
        note1 = this.filenameToNote[Cast.toNumber(args.FILE1)];
        note2 = this.filenameToNote[Cast.toNumber(args.FILE2)];
        this.inst1 = note1.instrument;
        this.inst2 = note2.instrument;
        this.louder =  (this.compareVolumes[note1.volume] == this.compareVolumes[note2.volume]) ? "equal" : ((this.compareVolumes[note1.volume] > this.compareVolumes[note2.volume]) ? args.FILE1 : args.FILE2);
        this.higher = (note1.pitch == note2.pitch) ? "equal" : (note1.pitch > note2.pitch) ? args.FILE1 : args.FILE2;
    }

    getLouder (util) {
        return this.louder;
    }

    getHigher (util) {
        return this.higher;
    }

    getInst1 (util) {
        return this.inst1;
    }

    getInst2 (util) {
        return this.inst2;
    }

    play (note, util) {
        log.log(note.instrument);
        this.musicPlayer._playNote(util, note.pitch, 0.25, note.instrument);
    }

    getPitch (note, util) {
        log.log("here");
    }

    getVolume (note, util) {
        log.log("here");
    }

    getInstrument(note, util) {
        log.log("here");
    }

}

module.exports = AnalysisHelpers;