const Clone = require('../../util/clone');
const log = require('../../util/log');
const Cast = require('../../util/cast');
const Color = require('../../util/color');
const RenderedTarget = require('../../sprites/rendered-target');
const StageLayering = require('../../engine/stage-layering');

const letters = require('./letters');
const symbols = require('./symbols');
const { updateVariableIdentifiers } = require('../../util/variable-util');

var midi, inst, dur, harmonic, pitch, k, coeff, hPitch, d, maxDuration, maxFreq, f, start, end, i, coord, x, y;


class Spectrogram {
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
        this.blue = '0x00008B';
        this.yellow = '0xffff00';

        this.noteList = [];

        this.axisStartX = -200;
        this.axisStartY = -150;
        this.xAxisLength = 400;
        this.yAxisLength = 300;

        this._onTargetCreated = this._onTargetCreated.bind(this);
        this.runtime.on('targetWasCreated', this._onTargetCreated);

        this._onTargetMoved = this._onTargetMoved.bind(this);

        this.harmonics = {
            "Piano": [[1, 1], [3, 0.42], [4, 0.22]], //DONE
            "Guitar": [[1, 0.55], [2, 0.47], [3, 0.68], [4, 0.24]],
            "Bass": [[1, 1], [3, 0.78], [4, 0.22]],
            "Cello": [[1, 1], [2, 0.47], [3, 0.24], [4, 0.15]], //DONE
            "Saxophone": [[1, 1], [2, 0.38], [3, 0.14], [4, 0.02]], //DONE
            "Clarinet": [[1, 0.57], [2, 0.87], [3, 0.23], [4, 0]], //DONE
            "Synth": [[1, 1], [2, 0], [3, 0], [4, 0]]  //DONE
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
            'z': letters.z
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
            'z': 55.959159859976694
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
            const penState = sourceTarget.getCustomState(Spectrogram.VIZ_STATE_KEY);
            if (penState) {
                newTarget.setCustomState(Spectrogram.VIZ_STATE_KEY, Clone.simple(penState));
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
        let penState = target.getCustomState(Spectrogram.VIZ_STATE_KEY);
        if (!penState) {
            penState = Clone.simple(Spectrogram.DEFAULT_PEN_STATE);
            target.setCustomState(Spectrogram.VIZ_STATE_KEY, penState);
        }
        return penState;
    }

    testSpectViz(noteList, args, util) {
        this.setPenColorToColor(this.black, util);
        this.noteList = noteList;
        this.clear();
        this.drawAxes(args, util);
        this.drawSpectrogram(args, util);

    }

    labelAxes(args, util) {
        this.setPenColorToColor(this.black, util);
        this.drawString('time', this.axisStartX + this.xAxisLength - 40, this.axisStartY - 5, 0.8, args, util);
        this.drawString('frequencies', this.axisStartX - 30, this.axisStartY + this.yAxisLength + 20, 0.8, args, util);

        this.drawString('spectrogram', this.axisStartX + this.xAxisLength / 2 - 70, this.axisStartY + this.yAxisLength + 20, 1, args, util);
    }

    drawSpectrogram(args, util) {
        const freqs = [];
        const amps = [];
        const durs = [];
        const coeffs = [];
        d = 0;
        this.setPenColorToColor(this.yellow, util);
        for (let i in this.noteList) {
            midi = this.noteList[i][0];
            inst = this.noteList[i][2];
            dur = this.noteList[i][1];
            harmonic = this.harmonics[inst];
            pitch = 2 ** ((midi - 69) / 12) * 440;
            for (let i in harmonic) {
                k = harmonic[i][0];
                coeff = harmonic[i][1];
                hPitch = pitch * k;
                freqs.push(hPitch);
                amps.push(coeff);
                durs.push([d, d + dur])
                coeffs.push(coeff);
            }
            d += dur;
        }
        maxDuration = d;
        maxFreq = Math.max(...freqs);
        for (let i in freqs) {
            f = freqs[i] / (maxFreq + 5);
            d = durs[i];
            coeff = coeffs[i];
            start = d[0];
            end = d[1];
            start = start / maxDuration;
            end = end / maxDuration;
            if (coeff != 0) {
                this.penUp(args, util);
                util.target.setXY(this.axisStartX + start * this.xAxisLength, this.axisStartY + this.yAxisLength * f);
                this.penDown(args, util);
                util.target.setXY(this.axisStartX + end * this.xAxisLength, this.axisStartY + this.yAxisLength * f);
                this.penUp(args, util);

                this.penUp(args, util);
                util.target.setXY(this.axisStartX + start * this.xAxisLength, this.axisStartY + this.yAxisLength * f + 1);
                this.penDown(args, util);
                util.target.setXY(this.axisStartX + end * this.xAxisLength, this.axisStartY + this.yAxisLength * f + 1);
                this.penUp(args, util);
            }

        }
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
        letter = letters[letter];
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

    fillInSpec(args, util) {
        this.setPenColorToColor(this.blue, util);
        for (var i = this.axisStartY + 1; i < this.axisStartY + this.yAxisLength; i++) {
            this.penUp(args, util);
            util.target.setXY(this.axisStartX + 1, i);
            this.penDown(args, util);
            util.target.setXY(this.axisStartX + this.xAxisLength, i);
            this.penUp(args, util);
        }
    }

    drawAxes(args, util) {
        util.target.setXY(this.axisStartX, this.axisStartY + this.yAxisLength);
        this.penDown(args, util);
        util.target.setXY(this.axisStartX, this.axisStartY);
        this.penUp(args, util);
        util.target.setXY(this.axisStartX, this.axisStartY);
        this.penDown(args, util);
        util.target.setXY(this.axisStartX + this.xAxisLength, this.axisStartY);
        this.penUp(args, util);
        this.fillInSpec(args, util);
        this.labelAxes(args, util);
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

module.exports = Spectrogram;