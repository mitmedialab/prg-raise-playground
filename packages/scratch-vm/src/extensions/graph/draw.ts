import Clone = require('../../util/clone');
import Cast = require('../../util/cast');
import Color = require('../../util/color');
import RenderedTarget = require('../../sprites/rendered-target');
import StageLayering = require('../../engine/stage-layering');
import letters = require('./letters');

export class Draw {
    private runtime;
    private _penSkinId;
    private _penDrawableId;
    private black;
    private white;
    private axisStartX;
    private axisStartY;
    private xAxisLength;
    private yAxisLength;
    private letters;
    private spacing;
    static readonly VIZ_STATE_KEY = 'Scratch.musicviz';
    static readonly DEFAULT_PEN_STATE = {
        penDown: false,
        color: 66.66,
        saturation: 100,
        brightness: 100,
        transparency: 0,
        _shade: 50, // Used only for legacy `change shade by` blocks
        penAttributes: {
            color4f: [0, 0, 1, 1],
            diameter: 1.1
        }
    };
    static readonly PEN_SIZE_RANGE = {min: 1, max: 1200};

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
        this.white = '0xffffff';


        this.axisStartX = -200;
        this.axisStartY = -150;
        this.xAxisLength = 400;
        this.yAxisLength = 300;


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
            'k': letters.k,
            'l': letters.l,
            'm': letters.m,
            'n': letters.n,
            'o': letters.o,
            'circle': letters.circle,
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
            '0': letters.zero
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
            '0': 55.09218203033856
        }

    }

    // /**
    //  * The key to load & store a target's music-related state.
    //  * @type {string}
    //  */
    // static get VIZ_STATE_KEY () {
    //     return 'Scratch.musicviz';
    // }

    // static get DEFAULT_PEN_STATE () {
    //     return {
    //         penDown: false,
    //         color: 66.66,
    //         saturation: 100,
    //         brightness: 100,
    //         transparency: 0,
    //         _shade: 50, // Used only for legacy `change shade by` blocks
    //         penAttributes: {
    //             color4f: [0, 0, 1, 1],
    //             diameter: 1.1
    //         }
    //     };
    // }

    // /**
    //  * The minimum and maximum allowed pen size.
    //  * The maximum is twice the diagonal of the stage, so that even an
    //  * off-stage sprite can fill it.
    //  * @type {{min: number, max: number}}
    //  */
    // static get PEN_SIZE_RANGE () {
    //     return {min: 1, max: 1200};
    // }

        /**
     * When a music-playing Target is cloned, clone the music state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated (newTarget, sourceTarget) {
        if (sourceTarget) {
            const penState = sourceTarget.getCustomState(Draw.VIZ_STATE_KEY);
            if (penState) {
                newTarget.setCustomState(Draw.VIZ_STATE_KEY, Clone.simple(penState));
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

    // _getWavePenLayerID () {
    //     if (this.wavePen < 0 && this.runtime.renderer) {
    //         this.wavePen = this.runtime.renderer.createPenSkin();
    //         this.wavePenDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
    //         this.runtime.renderer.updateDrawableProperties(this.wavePenDrawableId, {skinId: this.wavePen});
    //     }
    //     return this.wavePen;
    // }

    _getPenState (target) {
        let penState = target.getCustomState(Draw.VIZ_STATE_KEY);
        if (!penState) {
            penState = Clone.simple(Draw.DEFAULT_PEN_STATE);
            target.setCustomState(Draw.VIZ_STATE_KEY, penState);
        }
        return penState;
    }


    testWaveformViz (noteList, args, util) {
        this.setPenColorToColor(this.black, util);
        // this.noteList = noteList;
        this.clear();
        // this.drawAxes(args, util);
        // this.drawSignal(args, util);
        // this.drawLegend(args, util);
        this.labelAxes(args, util);
    }

    /**
     * get a vector from (x0,y0) to (x1,y1) of length r
     * @param {} param0 
     * @param {*} param1 
     * @param {*} r 
     */
    scaledVector([x0,y0],[x1,y1], r) {
        const dy = y1 - y0;
        const dx = x1 - x0;
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        return [(dx/magnitude)*r,(dy/magnitude)*r];
    }

    labelAxes (args, util) {
        // this.drawString('time', this.axisStartX + this.xAxisLength-40, this.axisStartY+this.yAxisLength/2-5, 0.8, args, util);
        let sx = -200;
        let sy = -150;
        // for (let i = 0; i < 10; i++) {
        //     const [a,b] = this.drawLetter('o', sx+25*i,sy+25*i, 3, args, util);
        //     this.drawLetter(String.fromCharCode(97+i), a, b, .5, args, util);
        // }

        // let coords = [[-201,-142],[-132,-106],[-153,-37],[-84,-79],[-20,-129],[23,-80],[76,-126],[100,-68],[84,-38],[51,2],[11,31],[-50,50],[-37,105],[100,90],[140,114],[178,60],[187,-60],[-62,107],[-144,115],[-206,145]]
        // let coords = [[-201,-132],[-132,-106],[-153,-37],[-84,-79],[-20,-129],[23,-80],[76,-126],[85,-80],[84,-38],[51,2],[-11,-31],[-50,50],[-2,105],[100,90],[140,114],[178,60],[187,-60],[-62,107],[-144,115],[-206,145]];
        // let coords = [[51,2],[-11,-31],[-50,50],[-2,105],[100,90],[140,114],[178,60],[187,-60],[-62,107],[-144,115],[-206,145],[-201,-132],[-132,-106],[-153,-37],[-84,-79],[-20,-129],[23,-80],[76,-126],[85,-80],[84,-38]];
        // let coords = [[51,2],[-11,-31],[-50,50],[-2,105],[100,90],[140,114],[178,60],[187,-60],[-194,-66],[-144,115],[-206,145],[-201,-132],[-132,-106],[-90,0],[-84,-50],[-20,-129],[23,-80],[76,-126],[115,-80],[160,-19]];
        let coords = [[81,-8],[-11,-31],[-50,50],[-2,105],[100,60],[112,143],[178,60],[-183,27],[-194,-66],[-144,115],[-206,145],[-201,-132],[-132,-106],[-46,140],[-110,-30],[-20,-129],[23,-80],[76,-126],[189,-36],[117,-76]];
                        //0     1           2       3       4           5       6       7           8       9           10          11          12         13       14         15       16      17          18       19
        let foci = [];
        let i = 0;
        coords.forEach(([x,y]) => {
            // if (i >= 2) return;
            // const [a,b] = this.drawLetter('o', x,y, 3, args, util);
            const [a2,b2] = this.drawLetter('circle', x,y, 3, args, util);
            foci.push([a2,b2]);
            this.drawString(Cast.toString(i), a2-7, b2, .5, args, util);
            i++;
        })

        const [x0,y0] = [foci[0][0], foci[0][1]];
        const [x1,y1] = [foci[1][0], foci[1][1]];
        const [x_n1,y_n1] = this.scaledVector([x0,y0],[x1,y1],23.868);
        const [x_n2,y_n2] = this.scaledVector([x1,y1],[x0,y0],23.868);


        util.target.setXY(x_n1+x0, y_n1+y0);
        this.penDown(args, util);    
        util.target.setXY(x_n2+x1, y_n2+y1);
        this.penUp(args, util);
        console.log(foci);
        //y0-y1 / x0-x1
        console.log([(foci[0][1]-foci[1][1]),(foci[0][0]-foci[1][0])]);
        console.log(Math.atan2((foci[0][1]-foci[1][1]),(foci[0][0]-foci[1][0])))

        const new_coords = ([x0,y0],[x1,y1]) => {
            const dx = x0-x1;
            const dy = y0-y1;
            const clamped_angle = Math.abs(Math.atan2(dy,dx)) % 2;
            const get_len = (radians) => { return 7*radians + 23; };
            const radius = get_len(clamped_angle);
            const x_new = radius * Math.cos(clamped_angle);
            const y_new = radius * Math.sin(clamped_angle);
            return [Math.floor(x_new+x0),Math.floor(y_new+y0)];
        }

        console.log(new_coords([foci[0][0],foci[0][1]],[foci[1][0],foci[1][1]]));
        console.log(new_coords([foci[1][0],foci[1][1]],[foci[0][0],foci[0][1]]));




        

        // for ([x,y] in coords) {
        //     console.log(x,y);
        //     // const [a,b] = this.drawLetter('o', x,y, 3, args, util);
        //     // this.drawString(Cast.toString(i), a, b, .5, args, util);
        // }
        

        // this.drawString('DOLEV', this.axisStartX-30, this.axisStartY+this.yAxisLength + 20, 3, args, util);

        // this.drawString('waveform', this.axisStartX + this.xAxisLength/2 -70, this.axisStartY+this.yAxisLength + 20, 1, args, util);
    }


    drawString (str, xstart, ystart, size, args, util) {
        console.log('yo');
        console.log(str);
        for (var i in str) {
            xstart += 5*size;
            if (Cast.toNumber(i) >= 1) {
                xstart += this.spacing[str[Cast.toNumber(i)-1]]/5*size;
            }
            this.drawLetter(str[i], xstart, ystart, size, args, util);
        }
            //change
    }     

    drawLetter(letter, xstart, ystart, size, args, util) {
        console.log('dolev', xstart,ystart);
        console.log('letters',this.letters);
        letter = this.letters[letter];
        let xs = [];
        let ys = [];
        this.penUp(args, util);
        console.log('letter',letter);
        for (var i in letter) {
            let coord = letter[i];
            let x = coord[0]/5*size + xstart;
            xs.push(x);
            let y = -coord[1]/5*size + ystart;
            ys.push(y);
            // console.log([x,y]);
            util.target.setXY(x, y);
            this.penDown(args, util);     
        }


        this.penUp(args, util);
        for (var i in letter) {
            let coord = letter[i];
            let x = coord[0]/5*size + xstart+1;
            let y = -coord[1]/5*size + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);     
        }
        this.penUp(args, util);

        let xmin = Math.min(...xs);
        let ymin = Math.min(...ys);
        let xmax = Math.max(...xs);
        let ymax = Math.max(...ys);
        console.log(xs,ys,'dddddd');
        console.log('rad',ymax-ymin,xmax-xmin);
        // console.log([(xmax+xmin)/2, (ymin+ymax)/2]);
        return [(xmax+xmin)/2, (ymin+ymax)/2];

    }
    // util.target.setXY(this.axisStartX, this.axisStartY + this.yAxisLength);


    // colors = ['0xff0000', '0x0000ff', '0x00ff00', '0xffa500'];
    

    penUp (args, util) {
        const penState = this._getPenState(util.target);
        if (penState.penDown) {
            penState.penDown = false;
            util.target.removeListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
        }
    }

    penDown (args, util, penSkinId?) {
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
        let penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penClear(penSkinId);
            this.runtime.requestRedraw();
        }
    }

}

// module.exports = Draw;