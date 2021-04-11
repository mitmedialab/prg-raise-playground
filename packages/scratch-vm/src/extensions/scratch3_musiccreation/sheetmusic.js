const Clone = require('../../util/clone');
const log = require('../../util/log');
const Cast = require('../../util/cast');
const Color = require('../../util/color');
const RenderedTarget = require('../../sprites/rendered-target');
const StageLayering = require('../../engine/stage-layering');

const symbols = require('./symbols');
const { updateVariableIdentifiers } = require('../../util/variable-util');

class SheetMusic {
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
        this.spaceBetweenStaffs = 5*12;

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
            76: 7
        }  


        pitchToStaffBass = {
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
            const penState = sourceTarget.getCustomState(SheetMusic.VIZ_STATE_KEY);
            if (penState) {
                newTarget.setCustomState(SheetMusic.VIZ_STATE_KEY, Clone.simple(penState));
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

    _getPenState (target) {
        let penState = target.getCustomState(SheetMusic.VIZ_STATE_KEY);
        if (!penState) {
            penState = Clone.simple(SheetMusic.DEFAULT_PEN_STATE);
            target.setCustomState(SheetMusic.VIZ_STATE_KEY, penState);
        }
        return penState;
    }

    testSheetMusicViz (noteList, args, util) {
        this.setPenColorToColor(this.black, util);
        this.noteList = noteList;
        this.clear();
        this.drawStaff(args, util);
        this.drawMusic(args, util);
    }

    drawStaff(args, util) {
        startX = this.staffStartX;
        endX = this.staffStartX+this.staffLength;
        var y = this.staffStartY;
        yStep = this.staffWidth;
        for (var j = 0; j < 2; j++) {
            for (var i = 0; i < 5; i++) {
                this.penUp(args, util);
                util.target.setXY(startX, y);
                this.penDown(args, util);
                util.target.setXY(endX, y);
                y = y+yStep;
            }
            y = y - this.spaceBetween - yStep*5;
            for (var i = 0; i < 5; i++) {
                this.penUp(args, util);
                util.target.setXY(startX, y);
                this.penDown(args, util);
                util.target.setXY(endX, y);
                y = y+yStep;
            }
            y = y - this.spaceBetween - this.spaceBetweenStaffs;
            this.drawTreble(this.staffStartX+10, this.staffStartY-12 -j*(this.spaceBetween+yStep*5+this.spaceBetweenStaffs-12), args, util);
            
        }
        //this.drawBass(args, util);
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

    drawTreble(xstart, ystart, args, util) {
        //xstart = this.staffStartX+10;
        //ystart = this.staffStartY-12;
        treble = symbols.treble;
        this.penUp(args, util);
        for (var i in treble) {
            coord = treble[i];
            var x = coord[0]/5 + xstart;
            var y = -coord[1]/5 + ystart;
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
                x = xinit+xStep;
                y = y - this.spaceBetween-11*this.staffWidth;
            }
            if (signal[i][3] == 'treble') {
                ymid = y+note*this.staffWidth/2;
                xmid = x - 8;
            } else {
                xmid = x - 8;
                ymid = y+note*this.staffWidth/2 - this.spaceBetween;
            }

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
                    initial += this.spacing[volume][i];
                }
            }
            pastVol = volume;
        }
        this.penUp(args, util);
        
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
            log.log("FREQ", freq);
            if (freq >= 60) {
                staff = pitchToStaff[freq];
                log.log("STAFF", staff);
                dur = this.noteList[i][1]*4;
                amp = this.noteList[i][3];
                signal.push([staff, dur, amp, "treble"]);
            } else {
                staff = pitchToStaffBass[freq];
                log.log("STAFF", staff);
                dur = this.noteList[i][1]*4;
                amp = this.noteList[i][3];
                signal.push([staff, dur, amp, "bass"]);
            }

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

module.exports = SheetMusic;