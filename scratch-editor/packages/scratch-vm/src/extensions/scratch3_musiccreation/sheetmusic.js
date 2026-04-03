const Clone = require('../../util/clone');
const log = require('../../util/log');
const Cast = require('../../util/cast');
const Color = require('../../util/color');
const RenderedTarget = require('../../sprites/rendered-target');
const StageLayering = require('../../engine/stage-layering');

const letters = require('./letters');
const symbols = require('./symbols');
const { updateVariableIdentifiers } = require('../../util/variable-util');

var pitchToStaff, pitchToStaffBass, sharps, flats, harmonics, drawX, xmid, ymid, up, sym, s, flip, initial, coord, x, y, startX, endX, startY, endY, yStep, xStep, freq, note, duration, symbolX, symbolY, volume, newX, newY, beats, signal, step, theta, rad, dotrad, xrad, yrad, sign, xOffset, scale, restX, restY, offset, newBeats, acc, staff, clef, adjusted, xmidTreble, ymidTreble, ymidBass;

class SheetMusic {
    constructor(runtime) {
        this.runtime = runtime;

        /**
         * The ID of the renderer Skin corresponding to the pen layer.
         * @type {int}
         * @private
         */
        this._penSkinId = -1;

        /**
         * The ID of the renderer Drawable corresponding to the pen layer.
         * @type {int}
         * @private
         */
        this._penDrawableId = -1;
        this.black = '0x000000';
        this.purple = '0x800080';
        this.lightpurple = '0xCBC3E3';
        this.lightblue = '0x99ccff';

        /**
         * @type {Array<[number,number,string,number,number]} 
         * 
         * noteList[i] is [note frequency, duration, instrument name, volume, id]
         */
        this.noteList = [];

        this.axisStartX = -200;
        this.axisStartY = -150;
        this.xAxisLength = 400;
        this.yAxisLength = 300;

        this.staffLength = 411;
        this.staffStartX = -200;
        this.staffStartY = 115;
        this.staffWidth = 10;

        this.spaceBetween = 80;
        this.spaceBetweenStaffs = 80;

        this.wavePen = -1;
        this.musicPen = 2;
        this.FFTPen = 3;
        this.spectPen = 4;

        this._onTargetCreated = this._onTargetCreated.bind(this);
        this.runtime.on('targetWasCreated', this._onTargetCreated);

        this._onTargetMoved = this._onTargetMoved.bind(this);


        this._staffLims = { lo_note: 60, hi_note: 85, lo_staff: -2, hi_staff: 12 };
        this._staffBaseLims = { lo_note: 34, hi_note: 34, lo_staff: -5, hi_staff: 9 };
        pitchToStaff = {
            60: -2,
            61: -2,
            62: -1,
            63: 0,
            64: 0,
            65: 1,
            66: 1,
            67: 2,
            68: 2,
            69: 3,
            70: 4,
            71: 4,
            72: 5,
            73: 5,
            74: 6,
            75: 7,
            76: 7,
            77: 8,
            78: 8,
            79: 9,
            80: 9,
            81: 10,
            82: 11,
            83: 11,
            84: 12,
            85: 12

        }

        this.rests = {
            4: symbols.restfour,
            2: symbols.resttwo,
            1: symbols.restone,
            0.5: symbols.resthalf,
            0.25: symbols.restquarter,
            0.125: symbols.resteighth
        }

        this.restOffset = {
            4: 29,
            2: 22,
            1: 35,
            0.5: 26,
            0.25: 26,
            0.125: 33
        }

        this.restScale = {
            4: 8,
            2: 8,
            1: 4,
            0.5: 4,
            0.25: 4,
            0.125: 4
        }

        sharps = [37, 42, 44, 49, 54, 56, 61, 66, 68, 73, 78, 80, 85];
        flats = [39, 46, 51, 58, 63, 70, 75, 82];


        pitchToStaffBass = {
            34: -5,
            35: -5,
            36: -4,
            37: -4,
            38: -3,
            39: -2, //F
            40: -2, //G
            41: -1, //A
            42: -1, //DONE
            43: 0,
            44: 0,
            45: 1,
            46: 2,
            47: 2,
            48: 3,//DONE
            49: 3,
            50: 4,
            51: 5,
            52: 5,
            53: 6,
            54: 6,
            55: 7,
            56: 7,
            57: 8,
            58: 9,
            59: 9,
        }

        harmonics = {
            "Piano": [[1, 1], [2, 0.5]],
            "Guitar": [[1, 1], [2, 0.25]],
            "Bass": [[1, 1], [3, 0.5]],
            "Cello": [[1, 1], [4, 0.5]],
            "Saxophone": [[1, 1], [5, 0.5]],
            "Clarinet": [[1, 1], [6, 0.5]],
            "Synth": [[1, 1]]
        }

        this.symbols = {
            15: [symbols.piano, symbols.piano],
            30: [symbols.piano],
            45: [symbols.mezzo, symbols.piano],
            60: [symbols.mezzo, symbols.forte],
            85: [symbols.forte],
            100: [symbols.forte, symbols.forte]
        }

        this.spacing = {
            15: [10, 0],
            30: [10, 0],
            45: [5, 0],
            60: [10, 0],
            85: [10, 0],
            100: [10, 0]
        }

        this.letters = {
            'a': letters.a,
            'b': letters.b,
            'c': letters.c,
            'd': letters.d,
            'e': letters.e,
            'f': letters.f,
            'g': letters.g,
            'h': letters.h,
            'i': letters.i,
            'j': letters.j,
            'h': letters.h,
            'i': letters.i,
            'j': letters.j,
            'k': letters.k,
            'l': letters.l,
            'm': letters.m,
            'n': letters.n,
            'o': letters.o,
            'p': letters.p,
            'q': letters.q,
            'r': letters.r,
            's': letters.s,
            't': letters.t,
            'u': letters.u,
            'v': letters.v,
            'w': letters.w,
            'x': letters.x,
            'y': letters.y,
            'z': letters.z,
            '1': letters.one,
            '2': letters.two,
            '3': letters.three,
            '4': letters.four,
            '5': letters.five,
            '6': letters.six,
            '7': letters.seven,
            '8': letters.eight,
            '9': letters.nine,
            '0': letters.zero,
            'F': letters.flat,
            'S': letters.sharp

        }

        this.spacingLetters = {
            'a': 59.03383897316219,
            'b': 35.666277712952166,
            'c': 55.59820426487096,
            'd': 51.65460910151694,
            'e': 33.821470245040814,
            'f': 35.05134189031503,
            'g': 62.10851808634772,
            'h': 51.65460910151691,
            'i': 0.0,
            'j': 27.057176196032685,
            'k': 44.275379229871646,
            'l': 33.20653442240376,
            'm': 76.86697782963824,
            'n': 57.803967327887975,
            'o': 62.108518086347715,
            'p': 35.05134189031503,
            'q': 62.72345390898482,
            'r': 34.305274971941685,
            's': 39.62850729517402,
            't': 51.03967327887982,
            'u': 50.42473745624271,
            'v': 52.88448074679113,
            'w': 88.55075845974329,
            'x': 45.50525087514586,
            'y': 47.350058343057185,
            'z': 55.959159859976694,
            '1': 29.467911318553092,
            '2': 61.498249708284675,
            '3': 60.21703617269554,
            '4': 74.31038506417735,
            '5': 58.935822637106185,
            '6': 55.09218203033845,
            '7': 65.34189031505252,
            '8': 55.092182030338336,
            '9': 57.654609101516826,
            '0': 55.09218203033856,
            'F': 67.9352750809062, //flat
            'S': 122.6148867313916 //sharp
        }
    }

    /**
     * The key to load & store a target's music-related state.
     * @type {string}
     */
    static get VIZ_STATE_KEY() {
        return 'Scratch.musicviz';
    }

    static get DEFAULT_PEN_STATE() {
        return {
            penDown: false,
            color: 66.66,
            saturation: 100,
            brightness: 100,
            transparency: 0,
            _shade: 50, // Used only for legacy `change shade by` blocks
            penAttributes: {
                color4f: [0, 0, 1, 1],
                diameter: 1
            }
        };
    }

    /**
     * The minimum and maximum allowed pen size.
     * The maximum is twice the diagonal of the stage, so that even an
     * off-stage sprite can fill it.
     * @type {{min: number, max: number}}
     */
    static get PEN_SIZE_RANGE() {
        return { min: 1, max: 1200 };
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
            const penState = sourceTarget.getCustomState(SheetMusic.VIZ_STATE_KEY);
            if (penState) {
                newTarget.setCustomState(SheetMusic.VIZ_STATE_KEY, Clone.simple(penState));
                if (penState.penDown) {
                    newTarget.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
                }
            }
        }
    }

    _onTargetMoved(target, oldX, oldY, isForce) {
        // Only move the pen if the movement isn't forced (ie. dragged).
        if (!isForce) {
            let penSkinId = this._getPenLayerID();
            if (penSkinId >= 0) {
                const penState = this._getPenState(target);
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, oldX, oldY, target.x, target.y);
                this.runtime.requestRedraw();
            }
        }
    }

    _getPenLayerID() {
        if (this._penSkinId < 0 && this.runtime.renderer) {
            this._penSkinId = this.runtime.renderer.createPenSkin();
            this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableProperties(this._penDrawableId, { skinId: this._penSkinId });
        }
        return this._penSkinId;
    }

    _getPenState(target) {
        let penState = target.getCustomState(SheetMusic.VIZ_STATE_KEY);
        if (!penState) {
            penState = Clone.simple(SheetMusic.DEFAULT_PEN_STATE);
            target.setCustomState(SheetMusic.VIZ_STATE_KEY, penState);
        }
        return penState;
    }

    testSheetMusicViz(noteList, args, util, vizhelper) {
        this.setPenColorToColor(this.black, util);
        this.noteList = noteList;
        log.log("SHEET MUSIC", this.noteList);
        this.clear();
        this.drawStaff(args, util);
        this.labelStaff(args, util);
        this.drawMusic(args, util, vizhelper);
        this.setPenColorToColor(this.black, util);
    }

    labelStaff(args, util) {
        startX = this.staffStartX;
        endX = this.staffStartX + this.staffLength;
        var y = this.staffStartY;
        yStep = this.staffWidth;
        //treble
        this.drawString('e', this.staffStartX + this.staffLength + 2, this.staffStartY + 3, 0.5, args, util);
        this.drawString('g', this.staffStartX + this.staffLength + 2, this.staffStartY + yStep + 3, 0.5, args, util);
        this.drawString('b', this.staffStartX + this.staffLength + 2, this.staffStartY + yStep * 2 + 3, 0.5, args, util);
        this.drawString('d', this.staffStartX + this.staffLength + 2, this.staffStartY + yStep * 3 + 3, 0.5, args, util);
        this.drawString('f', this.staffStartX + this.staffLength + 2, this.staffStartY + yStep * 4 + 3, 0.5, args, util);

        //bass
        this.drawString('g', this.staffStartX + this.staffLength + 2, this.staffStartY - this.spaceBetween + 3, 0.5, args, util);
        this.drawString('b', this.staffStartX + this.staffLength + 2, this.staffStartY - this.spaceBetween + yStep + 3, 0.5, args, util);
        this.drawString('d', this.staffStartX + this.staffLength + 2, this.staffStartY - this.spaceBetween + yStep * 2 + 3, 0.5, args, util);
        this.drawString('f', this.staffStartX + this.staffLength + 2, this.staffStartY - this.spaceBetween + yStep * 3 + 3, 0.5, args, util);
        this.drawString('a', this.staffStartX + this.staffLength + 2, this.staffStartY - this.spaceBetween + yStep * 4 + 3, 0.5, args, util);

        //this.drawString('sheet music', this.axisStartX + this.xAxisLength/2 -70, this.axisStartY+this.yAxisLength + 20, 1, args, util);
    }


    drawString(str, xstart, ystart, size, args, util) {
        for (var i in str) {
            xstart += 5 * size;
            if (i >= 1) {
                xstart += this.spacingLetters[str[i - 1]] / 5 * size;
            }
            this.drawLetter(str[i], xstart, ystart, size, args, util);
        }

    }

    drawLetter(letter, xstart, ystart, size, args, util) {
        letter = this.letters[letter];
        this.penUp(args, util);
        for (var i in letter) {
            coord = letter[i];
            x = coord[0] / 5 * size + xstart;
            y = -coord[1] / 5 * size + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);
        }
        this.penUp(args, util);
        for (var i in letter) {
            coord = letter[i];
            x = coord[0] / 5 * size + xstart + 1;
            y = -coord[1] / 5 * size + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);
        }
        this.penUp(args, util);
    }

    drawStaff(args, util) {
        const startX = this.staffStartX;
        const endX = this.staffStartX + this.staffLength;
        var y = this.staffStartY;
        const yStep = this.staffWidth;
        for (var j = 0; j < 2; j++) {
            for (var i = 0; i < 5; i++) {
                this.penUp(args, util);
                util.target.setXY(startX, y);
                this.penDown(args, util);
                util.target.setXY(endX, y);
                y = y + yStep;
            }
            y = y - this.spaceBetween - yStep * 5;
            for (var i = 0; i < 5; i++) {
                this.penUp(args, util);
                util.target.setXY(startX, y);
                this.penDown(args, util);
                util.target.setXY(endX, y);
                y = y + yStep;
            }
            y = y - this.spaceBetween - this.spaceBetweenStaffs;
            this.drawTreble(this.staffStartX + 10, this.staffStartY - 12 - j * (this.spaceBetween + yStep * 5 - 12 + this.spaceBetweenStaffs - 8), args, util);
            this.drawBass(this.staffStartX, this.staffStartY - 12 - yStep * 7 - j * (this.spaceBetween + yStep * 5 - 12 + this.spaceBetweenStaffs - 8), args, util);
        }
        this.penUp(args, util);
        this.drawTimeSignature(args, util);

    }

    drawTimeSignature(args, util) {
        var startX = this.staffStartX;
        var y = this.staffStartY;
        this.drawString("4", startX + 25, y + 18, 1.2, args, util);
        this.drawString("4", startX + 25, y + 38, 1.2, args, util);

        this.drawString("4", startX + 25, y + 18 - this.spaceBetween, 1.2, args, util);
        this.drawString("4", startX + 25, y + 38 - this.spaceBetween, 1.2, args, util);
    }

    drawSymbol(symbol, args, util, xStart, yStart) {
        symbolX = 0;
        symbolY = 0;
        this.penUp(args, util);
        for (var i in symbol) {
            coord = symbol[i];
            symbolX = coord[0] / 2 + xStart;
            symbolY = -coord[1] / 2 + yStart;
            util.target.setXY(symbolX, symbolY);
            this.penDown(args, util);
        }
        this.penUp(args, util);
    }

    drawTreble(xstart, ystart, args, util) {
        //xstart = this.staffStartX+10;
        //ystart = this.staffStartY-12;
        const treble = symbols.treble;
        this.penUp(args, util);
        for (var i in treble) {
            const coord = treble[i];
            var x = coord[0] / 5 + xstart;
            var y = -coord[1] / 5 + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);
        }
        this.penUp(args, util);
        for (var i in treble) {
            const coord = treble[i];
            x = coord[0] / 5 + xstart + 1;
            y = -coord[1] / 5 + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);
        }
        this.penUp(args, util);
    }

    drawBass(xstart, ystart, args, util) {
        //xstart = this.staffStartX+10;
        //ystart = this.staffStartY-12;
        const bass = symbols.bass;
        this.penUp(args, util);
        for (var i in bass) {
            const coord = bass[i];
            var x = coord[0] / 7 + xstart;
            var y = -coord[1] / 7 + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);
        }
        this.penUp(args, util);
        for (var i in bass) {
            const coord = bass[i];
            x = coord[0] / 7 + xstart + 1;
            y = -coord[1] / 7 + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);
        }
        this.penUp(args, util);
        for (var i = 0; i < 2; i++) {
            var xmid = xstart + 27;
            var ymid = ystart + 27 + i * 10;
            var step = Math.PI / 100;
            var rad = 2;
            for (var theta = 0; theta < 2 * Math.PI; theta += step) {
                this.penUp(args, util);
                util.target.setXY(xmid, ymid);
                var x = xmid + rad * Math.cos(theta);
                var y = ymid - rad * Math.sin(theta);
                this.penDown(args, util);
                util.target.setXY(x, y);
            }
        }


    }

    drawMeasure(x, y, args, util) {
        this.penUp(args, util);
        util.target.setXY(x + 10, y);
        this.penDown(args, util);
        util.target.setXY(x + 10, y + 40);
        this.penUp(args, util);
        this.penUp(args, util);
        util.target.setXY(x + 11, y);
        this.penDown(args, util);
        util.target.setXY(x + 11, y + 40);
        this.penUp(args, util);

        this.penUp(args, util);
        util.target.setXY(x + 10, y - this.spaceBetween);
        this.penDown(args, util);
        util.target.setXY(x + 10, y + 40 - this.spaceBetween);
        this.penUp(args, util);
        this.penUp(args, util);
        util.target.setXY(x + 11, y - this.spaceBetween);
        this.penDown(args, util);
        util.target.setXY(x + 11, y + 40 - this.spaceBetween);
        this.penUp(args, util);
    }

    drawMusic(args, util, vizHelper) {
        var xinit = this.staffStartX + 40;
        var x = xinit;
        var y = this.staffStartY;
        var xStep = 45;
        var pastVol = 0;
        var beats = 0;
        var signal = this.convertSignalToMusicList(args, util);

        for (let i in signal) {
            log.log(signal[i]);
            note = signal[i][0];
            duration = signal[i][1];
            volume = signal[i][2];
            acc = signal[i][4];
            adjusted = signal[i][6];
            beats += duration;
            if (note <= 3) {
                up = true;
            } else {
                up = false;
            }
            x = x + xStep;
            if (x > this.staffStartX + this.staffLength) {
                x = xinit + xStep;
                y = y - this.spaceBetween - 11 * this.staffWidth;
            }

            if (beats % 4 == 0 && beats != 0) {
                this.setPenColorToColor(this.black, util);
                this.drawMeasure(x, y, args, util);
            }
            ymidTreble = y + note * this.staffWidth / 2;
            ymidBass = y + note * this.staffWidth / 2 - this.spaceBetween;

            if (adjusted) {
                this.setPenColorToColor(this.purple, util);
            } else {
                this.setPenColorToColor(this.black, util);
            }

            if (signal[i][3] == 'treble') {
                ymid = ymidTreble;
                xmid = x - 8;
                this.addRest(xmid, ymidBass - note * this.staffWidth / 2, duration, args, util);
            } else {
                xmid = x - 8;
                ymid = ymidBass;
                this.addRest(xmid, ymidTreble - note * this.staffWidth / 2, duration, args, util);

            }
            if (note > 9 || note < -1) {
                this.addLedgers(xmid, ymid, note, args, util);
            }

            if (acc) {
                this.addAccidental(xmid, ymid, note, acc, args, util);
            }

            if (signal[i][5] == "tie") {
                log.log("tie");
                this.addTie(xmid, ymid, up, xStep, args, util);
            }


            this.drawNote(xmid, ymid, duration, up, args, util);
            if ((volume != pastVol)) {
                newX = xmid;
                newY = y - this.spaceBetween / 4;
                if (signal[i][3] == 'bass') {
                    newY = newY - this.spaceBetween;
                }
                sym = this.symbols[volume];
                initial = 0;
                for (let i in sym) {
                    s = sym[i];
                    this.drawSymbol(s, args, util, newX + initial, newY);
                    initial += this.spacing[volume][i];
                }
            }
            pastVol = volume;
        }
        this.penUp(args, util);

        if (x > 120 && y < 0) {
            vizHelper.clearSheetMusicList();
        }
    }

    addMultiLineTie(xmid, ymid, up, xstep, args, util) {
        var xrad = 8;
        var yrad = 4;
        if (up) {
            var sign = -1;
        } else {
            sign = 1;
        }
        var xrad = xrad + xstep / 2 - 8 - xrad / 4;
        var yrad = xrad / 2;
        var xmid = xmid + xrad;
        var ymid = ymid + sign * yrad;
        var x = xmid;
        var y = ymid + sign * yrad;
        var step = Math.PI / 100;
        for (var theta = Math.PI / 2; theta < Math.PI; theta += step) {
            this.penUp(args, util);
            util.target.setXY(x, y);
            var x = xmid + xrad * Math.cos(theta);
            var y = ymid + sign * yrad * Math.sin(theta);
            this.penDown(args, util);
            util.target.setXY(x, y);
            this.penUp(args, util);
        }

        var x = this.staffStartX + xstep + xrad;
        var y = ymid - this.spaceBetween - 11 * this.staffWidth;
        var xmid = this.staffStartX + xstep;
        var ymid = ymid - this.spaceBetween - 11 * this.staffWidth;
        for (var theta = 0; theta < Math.PI / 2; theta += step) {
            this.penUp(args, util);
            util.target.setXY(x, y);
            var x = xmid + xrad * Math.cos(theta);
            var y = ymid + sign * yrad * Math.sin(theta);
            this.penDown(args, util);
            util.target.setXY(x, y);
            this.penUp(args, util);
        }
    }

    addTie(xmid, ymid, up, xstep, args, util) {
        if (xmid + xstep > this.staffStartX + this.staffLength) {
            this.addMultiLineTie(xmid, ymid, up, xstep, args, util);
        } else {
            var xrad = 8;
            var yrad = 4;
            if (up) {
                var sign = -1;
            } else {
                sign = 1;
            }
            var xrad = xrad + xstep / 2 - 8 - xrad / 4;
            var yrad = xrad / 2;
            var xmid = xmid + xrad;
            var ymid = ymid + sign * yrad;
            var x = xmid + xrad;
            var y = ymid;
            var step = Math.PI / 100;
            for (var theta = 0; theta < Math.PI; theta += step) {
                this.penUp(args, util);
                util.target.setXY(x, y);
                var x = xmid + xrad * Math.cos(theta);
                var y = ymid + sign * yrad * Math.sin(theta);
                this.penDown(args, util);
                util.target.setXY(x, y);
                this.penUp(args, util);
            }
        }
    }

    addRest(xmid, ymid, dur, args, util) {
        var symbolDur = dur;
        if (dur == 3) {
            symbolDur = 2; //add normal half note rest and then dot it
        }
        var restSymbol = this.rests[symbolDur];
        var restX = xmid;
        var restY = ymid;
        var offset = this.restOffset[symbolDur];
        if (dur > 1) {
            var xOffset = 8;
        } else {
            var xOffset = 0;
        }
        var scale = this.restScale[symbolDur];
        this.penUp(args, util);
        for (var i in restSymbol) {
            coord = restSymbol[i];
            restX = coord[0] / scale + xmid - xOffset;
            restY = -coord[1] / scale + ymid + offset;
            util.target.setXY(restX, restY);
            this.penDown(args, util);
        }
        this.penUp(args, util);
        if (dur == 3) {
            var xmid = xmid + 15;
            var ymid = ymid + offset;
            var step = Math.PI / 100;
            var rad = 2;
            for (var theta = 0; theta < 2 * Math.PI; theta += step) {
                this.penUp(args, util);
                util.target.setXY(xmid, ymid);
                var restX = xmid + rad * Math.cos(theta);
                var restY = ymid - rad * Math.sin(theta);
                this.penDown(args, util);
                util.target.setXY(restX, restY);
            }
        }

    }

    addAccidental(xmid, ymid, note, acc, args, util) {
        var xrad = 8;
        var yrad = 4;
        var xmid = xmid;
        var ymid = ymid;
        if (acc == "sharp") {
            this.drawString("S", xmid - xrad * 4, ymid + yrad * 1.5, 0.75, args, util)
        }
        if (acc == "flat") {
            this.drawString("F", xmid - xrad * 3, ymid + yrad * 1.5 + 2, 0.8, args, util);

        }
    }

    addLedgers(xmid, ymid, note, args, util) {
        var xrad = 8;
        var yrad = 4;
        if (note > 0) { //treble
            if (note % 2 == 0) {
                this.penUp(args, util);
                util.target.setXY(xmid - xrad - 3, ymid);
                this.penDown(args, util);
                util.target.setXY(xmid + xrad + 3, ymid);
            }
            else {
                this.penUp(args, util);
                util.target.setXY(xmid - xrad - 3, ymid - yrad);
                this.penDown(args, util);
                util.target.setXY(xmid + xrad + 3, ymid - yrad);
            }
            for (var i = 0; i < note - 9; i += 2) {
                if (i / 2 != 0) {
                    if (note % 2 == 0) {
                        this.penUp(args, util);
                        util.target.setXY(xmid - xrad - 3, ymid - yrad * i);
                        this.penDown(args, util);
                        util.target.setXY(xmid + xrad + 3, ymid - yrad * i);
                    }
                    else {
                        this.penUp(args, util);
                        util.target.setXY(xmid - xrad - 3, ymid - yrad - yrad * i);
                        this.penDown(args, util);
                        util.target.setXY(xmid + xrad + 3, ymid - yrad - yrad * i);
                    }
                }
            }
        } else { //bass
            if (note % 2 == 0) {
                this.penUp(args, util);
                util.target.setXY(xmid - xrad - 3, ymid);
                this.penDown(args, util);
                util.target.setXY(xmid + xrad + 3, ymid);
            }
            else {
                this.penUp(args, util);
                util.target.setXY(xmid - xrad - 3, ymid + yrad);
                this.penDown(args, util);
                util.target.setXY(xmid + xrad + 3, ymid + yrad);
            }

            for (var i = 0; i < -note - 1; i += 2) {
                if (i / 2 != 0) {
                    if (note % 2 == 0) {
                        this.penUp(args, util);
                        util.target.setXY(xmid - xrad - 3, ymid + yrad * i);
                        this.penDown(args, util);
                        util.target.setXY(xmid + xrad + 3, ymid + yrad * i);
                    }
                    else {
                        this.penUp(args, util);
                        util.target.setXY(xmid - xrad - 3, ymid + yrad + yrad * i);
                        this.penDown(args, util);
                        util.target.setXY(xmid + xrad + 3, ymid + yrad + yrad * i);
                    }
                }
            }

        }
    }

    drawNote(xmid, ymid, duration, up, args, util) {
        var xrad = 8;
        var yrad = 4;
        if (up) {
            flip = 1;
        } else {
            flip = -1;
        }
        step = Math.PI / 100;
        if (duration <= 1) { //draw solid note for sixteenth, eighth, and quarter notes
            for (var theta = 0; theta < 2 * Math.PI; theta += step) {
                this.penUp(args, util);
                util.target.setXY(xmid, ymid);
                var x = xmid + xrad * Math.cos(theta);
                var y = ymid - yrad * Math.sin(theta);
                this.penDown(args, util);
                util.target.setXY(x, y);
            }
        } else { //draw hollow note for half, dotted half, and whole notes
            x = xmid + xrad;
            y = ymid;
            for (var theta = 0; theta < 2 * Math.PI; theta += step) {
                this.penUp(args, util);
                util.target.setXY(x, y);
                x = xmid + xrad * Math.cos(theta);
                y = ymid - yrad * Math.sin(theta);
                this.penDown(args, util);
                util.target.setXY(x, y);
            }
            x = xmid + xrad - 1;
            y = ymid;
            for (var theta = 0; theta < 2 * Math.PI; theta += step) {
                this.penUp(args, util);
                util.target.setXY(x, y);
                x = xmid + (xrad - 1) * Math.cos(theta);
                y = ymid - (yrad - 1) * Math.sin(theta);
                this.penDown(args, util);
                util.target.setXY(x, y);
            }
        }
        if (duration == 3) { //add dot for dotted half note
            dotrad = 2;
            for (var theta = 0; theta < 2 * Math.PI; theta += step) {
                this.penUp(args, util);
                util.target.setXY(xmid + 12, ymid);
                var x = xmid + 12 + dotrad * Math.cos(theta);
                var y = ymid - dotrad * Math.sin(theta);
                this.penDown(args, util);
                util.target.setXY(x, y);
            }
        }
        if (duration != 4) { //add stem for non-whole notes
            this.penUp(args, util);
            util.target.setXY(xmid + flip * xrad, ymid);
            this.penDown(args, util);
            util.target.setXY(xmid + flip * xrad, ymid + flip * 30);
        }
        if (duration < 1) { //add tails for < quarter notes
            if (duration === 0) {
                return;
            }
            offset = 0;
            for (var i = 0; i < 1 / (duration * 2); i++) {
                this.penUp(args, util);
                util.target.setXY(xmid + flip * xrad, ymid + flip * (30 + offset * 6));
                this.penDown(args, util);
                util.target.setXY(xmid + flip * xrad + 2, ymid + flip * (30 + offset * 6 - 8));
                util.target.setXY(xmid + flip * xrad + 10, ymid + flip * (30 + offset * 6 - 12));
                this.penUp(args, util);
                util.target.setXY(xmid + flip * xrad, ymid + flip * (30 + offset * 6 + 2));
                this.penDown(args, util);
                util.target.setXY(xmid + flip * xrad + 2, ymid + flip * (30 + offset * 6 - 8 + 1));
                util.target.setXY(xmid + flip * xrad + 10, ymid + flip * (30 + offset * 6 - 12 + 1));
                offset += 1;
                this.penUp(args, util);
            }
        }

    }

    convertSignalToMusicList(args, util) {
        var signal = [];
        var beats = 0;
        for (var i in this.noteList) {
            freq = this.noteList[i][0];
            var acc = "";
            if (sharps.includes(freq)) {
                acc = "sharp";
            }
            if (flats.includes(freq)) {
                acc = "flat";
            }

            let adjusted = false;

            if (freq >= 60) {
                if (freq > this._staffLims['hi_note']) {
                    adjusted = true;
                    console.log(`adjusting (treble) ${freq} to ${this._staffLims['hi_note']}`);
                    freq = this._staffLims['hi_note'];
                }
                var staff = pitchToStaff[freq];
                var dur = this.noteList[i][1] * 4;
                var amp = this.noteList[i][3];
                var clef = "treble";
            } else {
                if (freq === undefined || freq < this._staffBaseLims['lo_note']) {
                    adjusted = true;
                    console.log(`adjusting (bass) ${freq} to ${this._staffBaseLims['lo_note']}`);
                    freq = this._staffBaseLims['lo_note'];
                }
                var staff = pitchToStaffBass[freq];
                var dur = this.noteList[i][1] * 4;
                var amp = this.noteList[i][3];
                var clef = "bass";
            }
            var newBeats = 0;
            if (beats + dur == 4) {
                newBeats = 0;
                signal.push([staff, dur, amp, clef, acc, "", adjusted]);
            } else if (beats + dur > 4) {
                signal.push([staff, 4 - beats, amp, clef, acc, "tie", adjusted]);
                signal.push([staff, dur - (4 - beats), amp, clef, acc, "", adjusted]);
                newBeats = dur - (4 - beats);
            } else {
                newBeats = beats + dur;
                signal.push([staff, dur, amp, clef, acc, "", adjusted]);
            }
            beats = newBeats;


        }
        return signal;
    }

    penUp(args, util) {
        const penState = this._getPenState(util.target);
        if (penState.penDown) {
            penState.penDown = false;
            util.target.removeListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
        }
    }

    penDown(args, util, penSkinId) {
        const penState = this._getPenState(util.target);
        if (!penState.penDown) {
            penState.penDown = true;
            util.target.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
        }

        penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penPoint(penSkinId, penState.penAttributes, util.target.x, util.target.y);
            this.runtime.requestRedraw();
        }
    }

    /**
     * The pen "set pen color to {color}" block sets the pen to a particular RGB color.
     * The transparency is reset to 0.
     * @param {object} args - the block arguments.
     *  @property {int} COLOR - the color to set, expressed as a 24-bit RGB value (0xRRGGBB).
     * @param {object} util - utility object provided by the runtime.
     */
    setPenColorToColor(newColor, util) {
        const penState = this._getPenState(util.target);
        const rgb = Cast.toRgbColorObject(newColor);
        const hsv = Color.rgbToHsv(rgb);
        penState.color = (hsv.h / 360) * 100;
        penState.saturation = hsv.s * 100;
        penState.brightness = hsv.v * 100;
        if (rgb.hasOwnProperty('a')) {
            penState.transparency = 100 * (1 - (rgb.a / 255.0));
        } else {
            penState.transparency = 0;
        }

        // Set the legacy "shade" value the same way scratch 2 did.
        penState._shade = penState.brightness / 2;

        this._updatePenColor(penState);
    }

    /**
     * Update the cached color from the color, saturation, brightness and transparency values
     * in the provided PenState object.
     * @param {PenState} penState - the pen state to update.
     * @private
     */
    _updatePenColor(penState) {
        const rgb = Color.hsvToRgb({
            h: penState.color * 360 / 100,
            s: penState.saturation / 100,
            v: penState.brightness / 100
        });
        penState.penAttributes.color4f[0] = rgb.r / 255.0;
        penState.penAttributes.color4f[1] = rgb.g / 255.0;
        penState.penAttributes.color4f[2] = rgb.b / 255.0;
        penState.penAttributes.color4f[3] = this._transparencyToAlpha(penState.transparency);
    }

    /**
     * Convert a pen transparency value to an alpha value.
     * Alpha ranges from 0 to 1, where 0 is transparent and 1 is opaque.
     * Transparency ranges from 0 to 100, where 0 is opaque and 100 is transparent.
     * @param {number} transparency - the input transparency value.
     * @returns {number} the alpha value.
     * @private
     */
    _transparencyToAlpha(transparency) {
        return 1.0 - (transparency / 100.0);
    }

    /**
     * The pen "clear" block clears the pen layer's contents.
     */
    clear() {
        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penClear(penSkinId);
            this.runtime.requestRedraw();
        }
    }

}

module.exports = SheetMusic;