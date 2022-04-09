require("regenerator-runtime/runtime"); // required to use async/await
require('babel-polyfill');
const Runtime = require('../../engine/runtime');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Video = require('../../io/video');
const formatMessage = require('format-message');
const canvas = require('canvas'); 
const faceapi = require('face-api.js');
const cv = require('@techstark/opencv-js');
const _ = require('lodash'); // allows fast array transformations in javascript
const { times } = require('lodash');
const { Canvas, Image, ImageData } = canvas

/**
 * Sensor attribute video sensor block should report.
 * @readonly
 * @enum {string}
 */
 const SensingAttribute = {
    /** The amount of motion. */
    MOTION: 'motion',

    /** The direction of the motion. */
    DIRECTION: 'direction'
};

/**
 * Subject video sensor block should report for.
 * @readonly
 * @enum {string}
 */
const SensingSubject = {
    /** The sensor traits of the whole stage. */
    STAGE: 'Stage',

    /** The senosr traits of the area overlapped by this sprite. */
    SPRITE: 'this sprite'
};

/**
 * States the video sensing activity can be set to.
 * @readonly
 * @enum {string}
 */
 const VideoState = {
    /** Video turned off. */
    OFF: 'off',

    /** Video turned on with default y axis mirroring. */
    ON: 'on',

    /** Video turned on without default y axis mirroring. */
    ON_FLIPPED: 'on-flipped'
};

/**
 * States the video sensing activity can be set to.
 * @readonly
 * @enum {string}
 */
const CircleDisplayState = {
    /** Circle drawings turned off. */
    OFF: 'off',

    /** Circle drawings turned on. */
    ON: 'on',
};
const CircleAttribute = {
    CENTER_X: 'x position',
    CENTER_Y: 'y position',
    SIZE: 'radius',
    NUM_CIRCLES: 'number of circles'
}

const ShapeDisplayState = {
    /** Shape drawings turned off. */
    OFF: 'off',

    /** Shape drawings turned on. */
    ON: 'on',
};

const ShapeAttribute = {
    CENTER_X: 'x position',
    CENTER_Y: 'y position',
    SIZE: 'area',
    NUM_SHAPES: 'number of shapes'
}

const ColorThresDisplayState = {
    /** Shape drawings turned off. */
    OFF: 'off',

    /** Shape drawings turned on. */
    ON: 'on',
};

const ColorThresAttribute = {
    CENTER_X: 'x position',
    CENTER_Y: 'y position',
    SIZE: 'area',
    NUM_OBJECTS: 'number of objects'
}

const EdgesDisplayState = {
    /** Shape drawings turned off. */
    OFF: 'off',

    /** Shape drawings turned on. */
    ON: 'on',
};

const EdgesAttribute = {
    CENTER_X: 'x position',
    CENTER_Y: 'y position',
    SIZE: 'area',
    NUM_OBJECTS: 'number of objects'
}


class opencv {

    constructor(runtime) {
        this.frame_image = null

        // this.faceaipInit()
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * The last millisecond epoch timestamp that the video stream was
         * analyzed.
         * @type {number}
         */
        this._lastUpdate = null;
        this.KNN_INTERVAL = 1000;
        if (this.runtime.ioDevices) {
            // Clear target motion state values when the project starts.
            this.runtime.on(Runtime.PROJECT_RUN_START, this.reset.bind(this));

            // Kick off looping the analysis logic.
            // this._loop();

            // Configure the video device with values from a globally stored
            // location.
            this.setVideoTransparency({
                TRANSPARENCY: 10
            });
            this.videoToggle({
                VIDEO_STATE: this.globalVideoState
            });
        }

        setInterval(async () => {
            if (this.globalVideoState === VideoState.ON) {
                // console.log('knn result:')
                this.frame_image = this.runtime.ioDevices.video.getFrame({
                    format: Video.FORMAT_IMAGE_DATA,
                    dimensions: opencv.DIMENSIONS
                });

            }
        }, this.KNN_INTERVAL)

        this.circleOverlayCanvas = null
        this.circleDisplayState = CircleDisplayState.ON
        this.circleX = null
        this.circleY = null
        this.circleSize = null
        this.circleNumCircles = null
        // this.circleFlag = true

        this.shapeOverlayCanvas = null
        this.shapeDisplayState = ShapeDisplayState.ON
        this.shapeX = null
        this.shapeY = null
        this.shapeSize = null
        this.shapeNumShapes = null

        this.colorThresOverlayCanvas = null
        this.colorThresDisplayState = ColorThresDisplayState.ON
        this.colorThresX = null
        this.colorThresY = null
        this.colorThresSize = null
        this.colorThresNumObjs = null

        this.edgesOverlayCanvas = null
        this.edgesDisplayState = EdgesDisplayState.ON
        this.edgesX = null
        this.edgesY = null
        this.edgesSize = null
        this.edgesNumObjs = null
    }

     /**
     * After analyzing a frame the amount of milliseconds until another frame
     * is analyzed.
     * @type {number}
     */
    static get INTERVAL() {
        return 33;
    }

    /**
     * Dimensions the video stream is analyzed at after its rendered to the
     * sample canvas.
     * @type {Array.<number>}
     */
    static get DIMENSIONS() {
        return [480, 360];
    }

    /**
     * The key to load & store a target's motion-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return 'Scratch.videoSensing';
    }

    /**
     * The default motion-related state, to be used when a target has no existing motion state.
     * @type {MotionState}
     */
    static get DEFAULT_MOTION_STATE() {
        return {
            motionFrameNumber: 0,
            motionAmount: 0,
            motionDirection: 0
        };
    }

    /**
     * The transparency setting of the video preview stored in a value
     * accessible by any object connected to the virtual machine.
     * @type {number}
     */
    get globalVideoTransparency() {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoTransparency;
        }
        return 50;
    }

    set globalVideoTransparency(transparency) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoTransparency = transparency;
        }
        return transparency;
    }

    /**
     * The video state of the video preview stored in a value accessible by any
     * object connected to the virtual machine.
     * @type {number}
     */
    get globalVideoState() {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoState;
        }
        return VideoState.ON;
    }

    set globalVideoState(state) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoState = state;
        }
        return state;
    }

    /**
     * Reset the extension's data motion detection data. This will clear out
     * for example old frames, so the first analyzed frame will not be compared
     * against a frame from before reset was called.
     */
    reset() {
        const targets = this.runtime.targets;
        for (let i = 0; i < targets.length; i++) {
            const state = targets[i].getCustomState(opencv.STATE_KEY);
            if (state) {
                state.motionAmount = 0;
                state.motionDirection = 0;
            }
        }
    }

    /**
     * Occasionally step a loop to sample the video, stamp it to the preview
     * skin, and add a TypedArray copy of the canvas's pixel data.
     * @private
     */
    _loop() {
        setTimeout(this._loop.bind(this), Math.max(this.runtime.currentStepTime, opencv.INTERVAL));

        // Add frame to detector
        const time = Date.now();
        if (this._lastUpdate === null) {
            this._lastUpdate = time;
        }
        const offset = time - this._lastUpdate;
        if (offset > opencv.INTERVAL) {
            const frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: opencv.DIMENSIONS
            });
            if (frame) {
                this._lastUpdate = time;
            }
        }
    }

    /**
     * Create data for a menu in scratch-blocks format, consisting of an array
     * of objects with text and value properties. The text is a translated
     * string, and the value is one-indexed.
     * @param {object[]} info - An array of info objects each having a name
     *   property.
     * @return {array} - An array of objects with text and value properties.
     * @private
     */
    _buildMenu(info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = entry.value || String(index + 1);
            return obj;
        });
    }

    /**
     * @param {Target} target - collect motion state for this target.
     * @returns {MotionState} the mutable motion state associated with that
     *   target. This will be created if necessary.
     * @private
     */
    _getMotionState(target) {
        let motionState = target.getCustomState(opencv.STATE_KEY);
        if (!motionState) {
            motionState = Clone.simple(opencv.DEFAULT_MOTION_STATE);
            target.setCustomState(opencv.STATE_KEY, motionState);
        }
        return motionState;
    }

    static get SensingAttribute() {
        return SensingAttribute;
    }

    /**
     * An array of choices of whether a reporter should return the frame's
     * motion amount or direction.
     * @type {object[]} an array of objects
     * @param {string} name - the translatable name to display in sensor
     *   attribute menu
     * @param {string} value - the serializable value of the attribute
     */
    get ATTRIBUTE_INFO() {
        return [
            {
                name: 'motion',
                value: SensingAttribute.MOTION
            },
            {
                name: 'direction',
                value: SensingAttribute.DIRECTION
            }
        ];
    }

    static get SensingSubject() {
        return SensingSubject;
    }

    /**
     * An array of info about the subject choices.
     * @type {object[]} an array of objects
     * @param {string} name - the translatable name to display in the subject menu
     * @param {string} value - the serializable value of the subject
     */
    get SUBJECT_INFO() {
        return [
            {
                name: 'stage',
                value: SensingSubject.STAGE
            },
            {
                name: 'sprite',
                value: SensingSubject.SPRITE
            }
        ];
    }

    /**
     * States the video sensing activity can be set to.
     * @readonly
     * @enum {string}
     */
    static get VideoState() {
        return VideoState;
    }

    /**
     * An array of info on video state options for the "turn video [STATE]" block.
     * @type {object[]} an array of objects
     * @param {string} name - the translatable name to display in the video state menu
     * @param {string} value - the serializable value stored in the block
     */
    get VIDEO_STATE_INFO() {
        return [
            {
                name: 'off',
                value: VideoState.OFF
            },
            {
                name: 'on',
                value: VideoState.ON
            },
            {
                name: 'on flipped',
                value: VideoState.ON_FLIPPED
            }
        ];
    }

    get CIRCLE_DISPLAY_INFO() {
        return [
            {
                name: 'off',
                value: CircleDisplayState.OFF
            },
            {
                name: 'on',
                value: CircleDisplayState.ON
            }
        ];
    }

    get SHAPE_DISPLAY_INFO() {
        return [
            {
                name: 'off',
                value: ShapeDisplayState.OFF
            },
            {
                name: 'on',
                value: ShapeDisplayState.ON
            }
        ];
    }

    get COLOR_THRES_DISPLAY_INFO() {
        return [
            {
                name: 'off',
                value: ColorThresDisplayState.OFF
            },
            {
                name: 'on',
                value: ColorThresDisplayState.ON
            }
        ];
    }
    
    get EDGES_DISPLAY_INFO() {
        return [
            {
                name: 'off',
                value: EdgesDisplayState.OFF
            },
            {
                name: 'on',
                value: EdgesDisplayState.ON
            }
        ];
    }

    get CIRCLE_ATTRIBUTES() {
        return [
            {
                name: 'x position',
                value: CircleAttribute.CENTER_X
            },
            {
                name: 'y position',
                value: CircleAttribute.CENTER_Y
            },
            {
                name: 'radius',
                value: CircleAttribute.SIZE
            },
            {
                name: 'number of circles',
                value: CircleAttribute.NUM_CIRCLES
            }
        ]
    }

    get SHAPE_ATTRIBUTES() {
        return [
            {
                name: 'x position',
                value: ShapeAttribute.CENTER_X
            },
            {
                name: 'y position',
                value: ShapeAttribute.CENTER_Y
            },
            {
                name: 'area',
                value: ShapeAttribute.SIZE
            },
            {
                name: 'number of shapes',
                value: ShapeAttribute.NUM_SHAPES
            }
        ]
    }

    get COLOR_THRES_ATTRIBUTES() {
        return [
            {
                name: 'x position',
                value: ColorThresAttribute.CENTER_X
            },
            {
                name: 'y position',
                value: ColorThresAttribute.CENTER_Y
            },
            {
                name: 'area',
                value: ColorThresAttribute.SIZE
            },
            {
                name: 'number of objects',
                value: ColorThresAttribute.NUM_OBJECTS
            }
        ]
    }

    get EDGES_ATTRIBUTES() {
        return [
            {
                name: 'x position',
                value: EdgesAttribute.CENTER_X
            },
            {
                name: 'y position',
                value: EdgesAttribute.CENTER_Y
            },
            {
                name: 'area',
                value: EdgesAttribute.SIZE
            },
            {
                name: 'number of objects',
                value: EdgesAttribute.NUM_OBJECTS
            }
        ]
    }

    get APERTURE_SIZES() {
        return [
            {
                name: '3',
                value: 3
            },
            {
                name: '5',
                value: 5
            },
            {
                name: '7',
                value: 7
            }
        ]
    }


     /**
     * @returns {object} metadata for this extension and its blocks.
     */
      getInfo() {
          return {
            id: 'opencv',
            name: 'opencv',
            blocks: [
                {
                    opcode: 'videoToggle',
                    text: formatMessage({
                        id: 'videoSensing.videoToggle',
                        default: 'turn video [VIDEO_STATE]',
                        description: 'Controls display of the video preview layer'
                    }),
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.NUMBER,
                            menu: 'VIDEO_STATE',
                            defaultValue: VideoState.ON
                        }
                    }
                },
                {
                    opcode: 'setVideoTransparency',
                    text: formatMessage({
                        id: 'videoSensing.setVideoTransparency',
                        default: 'set video transparency to [TRANSPARENCY]',
                        description: 'Controls transparency of the video preview layer'
                    }),
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                "---",
                {
                    opcode: 'circleDetection',
                    blockType: BlockType.COMMAND,
                    text: 'detect all circles of minimum size [MINRAD] and maximum size [MAXRAD], which are at least [MINDIST] apart',
                    arguments: {
                        MINRAD: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        },
                        MAXRAD: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 240
                        },
                        MINDIST: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
                    }
                },
                {
                    opcode: 'circleDisplayToggle',
                    blockType: BlockType.COMMAND,
                    text: 'turn circles display [CIRCLE_DISPLAY_STATE]',
                    arguments: {
                        CIRCLE_DISPLAY_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'CIRCLE_DISPLAY_STATE',
                            defaultValue: 'on'
                        }
                    }
                },
                {
                    opcode: 'getCircleAttribute',
                    blockType: BlockType.REPORTER,
                    text: 'get circle attribute [CIRCLE_ATTRIBUTE]',
                    arguments: {
                        CIRCLE_ATTRIBUTE: {
                            type: ArgumentType.STRING,
                            menu: 'CIRCLE_ATTRIBUTE',
                            defaultValue: 'x position'
                        }
                    }
                },
                "---",
                {
                    opcode: 'shapeDetection',
                    blockType: BlockType.COMMAND,
                    text: 'detect shapes of minimum size [MIN_AREA] with threshold of [THRESHOLD]',
                    arguments: {
                        MIN_AREA: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 30
                        },
                        THRESHOLD: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 30
                        }
                    }
                },
                {
                    opcode: 'shapeDisplayToggle',
                    blockType: BlockType.COMMAND,
                    text: 'turn shapes display [SHAPE_DISPLAY_STATE]',
                    arguments: {
                        SHAPE_DISPLAY_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'SHAPE_DISPLAY_STATE',
                            defaultValue: 'on'
                        }
                    }
                },
                {
                    opcode: 'getShapeAttribute',
                    blockType: BlockType.REPORTER,
                    text: 'get shape attribute [SHAPE_ATTRIBUTE]',
                    arguments: {
                        SHAPE_ATTRIBUTE: {
                            type: ArgumentType.STRING,
                            menu: 'SHAPE_ATTRIBUTE',
                            defaultValue: 'x position'
                        }
                    }
                },
                "---",
                {
                    opcode: 'colorThreshold',
                    blockType: BlockType.COMMAND,
                    text: 'detect colors with hue in range [HUE_MIN] to [HUE_MAX], saturation [SAT_MIN] to [SAT_MAX], and \n value [VAL_MIN] to [VAL_MAX]',
                    arguments: {
                        HUE_MIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        SAT_MIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        VAL_MIN: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        HUE_MAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 179
                        },
                        SAT_MAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        },
                        VAL_MAX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 255
                        }
                    }
                },
                {
                    opcode: 'colorThresDisplayToggle',
                    blockType: BlockType.COMMAND,
                    text: 'turn color threshold display [COLOR_THRES_DISPLAY_STATE]',
                    arguments: {
                        COLOR_THRES_DISPLAY_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR_THRES_DISPLAY_STATE',
                            defaultValue: 'on'
                        }
                    }
                },
                {
                    opcode: 'getColorThresAttribute',
                    blockType: BlockType.REPORTER,
                    text: 'get color thresholding attribute [COLOR_THRES_ATTRIBUTE]',
                    arguments: {
                        COLOR_THRES_ATTRIBUTE: {
                            type: ArgumentType.STRING,
                            menu: 'COLOR_THRES_ATTRIBUTE',
                            defaultValue: 'x position'
                        }
                    }
                },
                "---",
                {
                    opcode: 'edgeDetection',
                    blockType: BlockType.COMMAND,
                    text: 'detect edges using threshold values [THRES1] and [THRES2] and aperture size [APERTURE]',
                    arguments: {
                        THRES1: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        },
                        THRES2: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 200
                        },
                        APERTURE: {
                            type: ArgumentType.NUMBER,
                            menu: 'APERTURE_SIZES',
                            defaultValue: 3
                        }
                    }
                },
                {
                    opcode: 'edgeDisplayToggle',
                    blockType: BlockType.COMMAND,
                    text: 'turn edges display [EDGES_DISPLAY_STATE]',
                    arguments: {
                        EDGES_DISPLAY_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'EDGES_DISPLAY_STATE',
                            defaultValue: 'on'
                        }
                    }
                },
                {
                    opcode: 'getEdgeAttribute',
                    blockType: BlockType.REPORTER,
                    text: 'get edges attribute [EDGES_ATTRIBUTE]',
                    arguments: {
                        EDGES_ATTRIBUTE: {
                            type: ArgumentType.STRING,
                            menu: 'EDGES_ATTRIBUTE',
                            defaultValue: 'x position'
                        }
                    }
                }
            ],
            menus: {
                ATTRIBUTE: this._buildMenu(this.ATTRIBUTE_INFO),
                SUBJECT: this._buildMenu(this.SUBJECT_INFO),
                VIDEO_STATE: this._buildMenu(this.VIDEO_STATE_INFO),
                CIRCLE_DISPLAY_STATE: this._buildMenu(this.CIRCLE_DISPLAY_INFO),
                CIRCLE_ATTRIBUTE: this._buildMenu(this.CIRCLE_ATTRIBUTES),
                SHAPE_DISPLAY_STATE: this._buildMenu(this.SHAPE_DISPLAY_INFO),
                SHAPE_ATTRIBUTE: this._buildMenu(this.SHAPE_ATTRIBUTES),
                COLOR_THRES_DISPLAY_STATE: this._buildMenu(this.COLOR_THRES_DISPLAY_INFO),
                COLOR_THRES_ATTRIBUTE: this._buildMenu(this.COLOR_THRES_ATTRIBUTES),
                EDGES_DISPLAY_STATE: this._buildMenu(this.EDGES_DISPLAY_INFO),
                EDGES_ATTRIBUTE: this._buildMenu(this.EDGES_ATTRIBUTES),
                APERTURE_SIZES: this._buildMenu(this.APERTURE_SIZES)
            }
          };
      }

      async circleDetection(args) {
        // if (this.circleFlag === false) {
        //     return
        // }
        // this.circleFlag === false
        return new Promise((resolve, reject) => {
            let min_size = parseFloat(args.MINRAD);
            let max_size = parseFloat(args.MAXRAD);
            let min_dist = parseFloat(args.MINDIST);

            const originCanvas = this.runtime.renderer._gl.canvas 
            let canvas = faceapi.createCanvasFromMedia(this.video) 
            let context = canvas.getContext('2d');

            let baseCanvas = originCanvas.parentElement.childNodes[0]
            canvas.width = baseCanvas.width * 0.5
            canvas.height = baseCanvas.height * 0.5

            originCanvas.parentElement.style.position = 'relative'
            canvas.style.position = 'absolute'
            canvas.style.top = '0'
            canvas.style.left = '0'

            if (this.circleDisplayState === CircleDisplayState.ON) {
                if (this.circleOverlayCanvas != null) {
                    originCanvas.parentElement.removeChild(this.circleOverlayCanvas)
                }
                this.circleOverlayCanvas = canvas;
                originCanvas.parentElement.append(this.circleOverlayCanvas);
            }
            else {
                this.circleOverlayCanvas = canvas
            }

            let doStuff = (w, h) => {
                const BGRAmat = cv.matFromImageData(this.frame_image);

                let circles = new cv.Mat();
                let color = new cv.Scalar(255,255,255,255);
                cv.cvtColor(BGRAmat, BGRAmat, cv.COLOR_RGBA2GRAY, 0);
                cv.HoughCircles(BGRAmat, circles, cv.HOUGH_GRADIENT,
                                1, min_size, max_size, min_dist, 0, 0);

                let ratio = w / this.frame_image.width 

                let largestRadius = 0
                let largestX, largestY = null

                let dst = cv.Mat.zeros(BGRAmat.rows, BGRAmat.cols, cv.CV_8UC4);
                for (let i = 0; i < circles.cols; ++i) {
                    let x = circles.data32F[i * 3] * ratio;
                    let y = circles.data32F[i * 3 + 1] * ratio;

                    let radius = circles.data32F[i * 3 + 2] * ratio;
                    let center = new cv.Point(x, y);
                    cv.circle(dst, center, radius, color, 3);

                    if (radius > largestRadius) {
                        largestRadius = radius;
                        largestX = x;
                        largestY = y;
                    }
                }

                if (largestX != null) {
                    let center_point = new cv.Point(largestX, largestY)
                    cv.circle(dst, center_point, largestRadius, new cv.Scalar(0, 255, 0, 255), 3);
                    cv.circle(dst, center_point, radius=4, color=new cv.Scalar(0, 0, 255, 255), thickness=2)
                }

                let imageData = context.createImageData(dst.cols, dst.rows);
                imageData.data.set(new Uint8ClampedArray(dst.data, dst.cols, dst.rows));
                context.putImageData(imageData, 0, 0);

                this.circleX = largestX - (canvas.width / 2)
                this.circleY = largestY - (canvas.height / 2)
                this.circleSize = largestRadius
                this.circleNumCircles = circles.cols

                // this.circleFlag = true
                // resolve('success')
            };
            doStuff(canvas.width, canvas.height)
            resolve('success')
        })
      }

      circleDisplayToggle(args) {
        const state = args.CIRCLE_DISPLAY_STATE;
        if (state === this.circleDisplayState) {
            return
        }
        this.circleDisplayState = state;
        const originCanvas = this.runtime.renderer._gl.canvas;
        if (this.circleOverlayCanvas != null) {
            console.log(state)
            if (state === CircleDisplayState.OFF) {
                originCanvas.parentElement.removeChild(this.circleOverlayCanvas)
            } else {
                originCanvas.parentElement.append(this.circleOverlayCanvas)
            }
        }
      }

      getCircleAttribute(args) {
          const attr = args.CIRCLE_ATTRIBUTE
          switch (attr) {
            case CircleAttribute.CENTER_X: return this.circleX;
            case CircleAttribute.CENTER_Y: return this.circleY;
            case CircleAttribute.SIZE: return this.circleSize;
            case CircleAttribute.NUM_CIRCLES: return this.circleNumCircles;
            default: return null;
          }
      }

      videoToggle(args) {
        const state = args.VIDEO_STATE;
        this.globalVideoState = state;
        if (state === VideoState.OFF) {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo().then(() => {
                       this.video = this.runtime.ioDevices.video.provider.video
                       console.log('this.video got')
                   });
            // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
            this.runtime.ioDevices.video.mirror = state === VideoState.ON;
        }
    }

    async shapeDetection(args) {
        return new Promise((resolve, reject) => {
            let min_a = Math.max(0, parseFloat(args.MIN_AREA));
            let thres = Math.min(Math.max(0, parseFloat(args.THRESHOLD)));

            const originCanvas = this.runtime.renderer._gl.canvas  
            let canvas = faceapi.createCanvasFromMedia(this.video) 
            let context = canvas.getContext('2d');

            let baseCanvas = originCanvas.parentElement.childNodes[0]
            canvas.width = baseCanvas.width * 0.5
            canvas.height = baseCanvas.height * 0.5

            originCanvas.parentElement.style.position = 'relative'
            canvas.style.position = 'absolute'
            canvas.style.top = '0'
            canvas.style.left = '0'

            if (this.shapeDisplayState === ShapeDisplayState.ON) {
                if (this.shapeOverlayCanvas != null) {
                    originCanvas.parentElement.removeChild(this.shapeOverlayCanvas)
                }
                this.shapeOverlayCanvas = canvas;
                originCanvas.parentElement.append(this.shapeOverlayCanvas);
            }
            else {
                this.shapeOverlayCanvas = canvas
            }

            let doStuff = async (w, h) => {
                const frame = cv.matFromImageData(this.frame_image);
                cv.resize(frame, frame, new cv.Size(w, h))

                let gray = new cv.Mat()
                cv.cvtColor(frame, gray, cv.COLOR_BGR2GRAY)
                cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0)
                cv.medianBlur(gray, gray, 5)
                
                let threshInv = new cv.Mat()
                cv.threshold(gray, threshInv, thres, 255, cv.THRESH_BINARY_INV)
                let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5,5));
                cv.dilate(threshInv, threshInv, kernel)
                
                let contours = new cv.MatVector()
                let hierarchy = new cv.Mat()
                cv.findContours(threshInv, contours, hierarchy, mode=cv.RETR_EXTERNAL, method=cv.CHAIN_APPROX_NONE)
                
                let object_area = 0
                let object_x = 0
                let object_y = 0
                let object_w = 0
                let object_h = 0
                let center_x = 0
                let center_y = 0
                let largest_i = null

                let cntFrame = new cv.Mat.zeros(frame.rows, frame.cols, cv.CV_8UC4)
                for (let i = 0; i < contours.size(); i++) {
                    let cnt = contours.get(i)

                    let rect = cv.boundingRect(cnt)
                    let x = rect['x']
                    let y = rect['y']
                    let width = rect['width']
                    let height = rect['height']
                    let found_area = width * height

                    if (found_area > min_a) {
                        cv.drawContours(cntFrame, contours, i, new cv.Scalar(255, 255, 255, 255), 3)
                        cv.drawContours(cntFrame, contours, i, new cv.Scalar(255, 255, 255, 150), -1)
                        largest_i = i

                        if (object_area < found_area) {
                            object_area = found_area
                            object_x = x
                            object_y = y
                            object_w = width
                            object_h = height
                            center_x = parseInt(x + (width / 2))
                            center_y = parseInt(y + (height / 2))
                        }
                    }
                }
                if (largest_i != null) {
                    cv.drawContours(cntFrame, contours, largest_i, new cv.Scalar(0, 255, 0, 255), 3)
                    cv.circle(cntFrame, new cv.Point(center_x, center_y), radius=4, color=new cv.Scalar(0, 0, 255, 255), thickness=2)
                }

                let imageData = context.createImageData(cntFrame.cols, cntFrame.rows);
                imageData.data.set(new Uint8ClampedArray(cntFrame.data, cntFrame.cols, cntFrame.rows));
                context.putImageData(imageData, 0, 0);

                // console.log('added to context')
                this.shapeX = center_x - (canvas.width / 2)
                this.shapeY = center_y - (canvas.height / 2)
                this.shapeSize = object_area
                this.shapeNumShapes = contours.size()

                resolve('success')
            };
            doStuff(canvas.width, canvas.height)
        })
    }

    shapeDisplayToggle(args) {
        const state = args.SHAPE_DISPLAY_STATE;
        if (state === this.shapeDisplayState) {
            return
        }
        this.shapeDisplayState = state;
        const originCanvas = this.runtime.renderer._gl.canvas;
        if (this.shapeOverlayCanvas != null) {
            console.log(state)
            if (state === ShapeDisplayState.OFF) {
                originCanvas.parentElement.removeChild(this.shapeOverlayCanvas)
            } else {
                originCanvas.parentElement.append(this.shapeOverlayCanvas)
            }
        }
      }

    getShapeAttribute(args) {
        const attr = args.SHAPE_ATTRIBUTE
        switch (attr) {
            case ShapeAttribute.CENTER_X: return this.shapeX;
            case ShapeAttribute.CENTER_Y: return this.shapeY;
            case ShapeAttribute.SIZE: return this.shapeSize;
            case ShapeAttribute.NUM_SHAPES: return this.shapeNumShapes;
            default: return null;
        }
    }

    async colorThreshold(args) {
        return new Promise((resolve, reject) => {
            let hue_min = Math.max(0, parseFloat(args.HUE_MIN));
            let hue_max = Math.min(179, parseFloat(args.HUE_MAX));
            let sat_min = Math.max(0, parseFloat(args.SAT_MIN));
            let sat_max = Math.min(255, parseFloat(args.SAT_MAX));
            let val_min = Math.max(0, parseFloat(args.VAL_MIN));
            let val_max = Math.min(255, parseFloat(args.VAL_MAX));

            const originCanvas = this.runtime.renderer._gl.canvas
            let canvas = faceapi.createCanvasFromMedia(this.video) 
            let context = canvas.getContext('2d');

            // console.log(originCanvas.parentElement.childNodes)
            let baseCanvas = originCanvas.parentElement.childNodes[0]
            canvas.width = baseCanvas.width * 0.5
            canvas.height = baseCanvas.height * 0.5

            originCanvas.parentElement.style.position = 'relative'
            canvas.style.position = 'absolute'
            canvas.style.top = '0'
            canvas.style.left = '0'

            if (this.colorThresDisplayState === ColorThresDisplayState.ON) {
                if (this.colorThresOverlayCanvas != null) {
                    originCanvas.parentElement.removeChild(this.colorThresOverlayCanvas)
                }
                this.colorThresOverlayCanvas = canvas;
                originCanvas.parentElement.append(this.colorThresOverlayCanvas);
            }
            else {
                this.colorThresOverlayCanvas = canvas
            }

            let doStuff = async (w, h) => {
                const frame = cv.matFromImageData(this.frame_image);
                cv.resize(frame, frame, new cv.Size(w, h))

                let hsv = new cv.Mat()
                cv.cvtColor(frame, hsv, cv.COLOR_BGR2HSV)

                let lower_array = []
                let upper_array = []
                for(let i = 0; i < hsv.cols*hsv.rows; i++) {
                    lower_array.push(hue_min, sat_min, val_min)
                    upper_array.push(hue_max, sat_max, val_max)
                }

                // try {
                    let lower_hsv = new cv.matFromArray(hsv.rows, hsv.cols, hsv.type(), lower_array)
                    let upper_hsv = new cv.matFromArray(hsv.rows, hsv.cols, hsv.type(), upper_array)
                    cv.inRange(hsv, lower_hsv, upper_hsv, hsv)
                // }
                // catch (e) {
                //     reject('something went wrong')
                // }
                
                let contours = new cv.MatVector()
                let hierarchy = new cv.Mat()
                cv.findContours(hsv, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
                // console.log('contours found')
                
                let object_area = 0
                let object_x = 0
                let object_y = 0
                let object_w = 0
                let object_h = 0
                let center_x = 0
                let center_y = 0
                let largest_i = null

                let cntFrame = new cv.Mat(frame.rows, frame.cols, frame.type())
                for (let i = 0; i < contours.size(); i++) {
                    let cnt = contours.get(i)

                    cv.drawContours(cntFrame, contours, i, new cv.Scalar(255, 255, 255, 255), 3)
                    cv.drawContours(cntFrame, contours, i, new cv.Scalar(255, 255, 255, 150), -1)

                    let rect = cv.boundingRect(cnt)
                    let x = rect['x']
                    let y = rect['y']
                    let width = rect['width']
                    let height = rect['height']
                    let found_area = width * height
                    if (object_area < found_area) {
                        largest_i = i
                        object_area = found_area
                        object_x = x
                        object_y = y
                        object_w = width
                        object_h = height
                        center_x = parseInt(x + (width / 2))
                        center_y = parseInt(y + (height / 2))
                    }
                }
                // console.log('a largest conour found', largest_i)
                if (largest_i != null) {
                    cv.drawContours(cntFrame, contours, largest_i, new cv.Scalar(0, 255, 0, 255), 3)
                    cv.circle(cntFrame, new cv.Point(center_x, center_y), radius=4, color=new cv.Scalar(0, 0, 255, 255), thickness=2)
                }

                let imageData = context.createImageData(cntFrame.cols, cntFrame.rows);
                imageData.data.set(new Uint8ClampedArray(cntFrame.data, cntFrame.cols, cntFrame.rows));
                context.putImageData(imageData, 0, 0);

                this.colorThresX = center_x - (canvas.width / 2)
                this.colorThresY = center_y - (canvas.height / 2)
                this.colorThresSize = object_area
                this.colorThresNumObjs = contours.size()

                resolve('success')
            };
            doStuff(canvas.width, canvas.height)
        })
    }

    colorThresDisplayToggle(args) {
        const state = args.COLOR_THRES_DISPLAY_STATE;
        if (state === this.colorThresDisplayState) {
            return
        }
        this.colorThresDisplayState = state;
        const originCanvas = this.runtime.renderer._gl.canvas;
        if (this.colorThresOverlayCanvas != null) {
            if (state === ColorThresDisplayState.OFF) {
                originCanvas.parentElement.removeChild(this.colorThresOverlayCanvas)
            } else {
                originCanvas.parentElement.append(this.colorThresOverlayCanvas)
            }
        }
      }

    getColorThresAttribute(args) {
        const attr = args.COLOR_THRES_ATTRIBUTE
        switch (attr) {
            case ColorThresAttribute.CENTER_X: return this.colorThresX;
            case ColorThresAttribute.CENTER_Y: return this.colorThresY;
            case ColorThresAttribute.SIZE: return this.colorThresSize;
            case ColorThresAttribute.NUM_OBJECTS: return this.colorThresNumObjs;
            default: return null;
        }
    }

    async edgeDetection(args) {
        return new Promise((resolve, reject) => {
            const thres1 = Math.max(1, Math.min(500, args.THRES1))
            const thres2 = Math.max(1, Math.min(500, args.THRES2))
            const aper = parseInt(args.APERTURE)

            const originCanvas = this.runtime.renderer._gl.canvas
            let canvas = faceapi.createCanvasFromMedia(this.video) 
            let context = canvas.getContext('2d');

            let baseCanvas = originCanvas.parentElement.childNodes[0]
            canvas.width = baseCanvas.width * 0.5
            canvas.height = baseCanvas.height * 0.5

            originCanvas.parentElement.style.position = 'relative'
            canvas.style.position = 'absolute'
            canvas.style.top = '0'
            canvas.style.left = '0'

            if (this.edgesDisplayState === EdgesDisplayState.ON) {
                if (this.edgesOverlayCanvas != null) {
                    originCanvas.parentElement.removeChild(this.edgesOverlayCanvas)
                }
                this.edgesOverlayCanvas = canvas;
                originCanvas.parentElement.append(this.edgesOverlayCanvas);
            }
            else {
                this.edgesOverlayCanvas = canvas
            }

            let doStuff = async (w, h) => {
                const frame = cv.matFromImageData(this.frame_image);
                cv.resize(frame, frame, new cv.Size(w, h))

                let img_edge = new cv.Mat.zeros(frame.rows, frame.cols, cv.CV_8UC4)
                cv.cvtColor(frame, img_edge, cv.COLOR_RGBA2GRAY)
                cv.GaussianBlur(img_edge, img_edge, new cv.Size(5,5), 0)
                cv.Canny(img_edge, img_edge, thres1, thres2, apertureSize=aper)

                let contours = new cv.MatVector()
                let hierarchy = new cv.Mat()
                cv.findContours(img_edge, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
        
                let object_area = 0
                let object_x = 0
                let object_y = 0
                let object_w = 0
                let object_h = 0
                let center_x = 0
                let center_y = 0
                let largest_i = null

                let cntFrame = new cv.Mat.zeros(frame.rows, frame.cols, cv.CV_8UC4)
                for (let i = 0; i < contours.size(); i++) {
                    let contour = contours.get(i)
                    cv.drawContours(cntFrame, contours, i, new cv.Scalar(255, 255, 255, 255), 3)
                    let rect = cv.boundingRect(contour)
                    let x = rect['x']
                    let y = rect['y']
                    let width = rect['width']
                    let height = rect['height']
                    let found_area = width * height
                    if (object_area < found_area) {
                        largest_i = i
                        object_area = found_area
                        object_x = x
                        object_y = y
                        object_w = width
                        object_h = height
                        center_x = parseInt(x + (width / 2))
                        center_y = parseInt(y + (height / 2))
                    }
                }

                if (largest_i != null) {
                    cv.drawContours(cntFrame, contours, largest_i, new cv.Scalar(0, 255, 0, 255), 3)
                    cv.circle(cntFrame, new cv.Point(center_x, center_y), radius=4, color=new cv.Scalar(0, 0, 255, 255), thickness=2)
                }

                let imageData = context.createImageData(cntFrame.cols, cntFrame.rows);
                imageData.data.set(new Uint8ClampedArray(cntFrame.data, cntFrame.cols, cntFrame.rows));
                context.putImageData(imageData, 0, 0);

                this.edgesX = center_x - (canvas.width / 2)
                this.edgesY = center_y - (canvas.height / 2)
                this.edgesSize = object_area
                this.edgesNumObjs = contours.size()

                resolve('success')
            }
            doStuff(canvas.width, canvas.height)
        })   
    }

    edgeDisplayToggle(args) {
        const state = args.EDGES_DISPLAY_STATE;
        if (state === this.edgesDisplayState) {
            return
        }
        this.edgesDisplayState = state;
        const originCanvas = this.runtime.renderer._gl.canvas;
        if (this.edgesOverlayCanvas != null) {
            if (state === EdgesDisplayState.OFF) {
                originCanvas.parentElement.removeChild(this.edgesOverlayCanvas)
            } else {
                originCanvas.parentElement.append(this.edgesOverlayCanvas)
            }
        }
      }

    getEdgeAttribute(args) {
        const attr = args.EDGES_ATTRIBUTE
        switch (attr) {
            case EdgesAttribute.CENTER_X: return this.edgesX;
            case EdgesAttribute.CENTER_Y: return this.edgesY;
            case EdgesAttribute.SIZE: return this.edgesSize;
            case EdgesAttribute.NUM_OBJECTS: return this.edgesNumObjs;
            default: return null;
        }
    }

    /**
     * A scratch command block handle that configures the video preview's
     * transparency from passed arguments.
     * @param {object} args - the block arguments
     * @param {number} args.TRANSPARENCY - the transparency to set the video
     *   preview to
     */
    setVideoTransparency(args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = transparency;
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }
    stop(){
        clearInterval(this.timer)
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height)
        recognition = null
    }

    clearRef() {
        console.log(referenceData.length)
        referenceData = [] //clear previous data
        refIndex = 0 //reset refIdex
    }
}

module.exports = opencv;