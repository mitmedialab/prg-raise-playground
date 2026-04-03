const Clone = require('../../util/clone');
const log = require('../../util/log');
const Cast = require('../../util/cast');
const Color = require('../../util/color');
const RenderedTarget = require('../../sprites/rendered-target');
const StageLayering = require('../../engine/stage-layering');

const symbols = require('./symbols');
const SheetMusicHelper = require('./sheetmusic');
const WaveformHelper = require('./waveform');
const SpectrogramHelper = require('./spectrogram');
const FFTHelper = require('./fft');
const { updateVariableIdentifiers } = require('../../util/variable-util');
const { e } = require('./letters');
const BlockUtility = require('../../engine/block-utility');

var harmonics;

class VizHelpers {
    constructor(runtime) {
        this.runtime = runtime;

        this._count = 0;
        this._visState = { status: false, mode: undefined };
        this._noteBuf = { sheet: [], wave: [], freq: [], freqs: [] };
        this._visNames = { 1: 'sheet', 2: 'wave', 3: 'freq', 4: 'freqs' };
        this._visLims = { 'sheet': 50, 'wave': 5, 'freq': 15, 'freqs': 15 };
        this._continuousScroll = { 'sheet': false, 'wave': true, 'freq': false, 'freqs': true };

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

        this.noteList = [];

        this.axisStartX = -200;
        this.axisStartY = -150;
        this.xAxisLength = 400;
        this.yAxisLength = 300;

        this.staffLength = 400;
        this.staffStartX = -200;
        this.staffStartY = 130;
        this.staffWidth = 8;

        this.spaceBetween = 70;

        this.sheetMusicViz = new SheetMusicHelper(runtime);
        this.waveformViz = new WaveformHelper(runtime);
        this.spectrogramViz = new SpectrogramHelper(runtime);
        this.fftViz = new FFTHelper(runtime);

        this.wavePen = -1;
        this.musicPen = 2;
        this.FFTPen = 3;
        this.spectPen = 4;

        this._onTargetCreated = this._onTargetCreated.bind(this);
        this.runtime.on('targetWasCreated', this._onTargetCreated);

        this._onTargetMoved = this._onTargetMoved.bind(this);

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
            const penState = sourceTarget.getCustomState(VizHelpers.VIZ_STATE_KEY);
            if (penState) {
                newTarget.setCustomState(VizHelpers.VIZ_STATE_KEY, Clone.simple(penState));
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
        let penState = target.getCustomState(VizHelpers.VIZ_STATE_KEY);
        if (!penState) {
            penState = Clone.simple(VizHelpers.DEFAULT_PEN_STATE);
            target.setCustomState(VizHelpers.VIZ_STATE_KEY, penState);
        }
        return penState;
    }

    toggleVisMode(args, util) {
        const status = Cast.toNumber(args.STATUS);
        const mode = Cast.toNumber(args.FORMAT);
        const prev_mode = this._visState.mode;
        const prev_status = this._visState.status;
        const status_bool = !!status;
        this._visState = { mode: mode, status: status_bool };
        if (!status_bool) {
            this.clearAllViz();
        } else if (mode !== prev_mode || !prev_status) this.requestViz(null, util);
    }

    clearAllViz() {
        this.fftViz.clear();
        this.sheetMusicViz.clear();
        this.spectrogramViz.clear();
        this.waveformViz.clear();
        this.clear();
    }

    clearNoteBuffers() {
        for (let b in this._noteBuf) {
            this._noteBuf[b] = [];
        }
    }


    clearSheetMusicList() {
        this._noteBuf['sheet'].length = 0;
    }

    /**
     * 
     * @param {array} note - [freq, duration, instrument, volume]
     */
    requestViz(note, util) {
        if (this._visState['status']) {
            this.processViz(note, util);
        }
    }


    /**
     * 
     * @param {[number,number,string,number] | null} note - if null, this represents the case where we are clearing the canvas
     *                                                      otherwise, [note,duration,instrument name, volume] 
     * @param {BlockUtility} util 
     */
    processViz(note, util) {
        const mode = this._visState['mode'];
        const name = this._visNames[mode];
        const lim = this._visLims[name];
        const cont = this._continuousScroll[name];
        let buf = this._noteBuf[name];
        if (cont) {
            while (buf.length + 1 >= lim) {
                buf = buf.splice(1);
            }
        } else {
            if (buf.length + 1 >= lim) buf = [];
        }

        try {
            note[4] = this._count++;
            buf.push(note);
        } catch (error) {
            buf = [];
        }
        this._noteBuf[name] = buf;
        const [x, y] = this.getXY(util);
        switch (name) {
            case 'wave':
                this.testWaveformViz(buf, null, util);
                break;
            case 'freq':
                this.testFreqViz(buf, null, util);
                break;
            case 'freqs':
                this.testSpectViz(buf, null, util);
                break;
            default:
                this.testSheetMusicViz(buf, null, util);
        }
        if (util && util.target) {
            util.target.setXY(x, y);
        }
    }

    testWaveformViz(noteList, args, util) {
        this.fftViz.clear();
        this.sheetMusicViz.clear();
        this.spectrogramViz.clear();
        this.waveformViz.clear();
        this.waveformViz.testWaveformViz(noteList, args, util);
    }

    testSheetMusicViz(noteList, args, util) {
        this.clear();
        this.fftViz.clear();
        this.sheetMusicViz.clear();
        this.spectrogramViz.clear();
        this.waveformViz.clear();
        log.log("VIZ", noteList);
        this.sheetMusicViz.testSheetMusicViz(noteList, args, util, this);
    }

    testFreqViz(noteList, args, util) {
        this.fftViz.clear();
        this.sheetMusicViz.clear();
        this.spectrogramViz.clear();
        this.waveformViz.clear();
        this.fftViz.testFreqViz(noteList, args, util);

    }

    testSpectViz(noteList, args, util) {
        this.fftViz.clear();
        this.sheetMusicViz.clear();
        this.spectrogramViz.clear();
        this.waveformViz.clear();
        this.spectrogramViz.testSpectViz(noteList, args, util);

    }

    drawFFT(args, util) {
        freqs = [];
        amps = [];
        for (let i in this.noteList) {
            midi = this.noteList[i][0];
            inst = this.noteList[i][2];
            harmonic = harmonics[inst];
            pitch = 2 ** ((midi - 69) / 12) * 440;
            for (let i in harmonic) {
                k = harmonic[i][0];
                coeff = harmonic[i][1];
                hPitch = pitch * k;
                exists = false;
                for (f in freqs) {
                    fr = freqs[f];
                    if (Math.abs(hPitch - fr) < 10 ** -9) {
                        amps[f] += coeff;
                        exists = true;
                    }
                }
                if (!exists) {
                    amp = coeff;
                    freqs.push(hPitch);
                    amps.push(amp);
                }

            }
        }
        maxFreq = Math.max(...freqs);
        maxAmp = Math.max(...amps);
        for (let i in freqs) {
            freq = freqs[i];
            amp = amps[i];
            ratio = freq / maxFreq;
            ratioAmp = amp / maxAmp;
            this.penUp(args, util);
            util.target.setXY(this.axisStartX + ratio * this.xAxisLength, this.axisStartY + this.yAxisLength / 2);
            this.penDown(args, util);
            util.target.setXY(this.axisStartX + ratio * this.xAxisLength, this.axisStartY + this.yAxisLength / 2 + this.yAxisLength / 2 * ratioAmp);
            this.penUp(args, util);
        }
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
    }

    findCrescDecresc() {
        //CHANGE TO MP AND P ETC
        up = [];
        down = [];
        upstart = 0;
        downstart = 0;
        for (var i in this.noteList) {
            log.log(this.noteList[i][3]);

        }

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

    /**
     * 
     * @param {BlockUtility} util 
     */
    getXY(util) {
        if (!util) return [0, 0];
        if (!util.target) return [0, 0];
        const { x, y } = util.target;
        return [x ? x : 0, y ? y : 0];
    }
}

module.exports = VizHelpers;