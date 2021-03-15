const Clone = require('../../util/clone');
const log = require('../../util/log');
const Cast = require('../../util/cast');
const Color = require('../../util/color');
const RenderedTarget = require('../../sprites/rendered-target');
const StageLayering = require('../../engine/stage-layering');

const symbols = require('./symbols');
const { updateVariableIdentifiers } = require('../../util/variable-util');

class VizHelpers {
    constructor (runtime) {
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

        this.wavePen = -1;
        this.musicPen = 2;
        this.FFTPen = 3;
        this.spectPen = 4;

        this._onTargetCreated = this._onTargetCreated.bind(this);
        this.runtime.on('targetWasCreated', this._onTargetCreated);

        this._onTargetMoved = this._onTargetMoved.bind(this);

        pitchToStaff = {
            60: -2,
            61: -2,
            62: -1,
            63: 0,
            64: 0,
            65: 2,
            66: 2,
            67: 3,
            68: 3,
            69: 4,
            70: 5,
            71: 5,
            72: 6,
            73: 6,
            75: 7,
            76: 8
        }

        harmonics = {
            "Piano": [[1,1], [2, 0.5]],
            "Guitar": [[1,1], [2, 0.25]],
            "Bass": [[1,1], [3, 0.5]],
            "Cello": [[1,1], [4, 0.5]],
            "Saxophone": [[1,1], [5, 0.5]],
            "Clarinet": [[1,1], [6, 0.5]],
            "Synth":[[1,1]] 
        }

        this.symbols = {
            15: [symbols.piano, symbols.piano],
            30: [symbols.piano],
            45: [symbols.mezzo, symbols.piano],
            60: [symbols.mezzo, symbols.forte],
            85: [symbols.forte],
            100: [symbols.forte, symbols.forte]
        }
    }

    /**
     * The key to load & store a target's music-related state.
     * @type {string}
     */
    static get VIZ_STATE_KEY () {
        return 'Scratch.musicviz';
    }

    static get DEFAULT_PEN_STATE () {
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
    static get PEN_SIZE_RANGE () {
        return {min: 1, max: 1200};
    }

        /**
     * When a music-playing Target is cloned, clone the music state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated (newTarget, sourceTarget) {
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

    _onTargetMoved (target, oldX, oldY, isForce) {
        // Only move the pen if the movement isn't forced (ie. dragged).
        if (!isForce) {
            const penSkinId = this._getPenLayerID();
            if (penSkinId >= 0) {
                const penState = this._getPenState(target);
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, oldX, oldY, target.x, target.y);
                this.runtime.requestRedraw();
            }
        }
    }

    _getPenLayerID () {
        if (this._penSkinId < 0 && this.runtime.renderer) {
            this._penSkinId = this.runtime.renderer.createPenSkin();
            this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableProperties(this._penDrawableId, {skinId: this._penSkinId});
        }
        return this._penSkinId;
    }

    _getWavePenLayerID () {
        if (this.wavePen < 0 && this.runtime.renderer) {
            this.wavePen = this.runtime.renderer.createPenSkin();
            this.wavePenDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableProperties(this.wavePenDrawableId, {skinId: this.wavePen});
        }
        return this.wavePen;
    }

    _getPenState (target) {
        let penState = target.getCustomState(VizHelpers.VIZ_STATE_KEY);
        if (!penState) {
            penState = Clone.simple(VizHelpers.DEFAULT_PEN_STATE);
            target.setCustomState(VizHelpers.VIZ_STATE_KEY, penState);
        }
        return penState;
    }

    testWaveformViz (noteList, args, util) {
        this.setPenColorToColor(this.black, util);
        this.noteList = noteList;
        this.clear();
        this.drawAxes(args, util);
        this.drawSignal(args, util);
    }

    testSheetMusicViz (noteList, args, util) {
        this.setPenColorToColor(this.black, util);
        this.noteList = noteList;
        this.clear();
        this.drawStaff(args, util);
        this.drawMusic(args, util);
    }

    testFreqViz (noteList, args, util) {
        this.setPenColorToColor(this.black, util);
        this.noteList = noteList;
        this.clear();
        this.drawAxes(args, util);
        this.drawFFT(args, util);

    }

    testSpectViz (noteList, args, util) {
        this.setPenColorToColor(this.black, util);
        this.noteList = noteList;
        this.clear();
        this.drawAxes(args, util);
        this.drawSpectrogram(args, util);

    }

    drawSpectrogram(args, util) {
        freqs = [];
        amps = [];
        durs = [];
        d = 0;
        for (i in this.noteList) {
            midi = this.noteList[i][0];
            inst = this.noteList[i][2];
            dur = this.noteList[i][1];
            harmonic = harmonics[inst];
            pitch = 2**((midi - 69)/12)*440;
            for (i in harmonic) {
                k = harmonic[i][0];
                coeff = harmonic[i][1];
                hPitch = pitch*k;
                freqs.push(hPitch);
                amps.push(coeff);
                durs.push([d, d+dur])

            }
            d += dur;
        }
        maxDuration = d;
        maxFreq = Math.max( ...freqs );
        for (i in freqs) {
            f = freqs[i]/maxFreq;
            d = durs[i];
            start = d[0];
            end = d[1];
            start = start/maxDuration;
            end = end/maxDuration;

            this.penUp(args, util);
            util.target.setXY(this.axisStartX + start*this.xAxisLength, this.axisStartY+this.yAxisLength/2+this.yAxisLength/2*f);
            this.penDown(args, util);
            util.target.setXY(this.axisStartX + end*this.xAxisLength, this.axisStartY+this.yAxisLength/2 + this.yAxisLength/2*f);
            this.penUp(args, util);  

        }
    }

    drawFFT(args, util) {
        freqs = [];
        amps = [];
        for (i in this.noteList) {
            midi = this.noteList[i][0];
            inst = this.noteList[i][2];
            harmonic = harmonics[inst];
            pitch = 2**((midi - 69)/12)*440;
            for (i in harmonic) {
                k = harmonic[i][0];
                coeff = harmonic[i][1];
                hPitch = pitch*k;
                exists = false;
                for (f in freqs) {
                    fr = freqs[f];
                    if (Math.abs(hPitch-fr) < 10**-9) {
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
        maxFreq = Math.max( ...freqs );
        maxAmp = Math.max( ...amps );
        for (i in freqs) {
            freq = freqs[i];
            amp = amps[i];
            ratio = freq/maxFreq;
            ratioAmp = amp/maxAmp;
            this.penUp(args, util);
            util.target.setXY(this.axisStartX + ratio*this.xAxisLength, this.axisStartY+this.yAxisLength/2);
            this.penDown(args, util);
            util.target.setXY(this.axisStartX + ratio*this.xAxisLength, this.axisStartY+this.yAxisLength/2 + this.yAxisLength/2*ratioAmp);
            this.penUp(args, util);    
        }
    }

    drawAxes(args, util) {
        util.target.setXY(this.axisStartX, this.axisStartY + this.yAxisLength);
        this.penDown(args, util);
        util.target.setXY(this.axisStartX, this.axisStartY);
        this.penUp(args, util);
        util.target.setXY(this.axisStartX, this.axisStartY+this.yAxisLength/2);
        this.penDown(args, util);
        util.target.setXY(this.axisStartX+this.xAxisLength, this.axisStartY+this.yAxisLength/2);
        this.penUp(args, util);
    }

    drawSignal(args, util) {
        colors = ['0xff0000', '0x0000ff']
        x = this.axisStartX;
        y = this.axisStartY+this.yAxisLength/2;
        signal = this.noteList;
        fs = 500;
        const totalSamples = fs*signal
            .map( v => v[1] )                                
            .reduce( (sum, current) => sum + current, 0 );
        xStep = this.xAxisLength/totalSamples;
        heightScaling = 100;
        util.target.setXY(x, y);
        this.penDown(args, util);
        st = 0;
        prevFreq = 0;
        for (var i in signal) {
            c = colors[i%2];
            this.setPenColorToColor(c, util);
            note = signal[i];
            midi = note[0];
            dur = note[1];
            inst = note[2];
            vol = note[3];
            freq = 2**((midi - 69)/12)*440;
            Omega = 2*Math.PI*freq/44140;
            var st = st*prevFreq/Omega;
            prevFreq = Omega;
            for (s = st; s < st + dur*fs; s++) {
                val = 0
                for (var k in harmonics[inst]) {
                    harmonic = harmonics[inst][k];
                    coeff = harmonic[1];
                    newk = harmonic[0];
                    val = val + coeff*(Math.sin(Omega*newk*s));
                }
                util.target.setXY(x, y + vol*val);
                x = x+xStep;
            }
            st = st + dur*fs;
        }
        this.penUp(args,util);
    }

    drawStaff(args, util) {
        startX = this.staffStartX;
        endX = this.staffStartX+this.staffLength;
        y = this.staffStartY;
        yStep = this.staffWidth;
        for (var j = 0; j < 6; j++) {
            for (var i = 0; i < 5; i++) {
                this.penUp(args, util);
                util.target.setXY(startX, y);
                this.penDown(args, util);
                util.target.setXY(endX, y);
                y = y+yStep;
            }
            y = y - this.spaceBetween - yStep*5;
        }
        this.drawTreble(args, util);
    }

    drawSymbol(symbol, args, util, xStart, yStart) {
        symbolX = 0;
        symbolY = 0;
        this.penUp(args, util);
        for (var i in symbol) {
            coord = symbol[i];
            symbolX = coord[0]/2 + xStart;
            symbolY = -coord[1]/2 + yStart;
            util.target.setXY(symbolX, symbolY);
            this.penDown(args, util);  
        }
        this.penUp(args, util);
    }

    drawTreble(args, util) {
        xstart = this.staffStartX+10;
        ystart = this.staffStartY-12;
        treble = symbols.treble;
        this.penUp(args, util);
        for (var i in treble) {
            coord = treble[i];
            x = coord[0]/5 + xstart;
            y = -coord[1]/5 + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);     
        }
        this.penUp(args, util);
        for (var i in treble) {
            coord = treble[i];
            x = coord[0]/5 + xstart+1;
            y = -coord[1]/5 + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);     
        }
        this.penUp(args, util);
    }

    drawMusic(args, util) {
        xinit = this.staffStartX+20;
        x = xinit;
        y = this.staffStartY;
        xStep = 40;
        signal = this.convertSignalToMusicList(args, util);
        pastVol = 0;
        //volume = this.findCrescDecresc();
        for (i in signal) {
            note = signal[i][0];
            duration = signal[i][1];
            volume = signal[i][2];
            if (note <= 4) {
                up = true;
            } else {
                up = false;
            }
            x = x+xStep;
            if (x > this.staffStartX + this.staffLength) {
                x = xinit;
                y = y - this.spaceBetween;
            }
            ymid = y+note*this.staffWidth/2;
            xmid = x - 8;
            this.drawNote(xmid, ymid, duration, up, args, util);
            if ((volume!=pastVol)) {
                newX = xmid;
                newY = y-this.spaceBetween/4;
                log.log("VOLUME", volume);
                sym = this.symbols[volume];
                log.log(sym);
                initial = 0;
                for (i in sym) {
                    log.log(i);
                    s = sym[i];
                    this.drawSymbol(s, args, util, newX+initial, newY);
                    initial += 10;
                }
            }
            pastVol = volume;
        }
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

    drawNote(xmid, ymid, duration, up, args, util) {
        xrad = 8;
        yrad = 4;
        if (up) {
            flip = 1;
        } else {
            flip = -1;
        }
        step = Math.PI/100;
        if (duration <= 1){ //draw solid note for sixteenth, eighth, and quarter notes
            for (var theta = 0; theta < 2*Math.PI; theta +=step) {
                this.penUp(args, util);
                util.target.setXY(xmid, ymid);
                var x = xmid + xrad*Math.cos(theta);
                var y = ymid - yrad*Math.sin(theta);
                this.penDown(args, util);
                util.target.setXY(x, y);
            }
        } else { //draw hollow note for half, dotted half, and whole notes
            x = xmid + xrad;
            y = ymid;
            for (var theta = 0; theta < 2*Math.PI; theta +=step) {
                this.penUp(args, util);
                util.target.setXY(x, y);
                x = xmid + xrad*Math.cos(theta);
                y = ymid - yrad*Math.sin(theta);
                this.penDown(args, util);
                util.target.setXY(x, y);
            }
            x = xmid + xrad - 1;
            y = ymid;
            for (var theta = 0; theta < 2*Math.PI; theta +=step) {
                this.penUp(args, util);
                util.target.setXY(x, y);
                x = xmid + (xrad-1)*Math.cos(theta);
                y = ymid - (yrad-1)*Math.sin(theta);
                this.penDown(args, util);
                util.target.setXY(x, y);
            }
        }
        if (duration == 3) { //add dot for dotted half note
            dotrad = 2;
            for (var theta = 0; theta < 2*Math.PI; theta +=step) {
                this.penUp(args, util);
                util.target.setXY(xmid+12, ymid);
                var x = xmid + 12 + dotrad*Math.cos(theta);
                var y = ymid - dotrad*Math.sin(theta);
                this.penDown(args, util);
                util.target.setXY(x, y);
            }
        }
        if (duration != 4) { //add stem for non-whole notes
            this.penUp(args, util);
            util.target.setXY(xmid+flip*xrad, ymid);
            this.penDown(args, util);
            util.target.setXY(xmid+flip*xrad, ymid+flip*30);
        }
        if (duration < 1) { //add tails for < quarter notes
            offset = 0;
            for (var i = 0; i < 1/(duration*2); i++) {
                this.penUp(args, util);
                util.target.setXY(xmid+flip*xrad, ymid+flip*(30+offset*6));
                this.penDown(args, util);
                util.target.setXY(xmid+flip*xrad+2, ymid + flip*(30 + offset*6 - 8));
                util.target.setXY(xmid+flip*xrad+10, ymid + flip*(30 + offset*6 - 12));
                this.penUp(args, util);
                util.target.setXY(xmid+flip*xrad, ymid+flip*(30+offset*6+2));
                this.penDown(args, util);
                util.target.setXY(xmid+flip*xrad+2, ymid + flip*(30 + offset*6 - 8+1));
                util.target.setXY(xmid+flip*xrad+10, ymid + flip*(30 + offset*6 - 12+1));
                offset += 1;
                this.penUp(args, util);
            }
        }
    }

    convertSignalToMusicList (args, util) {
        signal = [];
        for (var i in this.noteList) {
            freq = this.noteList[i][0];
            staff = pitchToStaff[freq];
            dur = this.noteList[i][1]*4;
            amp = this.noteList[i][3];
            signal.push([staff, dur, amp]);
        }
        return signal;
    }

    penUp (args, util) {
        const penState = this._getPenState(util.target);
        if (penState.penDown) {
            penState.penDown = false;
            util.target.removeListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
        }
    }

    penDown (args, util, penSkinId) {
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
    setPenColorToColor (newColor, util) {
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
    _updatePenColor (penState) {
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
    _transparencyToAlpha (transparency) {
        return 1.0 - (transparency / 100.0);
    }

    /**
     * The pen "clear" block clears the pen layer's contents.
     */
    clear () {
        penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penClear(penSkinId);
            this.runtime.requestRedraw();
        }
    }

}

module.exports = VizHelpers;