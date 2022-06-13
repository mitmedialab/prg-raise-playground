const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const Color = require('../../util/color');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const RenderedTarget = require('../../sprites/rendered-target');
const log = require('../../util/log');
const StageLayering = require('../../engine/stage-layering');


/**
 * Enum for pen color parameter values.
 * @readonly
 * @enum {string}
 */
const ColorParam = {
    COLOR: 'color',
    SATURATION: 'saturation',
    BRIGHTNESS: 'brightness',
    TRANSPARENCY: 'transparency'
};

/**
 * @typedef {object} PenState - the pen state associated with a particular target.
 * @property {Boolean} penDown - tracks whether the pen should draw for this target.
 * @property {number} color - the current color (hue) of the pen.
 * @property {PenAttributes} penAttributes - cached pen attributes for the renderer. This is the authoritative value for
 *   diameter but not for pen color.
 */

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3SignalViz {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * The ID of the renderer Drawable corresponding to the pen layer.
         * @type {int}
         * @private
         */
        this._penDrawableId = -1;

        /**
         * The ID of the renderer Skin corresponding to the pen layer.
         * @type {int}
         * @private
         */
        this._penSkinId = -1;

        this._onTargetCreated = this._onTargetCreated.bind(this);
        this._onTargetMoved = this._onTargetMoved.bind(this);

        runtime.on('targetWasCreated', this._onTargetCreated);
        runtime.on('RUNTIME_DISPOSED', this.clear.bind(this));

        this.axisStartX = -200;
        this.axisStartY = -75;
        this.xAxisLength = 400;
        this.yAxisLength = 200;
        this.staffLength = 400;
        this.staffStartX = -200;
        this.staffStartY = -130;
        this.staffWidth = 8;

    }

    /**
     * The default pen state, to be used when a target has no existing pen state.
     * @type {PenState}
     */
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
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.signalviz';
    }

    /**
     * Clamp a pen size value to the range allowed by the pen.
     * @param {number} requestedSize - the requested pen size.
     * @returns {number} the clamped size.
     * @private
     */
    _clampPenSize (requestedSize) {
        return MathUtil.clamp(
            requestedSize,
            Scratch3SignalViz.PEN_SIZE_RANGE.min,
            Scratch3SignalViz.PEN_SIZE_RANGE.max
        );
    }

    /**
     * Retrieve the ID of the renderer "Skin" corresponding to the pen layer. If
     * the pen Skin doesn't yet exist, create it.
     * @returns {int} the Skin ID of the pen layer, or -1 on failure.
     * @private
     */
    _getPenLayerID () {
        if (this._penSkinId < 0 && this.runtime.renderer) {
            this._penSkinId = this.runtime.renderer.createPenSkin();
            this._penDrawableId = this.runtime.renderer.createDrawable(StageLayering.PEN_LAYER);
            this.runtime.renderer.updateDrawableProperties(this._penDrawableId, {skinId: this._penSkinId});
        }
        return this._penSkinId;
    }

    /**
     * @param {Target} target - collect pen state for this target. Probably, but not necessarily, a RenderedTarget.
     * @returns {PenState} the mutable pen state associated with that target. This will be created if necessary.
     * @private
     */
    _getPenState (target) {
        let penState = target.getCustomState(Scratch3SignalViz.STATE_KEY);
        if (!penState) {
            penState = Clone.simple(Scratch3SignalViz.DEFAULT_PEN_STATE);
            target.setCustomState(Scratch3SignalViz.STATE_KEY, penState);
        }
        return penState;
    }

    /**
     * When a pen-using Target is cloned, clone the pen state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated (newTarget, sourceTarget) {
        if (sourceTarget) {
            const penState = sourceTarget.getCustomState(Scratch3SignalViz.STATE_KEY);
            if (penState) {
                newTarget.setCustomState(Scratch3SignalViz.STATE_KEY, Clone.simple(penState));
                if (penState.penDown) {
                    newTarget.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
                }
            }
        }
    }

    /**
     * Handle a target which has moved. This only fires when the pen is down.
     * @param {RenderedTarget} target - the target which has moved.
     * @param {number} oldX - the previous X position.
     * @param {number} oldY - the previous Y position.
     * @param {boolean} isForce - whether the movement was forced.
     * @private
     */
    _onTargetMoved (target, oldX, oldY, isForce) {
        // Only move the pen if the movement isn't forced (ie. dragged).
        if (!isForce) {
            log.log(target);
            const penSkinId = this._getPenLayerID();
            if (penSkinId >= 0) {
                const penState = this._getPenState(target);
                this.runtime.renderer.penLine(penSkinId, penState.penAttributes, oldX, oldY, target.x, target.y);
                this.runtime.requestRedraw();
            }
        }
    }

    /**
     * Wrap a color input into the range (0,100).
     * @param {number} value - the value to be wrapped.
     * @returns {number} the wrapped value.
     * @private
     */
    _wrapColor (value) {
        return MathUtil.wrapClamp(value, 0, 100);
    }

    /**
     * Initialize color parameters menu with localized strings
     * @returns {array} of the localized text and values for each menu element
     * @private
     */
    _initColorParam () {
        return [
            {
                text: formatMessage({
                    id: 'signalviz.colorMenu.color',
                    default: 'color',
                    description: 'label for color element in color picker for pen extension'
                }),
                value: ColorParam.COLOR
            },
            {
                text: formatMessage({
                    id: 'signalviz.colorMenu.saturation',
                    default: 'saturation',
                    description: 'label for saturation element in color picker for pen extension'
                }),
                value: ColorParam.SATURATION
            },
            {
                text: formatMessage({
                    id: 'signalviz.colorMenu.brightness',
                    default: 'brightness',
                    description: 'label for brightness element in color picker for pen extension'
                }),
                value: ColorParam.BRIGHTNESS
            },
            {
                text: formatMessage({
                    id: 'signalviz.colorMenu.transparency',
                    default: 'transparency',
                    description: 'label for transparency element in color picker for pen extension'
                }),
                value: ColorParam.TRANSPARENCY

            }
        ];
    }

    /**
     * Clamp a pen color parameter to the range (0,100).
     * @param {number} value - the value to be clamped.
     * @returns {number} the clamped value.
     * @private
     */
    _clampColorParam (value) {
        return MathUtil.clamp(value, 0, 100);
    }

    /**
     * Convert an alpha value to a pen transparency value.
     * Alpha ranges from 0 to 1, where 0 is transparent and 1 is opaque.
     * Transparency ranges from 0 to 100, where 0 is opaque and 100 is transparent.
     * @param {number} alpha - the input alpha value.
     * @returns {number} the transparency value.
     * @private
     */
    _alphaToTransparency (alpha) {
        return (1.0 - alpha) * 100.0;
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
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'signalviz',
            name: 'Signal Visualization',
            blocks: [
                {
                    opcode: 'testWaveform',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.testwaveform',
                        default: 'test waveform viz',
                        description: 'test signal'
                    })
                },
                {
                    opcode: 'testSheetMusic',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.testsheet music',
                        default: 'test sheet music viz',
                        description: 'test signal'
                    })
                },
                {
                    opcode: 'clear',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.clear',
                        default: 'erase all',
                        description: 'erase all pen trails and stamps'
                    })
                },
                {
                    opcode: 'stamp',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.stamp',
                        default: 'stamp',
                        description: 'render current costume on the background'
                    })
                },
                {
                    opcode: 'penDown',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.penDown',
                        default: 'pen down',
                        description: 'start leaving a trail when the sprite moves'
                    })
                },
                {
                    opcode: 'penUp',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.penUp',
                        default: 'pen up',
                        description: 'stop leaving a trail behind the sprite'
                    })
                },
                {
                    opcode: 'setPenColorToColor',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.setColor',
                        default: 'set pen color to [COLOR]',
                        description: 'set the pen color to a particular (RGB) value'
                    }),
                    arguments: {
                        COLOR: {
                            type: ArgumentType.COLOR
                        }
                    }
                },
                {
                    opcode: 'changePenColorParamBy',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.changeColorParam',
                        default: 'change pen [COLOR_PARAM] by [VALUE]',
                        description: 'change the state of a pen color parameter'
                    }),
                    arguments: {
                        COLOR_PARAM: {
                            type: ArgumentType.STRING,
                            menu: 'colorParam',
                            defaultValue: ColorParam.COLOR
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'setPenColorParamTo',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.setColorParam',
                        default: 'set pen [COLOR_PARAM] to [VALUE]',
                        description: 'set the state for a pen color parameter e.g. saturation'
                    }),
                    arguments: {
                        COLOR_PARAM: {
                            type: ArgumentType.STRING,
                            menu: 'colorParam',
                            defaultValue: ColorParam.COLOR
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'changePenSizeBy',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.changeSize',
                        default: 'change pen size by [SIZE]',
                        description: 'change the diameter of the trail left by a sprite'
                    }),
                    arguments: {
                        SIZE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'setPenSizeTo',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.setSize',
                        default: 'set pen size to [SIZE]',
                        description: 'set the diameter of a trail left by a sprite'
                    }),
                    arguments: {
                        SIZE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                /* Legacy blocks, should not be shown in flyout */
                {
                    opcode: 'setPenShadeToNumber',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.setShade',
                        default: 'set pen shade to [SHADE]',
                        description: 'legacy pen blocks - set pen shade'
                    }),
                    arguments: {
                        SHADE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    hideFromPalette: true
                },
                {
                    opcode: 'changePenShadeBy',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.changeShade',
                        default: 'change pen shade by [SHADE]',
                        description: 'legacy pen blocks - change pen shade'
                    }),
                    arguments: {
                        SHADE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    hideFromPalette: true
                },
                {
                    opcode: 'setPenHueToNumber',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.setHue',
                        default: 'set pen color to [HUE]',
                        description: 'legacy pen blocks - set pen color to number'
                    }),
                    arguments: {
                        HUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    hideFromPalette: true
                },
                {
                    opcode: 'changePenHueBy',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'signalviz.changeHue',
                        default: 'change pen color by [HUE]',
                        description: 'legacy pen blocks - change pen color'
                    }),
                    arguments: {
                        HUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    },
                    hideFromPalette: true
                }
            ],
            menus: {
                colorParam: {
                    acceptReporters: true,
                    items: this._initColorParam()
                }
            }
        };
    }

    testWaveform (args, util) {
        this.clear();
        this.drawAxes(args, util);
        this.drawSignal(args, util);
    }

    testSheetMusic (args, util) {
        this.clear();
        this.drawStaff(args, util);
        this.drawMusic(args, util);
    }

    drawAxes(args, util) {
        util.target.setXY(this.axisStartX, this.axisStartY + this.yAxisLength);
        this.penDown(args, util);
        util.target.setXY(this.axisStartX, this.axisStartY);
        util.target.setXY(this.axisStartX+this.xAxisLength, this.axisStartY);
        this.penUp(args, util);
    }

    drawSignal(args, util) {
        x = this.axisStartX;
        y = this.axisStartY;
        signal = [1, 2,3, 4, 5, 6, 1, 2,3, 4, 5, 6, 1, 2,3, 4, 5, 6, 1, 2,3, 4, 5, 6, 1, 2,3, 4, 5, 6];
        log.log(signal);
        xStep = Math.floor(this.xAxisLength/(signal.length-1));
        heightScaling = Math.round(this.yAxisLength/Math.max(...signal));
        for (i in signal) {
            val = signal[i];
            this.penUp(args, util)
            util.target.setXY(x, y);
            this.penDown(args, util);
            util.target.setXY(x, y+val*heightScaling);
            x = x+xStep;
        }
        this.penUp(args, util);
    }

    drawStaff(args, util) {
        var i;
        startX = this.staffStartX;
        endX = this.staffStartX+this.staffLength;
        y = this.staffStartY;
        yStep = this.staffWidth;
        for (i = 0; i < 5; i++) {
            log.log(i);
            this.penUp(args, util);
            util.target.setXY(startX, y);
            this.penDown(args, util);
            util.target.setXY(endX, y);
            y = y+yStep;
        }
        this.drawTreble(args, util);
    }

    drawTreble(args, util) {
        xstart = -200;
        ystart = -80;
        treble = [[61.70984455958549, 316.77720207253884], [63.76683937823834, 321.919689119171], [67.88082901554404, 328.09067357512953], [76.10880829015544, 332.2046632124352], [83.30829015544042, 334.2616580310881], [93.59326424870466, 334.2616580310881], [102.84974093264249, 331.1761658031088], [111.07772020725389, 326.03367875647666], [113.13471502590673, 315.74870466321244], [116.220207253886, 304.43523316062175], [116.220207253886, 299.2927461139896], [116.220207253886, 291.06476683937825], [75.08031088082902, 69.93782383419689], [75.08031088082902, 65.82383419689118], [75.08031088082902, 56.567357512953365], [75.08031088082902, 47.310880829015545], [78.16580310880829, 39.082901554404145], [82.27979274611398, 31.88341968911917], [86.39378238341969, 25.712435233160623], [90.50777202072538, 18.512953367875646], [98.73575129533678, 15.427461139896373], [103.87823834196891, 19.541450777202073], [111.07772020725389, 26.740932642487046], [113.13471502590673, 37.02590673575129], [114.16321243523316, 48.339378238341965], [114.16321243523316, 59.65284974093264], [111.07772020725389, 69.93782383419689], [106.96373056994818, 81.25129533678756], [99.76424870466322, 89.47927461139896], [92.56476683937824, 99.76424870466322], [49.36787564766839, 143.9896373056995], [40.11139896373057, 154.2746113989637], [34.968911917098445, 168.67357512953367], [30.854922279792746, 187.1865284974093], [30.854922279792746, 199.52849740932643], [31.88341968911917, 211.87046632124353], [37.02590673575129, 222.15544041450778], [43.196891191709845, 231.4119170984456], [47.310880829015545, 237.58290155440415], [57.59585492227979, 244.78238341968913], [69.93782383419689, 253.0103626943005], [84.33678756476684, 255.06735751295335], [95.65025906735751, 256.0958549222798], [110.04922279792746, 254.03886010362694], [120.33419689119171, 245.81088082901553], [129.59067357512953, 235.52590673575128], [133.70466321243524, 219.0699481865285], [132.6761658031088, 208.78497409326425], [130.61917098445596, 201.58549222797927], [123.41968911917098, 193.35751295336786], [116.220207253886, 187.1865284974093], [102.84974093264249, 185.12953367875647], [91.53626943005182, 185.12953367875647], [80.22279792746114, 191.30051813471502], [75.08031088082902, 203.6424870466321], [74.05181347150258, 213.92746113989637], [77.13730569948186, 228.32642487046633], [85.36528497409326, 235.52590673575128]];
        //treble = symbols.treble;
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
    }

    drawBass(args, util) {
        xstart = -205;
        ystart = -95;
        bass = [[114.27088036117382, 590.3995485327314], [128.98758465011286, 583.4740406320542], [145.43566591422123, 573.951467268623], [252.78103837471784, 505.5620767494357], [286.5428893905192, 475.2629796839729], [315.9762979683973, 453.62076749435664], [326.3645598194131, 440.6354401805869], [340.2155756207675, 422.4559819413093], [359.2607223476298, 395.6196388261851], [374.8431151241535, 368.78329571106093], [392.1568848758465, 343.6783295711061], [403.41083521444693, 321.1704288939052], [412.9334085778781, 283.9458239277652], [418.99322799097064, 257.97516930022573], [425.0530474040632, 225.07900677200902], [425.0530474040632, 199.97404063205417], [421.5902934537246, 177.46613995485328], [413.7990970654628, 147.16704288939053], [404.2765237020316, 123.79345372460497], [390.4255079006772, 100.41986455981942], [373.97742663656885, 82.24040632054177], [344.54401805869077, 56.269751693002256], [315.9762979683973, 46.747178329571106], [284.8115124153499, 42.418735891647856], [249.31828442437924, 45.88148984198646], [221.61625282167043, 54.53837471783296], [193.04853273137698, 68.38939051918736], [176.6004514672686, 80.50902934537247], [157.5553047404063, 104.74830699774266], [148.03273137697516, 132.45033860045146], [143.70428893905193, 161.88374717832957], [148.03273137697516, 181.79458239277653], [161.01805869074494, 206.8995485327314], [173.13769751693002, 217.28781038374717]];
        this.penUp(args, util);
        for (var i in bass) {
            coord = bass[i];
            x = coord[0]/17 + xstart;
            y = -coord[1]/17 + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);     
        }
        this.penUp(args, util);
        for (var i in bass) {
            coord = bass[i];
            x = coord[0]/17 + xstart+1;
            y = -coord[1]/17 + ystart;
            util.target.setXY(x, y);
            this.penDown(args, util);     
        }
        r = 2;
        xmid = -172;
        ymid = -102;
        ymid2 = -110;
        step = Math.PI/100;
        for (var theta = 0; theta < 2*Math.PI; theta +=step) {
            this.penUp(args, util);
            util.target.setXY(xmid, ymid);
            var x = xmid + r*Math.cos(theta);
            var y = ymid - r*Math.sin(theta);
            var y2 = ymid2 - r*Math.sin(theta);
            this.penDown(args, util);
            util.target.setXY(x, y);
            this.penUp(args, util);
            util.target.setXY(xmid, ymid2);
            this.penDown(args, util);
            util.target.setXY(x, y2);
        }
    }

    drawMusic(args, util) {
        x = -190;
        y = -130;
        xStep = 40;
        signal = [[-1, 1/4], [7, 1/2], [7, 3], [8, 4], [3, 2], [2, 1]]
        for (i in signal) {
            note = signal[i][0];
            duration = signal[i][1];
            if (note <= 4) {
                up = true;
            } else {
                up = false;
            }
            x = x+xStep;
            ymid = y+note*this.staffWidth/2;
            xmid = x - 8;
            this.drawNote(xmid, ymid, duration, up, args, util);

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
            x = xmid + xrad-1;
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

    /**
     * The pen "clear" block clears the pen layer's contents.
     */
    clear () {
        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penClear(penSkinId);
            this.runtime.requestRedraw();
        }
    }

    /**
     * The pen "stamp" block stamps the current drawable's image onto the pen layer.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    stamp (args, util) {
        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            const target = util.target;
            this.runtime.renderer.penStamp(penSkinId, target.drawableID);
            this.runtime.requestRedraw();
        }
    }

    /**
     * The pen "pen down" block causes the target to leave pen trails on future motion.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    penDown (args, util) {
        const target = util.target;
        const penState = this._getPenState(target);

        if (!penState.penDown) {
            penState.penDown = true;
            target.addListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
        }

        const penSkinId = this._getPenLayerID();
        if (penSkinId >= 0) {
            this.runtime.renderer.penPoint(penSkinId, penState.penAttributes, target.x, target.y);
            this.runtime.requestRedraw();
        }
    }

    /**
     * The pen "pen up" block stops the target from leaving pen trails.
     * @param {object} args - the block arguments.
     * @param {object} util - utility object provided by the runtime.
     */
    penUp (args, util) {
        const target = util.target;
        const penState = this._getPenState(target);

        if (penState.penDown) {
            penState.penDown = false;
            target.removeListener(RenderedTarget.EVENT_TARGET_MOVED, this._onTargetMoved);
        }
    }

    /**
     * The pen "set pen color to {color}" block sets the pen to a particular RGB color.
     * The transparency is reset to 0.
     * @param {object} args - the block arguments.
     *  @property {int} COLOR - the color to set, expressed as a 24-bit RGB value (0xRRGGBB).
     * @param {object} util - utility object provided by the runtime.
     */
    setPenColorToColor (args, util) {
        const penState = this._getPenState(util.target);
        const rgb = Cast.toRgbColorObject(args.COLOR);
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
     * Set or change a single color parameter on the pen state, and update the pen color.
     * @param {ColorParam} param - the name of the color parameter to set or change.
     * @param {number} value - the value to set or change the param by.
     * @param {PenState} penState - the pen state to update.
     * @param {boolean} change - if true change param by value, if false set param to value.
     * @private
     */
    _setOrChangeColorParam (param, value, penState, change) {
        switch (param) {
        case ColorParam.COLOR:
            penState.color = this._wrapColor(value + (change ? penState.color : 0));
            break;
        case ColorParam.SATURATION:
            penState.saturation = this._clampColorParam(value + (change ? penState.saturation : 0));
            break;
        case ColorParam.BRIGHTNESS:
            penState.brightness = this._clampColorParam(value + (change ? penState.brightness : 0));
            break;
        case ColorParam.TRANSPARENCY:
            penState.transparency = this._clampColorParam(value + (change ? penState.transparency : 0));
            break;
        default:
            log.warn(`Tried to set or change unknown color parameter: ${param}`);
        }
        this._updatePenColor(penState);
    }

    /**
     * The "change pen {ColorParam} by {number}" block changes one of the pen's color parameters
     * by a given amound.
     * @param {object} args - the block arguments.
     *  @property {ColorParam} COLOR_PARAM - the name of the selected color parameter.
     *  @property {number} VALUE - the amount to change the selected parameter by.
     * @param {object} util - utility object provided by the runtime.
     */
    changePenColorParamBy (args, util) {
        const penState = this._getPenState(util.target);
        this._setOrChangeColorParam(args.COLOR_PARAM, Cast.toNumber(args.VALUE), penState, true);
    }

    /**
     * The "set pen {ColorParam} to {number}" block sets one of the pen's color parameters
     * to a given amound.
     * @param {object} args - the block arguments.
     *  @property {ColorParam} COLOR_PARAM - the name of the selected color parameter.
     *  @property {number} VALUE - the amount to set the selected parameter to.
     * @param {object} util - utility object provided by the runtime.
     */
    setPenColorParamTo (args, util) {
        const penState = this._getPenState(util.target);
        this._setOrChangeColorParam(args.COLOR_PARAM, Cast.toNumber(args.VALUE), penState, false);
    }

    /**
     * The pen "change pen size by {number}" block changes the pen size by the given amount.
     * @param {object} args - the block arguments.
     *  @property {number} SIZE - the amount of desired size change.
     * @param {object} util - utility object provided by the runtime.
     */
    changePenSizeBy (args, util) {
        const penAttributes = this._getPenState(util.target).penAttributes;
        penAttributes.diameter = this._clampPenSize(penAttributes.diameter + Cast.toNumber(args.SIZE));
    }

    /**
     * The pen "set pen size to {number}" block sets the pen size to the given amount.
     * @param {object} args - the block arguments.
     *  @property {number} SIZE - the amount of desired size change.
     * @param {object} util - utility object provided by the runtime.
     */
    setPenSizeTo (args, util) {
        const penAttributes = this._getPenState(util.target).penAttributes;
        penAttributes.diameter = this._clampPenSize(Cast.toNumber(args.SIZE));
    }

    /* LEGACY OPCODES */
    /**
     * Scratch 2 "hue" param is equivelant to twice the new "color" param.
     * @param {object} args - the block arguments.
     *  @property {number} HUE - the amount to set the hue to.
     * @param {object} util - utility object provided by the runtime.
     */
    setPenHueToNumber (args, util) {
        const penState = this._getPenState(util.target);
        const hueValue = Cast.toNumber(args.HUE);
        const colorValue = hueValue / 2;
        this._setOrChangeColorParam(ColorParam.COLOR, colorValue, penState, false);
        this._setOrChangeColorParam(ColorParam.TRANSPARENCY, 0, penState, false);
        this._legacyUpdatePenColor(penState);
    }

    /**
     * Scratch 2 "hue" param is equivelant to twice the new "color" param.
     * @param {object} args - the block arguments.
     *  @property {number} HUE - the amount of desired hue change.
     * @param {object} util - utility object provided by the runtime.
     */
    changePenHueBy (args, util) {
        const penState = this._getPenState(util.target);
        const hueChange = Cast.toNumber(args.HUE);
        const colorChange = hueChange / 2;
        this._setOrChangeColorParam(ColorParam.COLOR, colorChange, penState, true);

        this._legacyUpdatePenColor(penState);
    }

    /**
     * Use legacy "set shade" code to calculate RGB value for shade,
     * then convert back to HSV and store those components.
     * It is important to also track the given shade in penState._shade
     * because it cannot be accurately backed out of the new HSV later.
     * @param {object} args - the block arguments.
     *  @property {number} SHADE - the amount to set the shade to.
     * @param {object} util - utility object provided by the runtime.
     */
    setPenShadeToNumber (args, util) {
        const penState = this._getPenState(util.target);
        let newShade = Cast.toNumber(args.SHADE);

        // Wrap clamp the new shade value the way scratch 2 did.
        newShade = newShade % 200;
        if (newShade < 0) newShade += 200;

        // And store the shade that was used to compute this new color for later use.
        penState._shade = newShade;

        this._legacyUpdatePenColor(penState);
    }

    /**
     * Because "shade" cannot be backed out of hsv consistently, use the previously
     * stored penState._shade to make the shade change.
     * @param {object} args - the block arguments.
     *  @property {number} SHADE - the amount of desired shade change.
     * @param {object} util - utility object provided by the runtime.
     */
    changePenShadeBy (args, util) {
        const penState = this._getPenState(util.target);
        const shadeChange = Cast.toNumber(args.SHADE);
        this.setPenShadeToNumber({SHADE: penState._shade + shadeChange}, util);
    }

    /**
     * Update the pen state's color from its hue & shade values, Scratch 2.0 style.
     * @param {object} penState - update the HSV & RGB values in this pen state from its hue & shade values.
     * @private
     */
    _legacyUpdatePenColor (penState) {
        // Create the new color in RGB using the scratch 2 "shade" model
        let rgb = Color.hsvToRgb({h: penState.color * 360 / 100, s: 1, v: 1});
        const shade = (penState._shade > 100) ? 200 - penState._shade : penState._shade;
        if (shade < 50) {
            rgb = Color.mixRgb(Color.RGB_BLACK, rgb, (10 + shade) / 60);
        } else {
            rgb = Color.mixRgb(rgb, Color.RGB_WHITE, (shade - 50) / 60);
        }

        // Update the pen state according to new color
        const hsv = Color.rgbToHsv(rgb);
        penState.color = 100 * hsv.h / 360;
        penState.saturation = 100 * hsv.s;
        penState.brightness = 100 * hsv.v;

        this._updatePenColor(penState);
    }
}

module.exports = Scratch3SignalViz;
