const Clone = require('../../util/clone');
const log = require('../../util/log');
const Cast = require('../../util/cast');
const Color = require('../../util/color');
const RenderedTarget = require('../../sprites/rendered-target');
const StageLayering = require('../../engine/stage-layering');
const FreqToNote = require('./freqtonote');

const letters = require('./letters');
const textRender = require('./textrender');
const { updateVariableIdentifiers } = require('../../util/variable-util');


var colorToFreq, note, coord, x, y, colorX, colorY, colors, signal, fs, xStep, heightScaling, st, prevFreq, midi, dur, inst, vol, c, freq, Omega, val, harmonic, coeff, newk, s, color;
class Waveform {
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
        this.white = '0xffffff';

        this.noteList = [];

        this.axisStartX = -200;
        this.axisStartY = -150;
        this.xAxisLength = 400;
        this.yAxisLength = 300;

        this.legendStartX = 150;
        this.legendStartY = 80;
        this.legendLengthX = 75;
        this.legendLengthY = 80;

        this.textRenderer = new textRender(runtime);

        this._onTargetCreated = this._onTargetCreated.bind(this);
        this.runtime.on('targetWasCreated', this._onTargetCreated);

        this._onTargetMoved = this._onTargetMoved.bind(this);

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

        this.spacing = {
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
            'F': 67.9352750809062,
            'S': 122.6148867313916
        }

        this.harmonics = {
            "Piano": [[1, 1], [3, 0.42], [4, 0.22]], //DONE
            "Guitar": [[1, 0.55], [2, 0.47], [3, 0.68], [4, 0.24]],
            "Bass": [[1, 1], [3, 0.78], [4, 0.22]],
            "Cello": [[1, 1], [2, 0.47], [3, 0.24], [4, 0.15]], //DONE
            "Saxophone": [[1, 1], [2, 0.38], [3, 0.14], [4, 0.02]], //DONE
            "Clarinet": [[1, 0.57], [2, 0.87], [3, 0.23], [4, 0]], //DONE
            "Synth": [[1, 1], [2, 0], [3, 0], [4, 0]]  //DONE
        }

        colorToFreq = {};
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
            const penState = sourceTarget.getCustomState(Waveform.VIZ_STATE_KEY);
            if (penState) {
                newTarget.setCustomState(Waveform.VIZ_STATE_KEY, Clone.simple(penState));
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

    _getWavePenLayerID() {
        if (this.wavePen < 0 && this.runtime.renderer) {
            this.wavePen = this.runtime.renderer.createPenSkin();
            this.wavePenDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableProperties(this.wavePenDrawableId, { skinId: this.wavePen });
        }
        return this.wavePen;
    }

    _getPenState(target) {
        let penState = target.getCustomState(Waveform.VIZ_STATE_KEY);
        if (!penState) {
            penState = Clone.simple(Waveform.DEFAULT_PEN_STATE);
            target.setCustomState(Waveform.VIZ_STATE_KEY, penState);
        }
        return penState;
    }


    testWaveformViz(noteList, args, util) {
        this.setPenColorToColor(this.black, util);
        this.noteList = noteList;
        this.clear();
        this.drawAxes(args, util);
        this.drawSignal(args, util);
        this.drawLegend(args, util);
        this.labelAxes(args, util);
    }

    labelAxes(args, util) {
        this.drawString('time', this.axisStartX + this.xAxisLength - 40, this.axisStartY + this.yAxisLength / 2 - 5, 0.8, args, util);
        this.drawString('signal', this.axisStartX - 30, this.axisStartY + this.yAxisLength + 20, 0.8, args, util);

        this.drawString('waveform', this.axisStartX + this.xAxisLength / 2 - 70, this.axisStartY + this.yAxisLength + 20, 1, args, util);
    }


    drawString(str, xstart, ystart, size, args, util) {
        for (var i in str) {
            xstart += 5 * size;
            if (i >= 1) {
                xstart += this.spacing[str[i - 1]] / 5 * size;
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

    drawLegend(args, util) {
        //draw Box
        this.penUp(args, util);
        util.target.setXY(this.legendStartX, this.legendStartY);
        this.penDown(args, util);
        util.target.setXY(this.legendStartX + this.legendLengthX, this.legendStartY);
        this.penDown(args, util);
        util.target.setXY(this.legendStartX + this.legendLengthX, this.legendStartY + this.legendLengthY);
        this.penDown(args, util);
        util.target.setXY(this.legendStartX, this.legendStartY + this.legendLengthY);
        this.penDown(args, util);
        util.target.setXY(this.legendStartX, this.legendStartY);
        this.penUp(args, util);

        for (var i = this.legendStartY + 1; i < this.legendStartY + this.legendLengthY; i++) {
            this.setPenColorToColor(this.white, util);
            this.penUp(args, util);
            util.target.setXY(this.legendStartX + 1, i);
            this.penDown(args, util);
            util.target.setXY(this.legendStartX + this.legendLengthX - 1, i);
        }

        //draw Title
        colorX = this.legendStartX + 5;
        colorY = this.legendStartY + this.legendLengthY - 20;
        this.setPenColorToColor(this.black, util);
        this.drawString('legend', colorX, this.legendStartY + this.legendLengthY - 5, 0.7, args, util);

        for (let color in colorToFreq) {
            this.setPenColorToColor(color, util);
            for (var c = 0; c <= 10; c++) {
                this.penUp(args, util);
                util.target.setXY(colorX, colorY - c);
                this.penDown(args, util);
                util.target.setXY(colorX + 15, colorY - c);
            }
            this.setPenColorToColor(this.black, util);
            this.penUp(args, util);
            this.drawString(FreqToNote.freqToNote(colorToFreq[color]), colorX + 25, colorY, 0.6, args, util);
            colorY -= 15;
        }

        this.setPenColorToColor(this.black, util);
        this.penUp(args, util);

    }

    drawAxes(args, util) {
        util.target.setXY(this.axisStartX, this.axisStartY + this.yAxisLength);
        this.penDown(args, util);
        util.target.setXY(this.axisStartX, this.axisStartY);
        this.penUp(args, util);
        util.target.setXY(this.axisStartX, this.axisStartY + this.yAxisLength / 2);
        this.penDown(args, util);
        util.target.setXY(this.axisStartX + this.xAxisLength, this.axisStartY + this.yAxisLength / 2);
        this.penUp(args, util);
        //this.drawLabels(args, util);
    }

    drawLabels(args, util) {
        this.textRenderer.say('here', args, util);
    }

    /**
     * 
     * @param {array} note - note[4] contains the ID of this note
     * @returns the color associated with this note
     */
    getColorFromNote(note) {
        colors = ['0xff0000', '0x0000ff', '0x00ff00', '0xffa500'];
        return colors[note[4] % colors.length];
    }

    drawSignal(args, util) {
        colors = ['0xff0000', '0x0000ff', '0x00ff00', '0xffa500']
        const color_count = colors.length;
        colorToFreq = {};
        x = this.axisStartX;
        y = this.axisStartY + this.yAxisLength / 2;
        signal = this.noteList;
        fs = 500;
        const totalSamples = fs * signal
            .map(v => v[1])
            .reduce((sum, current) => sum + current, 0);
        xStep = this.xAxisLength / totalSamples;
        heightScaling = 100;
        util.target.setXY(x, y);
        this.penDown(args, util);
        st = 0;
        prevFreq = 0;
        for (var i in signal) {
            note = signal[i];
            midi = note[0];
            dur = note[1];
            inst = note[2];
            vol = note[3];
            c = this.getColorFromNote(note);
            colorToFreq[c] = midi;
            this.setPenColorToColor(c, util);
            freq = 2 ** ((midi - 69) / 12) * 440;
            Omega = 2 * Math.PI * freq / 44140;
            var st = st * prevFreq / Omega;
            prevFreq = Omega;
            for (s = st; s < st + dur * fs; s++) {
                val = 0
                for (var k in this.harmonics[inst]) {
                    harmonic = this.harmonics[inst][k];
                    coeff = harmonic[1];
                    newk = harmonic[0];
                    val = val + coeff * (Math.sin(Omega * newk * s * 3));
                }
                util.target.setXY(x, y + vol * val);
                x = x + xStep;
            }
            st = st + dur * fs;
        }
        this.penUp(args, util);
        this.setPenColorToColor(this.black, util);
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

module.exports = Waveform;