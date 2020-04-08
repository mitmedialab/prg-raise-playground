require("regenerator-runtime/runtime");
const Runtime = require('../../engine/runtime');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const Video = require('../../io/video');

const posenet = require('@tensorflow-models/posenet');
const handpose = require('@tensorflow-models/handpose');

const Stats = require('stats.js');

function initializeFPSStats() {
    const fpsStats = new Stats();
    fpsStats.showPanel(0);
    document.body.appendChild(fpsStats.dom);
    const animate = () => {
        fpsStats.begin();
        fpsStats.end();
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
}

function initializeModelStats() {
    const modelStats = new Stats();
    modelStats.showPanel(0);
    document.body.appendChild(modelStats.dom);
    modelStats.dom.style.left = null;
    modelStats.dom.style.right = 0;
    return modelStats;
}

function friendlyRound(amount) {
    return Number(amount).toFixed(2);
}

const modelStats = initializeModelStats();
initializeFPSStats();

const ALL_EMOTIONS = ['joy',
    'sadness',
    'disgust',
    'anger',
    'fear'
];

/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjIgKDY3MTQ1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5FeHRlbnNpb25zL1NvZnR3YXJlL1ZpZGVvLVNlbnNpbmctTWVudTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSJFeHRlbnNpb25zL1NvZnR3YXJlL1ZpZGVvLVNlbnNpbmctTWVudSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9InZpZGVvLW1vdGlvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDUuMDAwMDAwKSIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5IiBmaWxsPSIjMEVCRDhDIiBvcGFjaXR5PSIwLjI1IiBjeD0iMTYiIGN5PSI4IiByPSIyIj48L2NpcmNsZT4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5IiBmaWxsPSIjMEVCRDhDIiBvcGFjaXR5PSIwLjUiIGN4PSIxNiIgY3k9IjYiIHI9IjIiPjwvY2lyY2xlPgogICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHkiIGZpbGw9IiMwRUJEOEMiIG9wYWNpdHk9IjAuNzUiIGN4PSIxNiIgY3k9IjQiIHI9IjIiPjwvY2lyY2xlPgogICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBmaWxsPSIjMEVCRDhDIiBjeD0iMTYiIGN5PSIyIiByPSIyIj48L2NpcmNsZT4KICAgICAgICAgICAgPHBhdGggZD0iTTExLjMzNTk3MzksMi4yMDk3ODgyNSBMOC4yNSw0LjIwOTk1NjQ5IEw4LjI1LDMuMDUgQzguMjUsMi4wNDQ4ODIyNyA3LjQ2ODU5MDMxLDEuMjUgNi41LDEuMjUgTDIuMDUsMS4yNSBDMS4wMzgwNzExOSwxLjI1IDAuMjUsMi4wMzgwNzExOSAwLjI1LDMuMDUgTDAuMjUsNyBDMC4yNSw3Ljk2MzY5OTM3IDEuMDQyMjQ5MTksOC43NTU5NDg1NiAyLjA1LDguOCBMNi41LDguOCBDNy40NTA4MzAwOSw4LjggOC4yNSw3Ljk3MzI3MjUgOC4yNSw3IEw4LjI1LDUuODU4NDUyNDEgTDguNjI4NjIzOTQsNi4wODU2MjY3NyBMMTEuNDI2Nzc2Nyw3Ljc3MzIyMzMgQzExLjQzNjg5NDMsNy43ODMzNDA5MSAxMS40NzU3NjU1LDcuOCAxMS41LDcuOCBDMTEuNjMzNDkzMiw3LjggMTEuNzUsNy42OTEyNjAzNCAxMS43NSw3LjU1IEwxMS43NSwyLjQgQzExLjc1LDIuNDE4MzgyNjkgMTEuNzIxOTAyOSwyLjM1MjgyMjgyIDExLjY4NTYyNjgsMi4yNzg2MjM5NCBDMTEuNjEyOTUyOCwyLjE1NzUwMDY5IDExLjQ3MDc5NjgsMi4xMjkwNjk1IDExLjMzNTk3MzksMi4yMDk3ODgyNSBaIiBpZD0idmlkZW9fMzdfIiBzdHJva2Utb3BhY2l0eT0iMC4xNSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAuNSIgZmlsbD0iIzRENEQ0RCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDBweCIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgNDAgNDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUyLjIgKDY3MTQ1KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5FeHRlbnNpb25zL1NvZnR3YXJlL1ZpZGVvLVNlbnNpbmctQmxvY2s8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0iRXh0ZW5zaW9ucy9Tb2Z0d2FyZS9WaWRlby1TZW5zaW5nLUJsb2NrIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2Utb3BhY2l0eT0iMC4xNSI+CiAgICAgICAgPGcgaWQ9InZpZGVvLW1vdGlvbiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDEwLjAwMDAwMCkiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSIjMDAwMDAwIj4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5IiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGN4PSIzMiIgY3k9IjE2IiByPSI0LjUiPjwvY2lyY2xlPgogICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHkiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjeD0iMzIiIGN5PSIxMiIgcj0iNC41Ij48L2NpcmNsZT4KICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5IiBmaWxsPSIjRkZGRkZGIiBvcGFjaXR5PSIwLjc1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGN4PSIzMiIgY3k9IjgiIHI9IjQuNSI+PC9jaXJjbGU+CiAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY3g9IjMyIiBjeT0iNCIgcj0iNC41Ij48L2NpcmNsZT4KICAgICAgICAgICAgPHBhdGggZD0iTTIyLjY3MTk0NzcsNC40MTk1NzY0OSBMMTYuNSw4LjQxOTkxMjk4IEwxNi41LDYuMSBDMTYuNSw0LjA4OTc2NDU0IDE0LjkzNzE4MDYsMi41IDEzLDIuNSBMNC4xLDIuNSBDMi4wNzYxNDIzNywyLjUgMC41LDQuMDc2MTQyMzcgMC41LDYuMSBMMC41LDE0IEMwLjUsMTUuOTI3Mzk4NyAyLjA4NDQ5ODM5LDE3LjUxMTg5NzEgNC4xLDE3LjYgTDEzLDE3LjYgQzE0LjkwMTY2MDIsMTcuNiAxNi41LDE1Ljk0NjU0NSAxNi41LDE0IEwxNi41LDExLjcxNjkwNDggTDIyLjc1NzI0NzksMTUuNDcxMjUzNSBMMjIuODUzNTUzNCwxNS41NDY0NDY2IEMyMi44NzM3ODg2LDE1LjU2NjY4MTggMjIuOTUxNTMxLDE1LjYgMjMsMTUuNiBDMjMuMjY2OTg2NSwxNS42IDIzLjUsMTUuMzgyNTIwNyAyMy41LDE1LjEgTDIzLjUsNC44IEMyMy41LDQuODM2NzY1MzggMjMuNDQzODA1OCw0LjcwNTY0NTYzIDIzLjM3MTI1MzUsNC41NTcyNDc4OCBDMjMuMjI1OTA1Niw0LjMxNTAwMTM5IDIyLjk0MTU5MzcsNC4yNTgxMzg5OSAyMi42NzE5NDc3LDQuNDE5NTc2NDkgWiIgaWQ9InZpZGVvXzM3XyIgZmlsbD0iIzRENEQ0RCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';

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
 * Class for the motion-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3PoseNetBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        /**
         * A flag to determine if this extension has been installed in a project.
         * It is set to false the first time getInfo is run.
         * @type {boolean}
         */
        this.firstInstall = true;

        if (this.runtime.ioDevices) {
            this.runtime.on(Runtime.PROJECT_LOADED, this.projectStarted.bind(this));
            this.runtime.on(Runtime.PROJECT_RUN_START, this.reset.bind(this));
            this._loop();
        }
    }

    /**
     * After analyzing a frame the amount of milliseconds until another frame
     * is analyzed.
     * @type {number}
     */
    static get INTERVAL () {
        return 33;
    }

    /**
     * Dimensions the video stream is analyzed at after its rendered to the
     * sample canvas.
     * @type {Array.<number>}
     */
    static get DIMENSIONS () {
        return [480, 360];
    }

    /**
     * The key to load & store a target's motion-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.poseNet';
    }

    /**
     * The default motion-related state, to be used when a target has no existing motion state.
     * @type {MotionState}
     */
    static get DEFAULT_MOTION_STATE () {
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
    get globalVideoTransparency () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoTransparency;
        }
        return 50;
    }

    set globalVideoTransparency (transparency) {
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
    get globalVideoState () {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            return stage.videoState;
        }
        // Though the default value for the stage is normally 'on', we need to default
        // to 'off' here to prevent the video device from briefly activating
        // while waiting for stage targets to be installed that say it should be off
        return VideoState.OFF;
    }

    set globalVideoState (state) {
        const stage = this.runtime.getTargetForStage();
        if (stage) {
            stage.videoState = state;
        }
        return state;
    }

    /**
     * Get the latest values for video transparency and state,
     * and set the video device to use them.
     */
    projectStarted () {
        this.setVideoTransparency({
            TRANSPARENCY: this.globalVideoTransparency
        });
        this.videoToggle({
            VIDEO_STATE: this.globalVideoState
        });
    }

    reset () {
    }

    async _loop () {
        while (true) {
            modelStats.begin();
            const frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: Scratch3PoseNetBlocks.DIMENSIONS
            });

            const time = +new Date();
            if (frame) {
                // TODO(bcjordan): find good flow for toggling these
                // blocks / buttons to enable / disable?
                // lazy-evaluate when called? (requires async block execution)
                this.affdexState = await this.estimateAffdexOnImage(frame);
                // this.poseState = await this.estimatePoseOnImage(frame);
                // this.handPoseState = await this.estimateHandPoseOnImage(frame);
            }
            const estimateThrottleTimeout = (+new Date() - time) / 4;
            await new Promise(r => setTimeout(r, estimateThrottleTimeout));
            modelStats.end();
        }
    }

    async estimateAffdexOnImage(imageElement) {
        const affdexDetector = await this.ensureAffdexLoaded(imageElement);

        affdexDetector.process(imageElement, 0);
        return new Promise((resolve, reject) => {
            const resultListener = function(faces, image, timestamp) {
                affdexDetector.removeEventListener("onImageResultsSuccess", resultListener);
                if (faces.length < 1) {
                    resolve(null);
                    return;
                }
                resolve(faces[0]);
            };
            affdexDetector.addEventListener("onImageResultsSuccess", resultListener);
        });
    }

    async ensureAffdexLoaded(imageElement) {
        if (!this._affdex) {
            const affdexLoader = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                document.body.appendChild(script);
                script.onload = resolve;
                script.onerror = reject;
                script.async = true;
                script.src = 'https://download.affectiva.com/js/3.2.1/affdex.js';
            });
            await affdexLoader;
            const affdexStarter = new Promise((resolve, reject) => {
                const width = Video.DIMENSIONS[0];
                const height = Video.DIMENSIONS[1];
                const faceMode = window.affdex.FaceDetectorMode.LARGE_FACES;
                const detector = new window.affdex.PhotoDetector(imageElement, width, height, faceMode);
                detector.detectAllEmotions();
                detector.detectAllExpressions();
                detector.start();
                this._affdex = detector;
                detector.addEventListener("onInitializeSuccess", resolve);
            });
            await affdexStarter;
        }
        return this._affdex;
    }

    async estimatePoseOnImage(imageElement) {
        // load the posenet model from a checkpoint
        const bodyModel = await this.ensureBodyModelLoaded();
        return await bodyModel.estimateSinglePose(imageElement, {
            flipHorizontal: false
        });
    }

    async ensureBodyModelLoaded() {
        if (!this._bodyModel) {
            this._bodyModel = await posenet.load();
        }
        return this._bodyModel;
    }

    /**
     * @param imageElement
     * @returns {Promise<AnnotatedPrediction[]>}
     */
    async estimateHandPoseOnImage(imageElement) {
        const handModel = await this.getLoadedHandModel();
        return await handModel.estimateHands(imageElement, {
            flipHorizontal: false
        });
    }

    async getLoadedHandModel() {
        if (!this._handModel) {
            this._handModel = await handpose.load();
        }
        return this._handModel;
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
    _buildMenu (info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = entry.value || String(index + 1);
            return obj;
        });
    }

    static get SensingAttribute () {
        return SensingAttribute;
    }

    /**
     * An array of choices of whether a reporter should return the frame's
     * motion amount or direction.
     * @type {object[]}
     * @param {string} name - the translatable name to display in sensor
     *   attribute menu
     * @param {string} value - the serializable value of the attribute
     */
    get ATTRIBUTE_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'videoSensing.motion',
                    default: 'motion',
                    description: 'Attribute for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingAttribute.MOTION
            },
            {
                name: formatMessage({
                    id: 'videoSensing.direction',
                    default: 'direction',
                    description: 'Attribute for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingAttribute.DIRECTION
            }
        ];
    }

    static get SensingSubject () {
        return SensingSubject;
    }

    /**
     * An array of info about the subject choices.
     * @type {object[]}
     * @param {string} name - the translatable name to display in the subject menu
     * @param {string} value - the serializable value of the subject
     */
    get SUBJECT_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'videoSensing.sprite',
                    default: 'sprite',
                    description: 'Subject for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingSubject.SPRITE
            },
            {
                name: formatMessage({
                    id: 'videoSensing.stage',
                    default: 'stage',
                    description: 'Subject for the "video [ATTRIBUTE] on [SUBJECT]" block'
                }),
                value: SensingSubject.STAGE
            }
        ];
    }

    /**
     * States the video sensing activity can be set to.
     * @readonly
     * @enum {string}
     */
    static get VideoState () {
        return VideoState;
    }

    /**
     * An array of info on video state options for the "turn video [STATE]" block.
     * @type {object[]}
     * @param {string} name - the translatable name to display in the video state menu
     * @param {string} value - the serializable value stored in the block
     */
    get VIDEO_STATE_INFO () {
        return [
            {
                name: formatMessage({
                    id: 'videoSensing.off',
                    default: 'off',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.OFF
            },
            {
                name: formatMessage({
                    id: 'videoSensing.on',
                    default: 'on',
                    description: 'Option for the "turn video [STATE]" block'
                }),
                value: VideoState.ON
            },
            {
                name: formatMessage({
                    id: 'videoSensing.onFlipped',
                    default: 'on flipped',
                    description: 'Option for the "turn video [STATE]" block that causes the video to be flipped' +
                        ' horizontally (reversed as in a mirror)'
                }),
                value: VideoState.ON_FLIPPED
            }
        ];
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        // Set the video display properties to defaults the first time
        // getInfo is run. This turns on the video device when it is
        // first added to a project, and is overwritten by a PROJECT_LOADED
        // event listener that later calls updateVideoDisplay
        if (this.firstInstall) {
            this.globalVideoState = VideoState.ON;
            this.globalVideoTransparency = 50;
            this.projectStarted();
            this.firstInstall = false;
            this.predictionState = {};
            this._bodyModel = null;
            this._handModel = null;
        }

        // Return extension definition
        return {
            id: 'posenet',
            name: formatMessage({
                id: 'posenet.categoryName',
                default: 'Face, Hand, Body',
                description: 'Label for PoseNet category'
            }),
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
                // {
                //
                //     opcode: 'enableBodyPoseButton',
                //     blockType: BlockType.BUTTON,
                //     text: 'Track Body Parts',
                //     func: 'POSE_ENABLE_BODY'
                // },
                // {
                //
                //     opcode: 'enableHandPoseButton',
                //     blockType: BlockType.BUTTON,
                //     text: 'Track Hand Parts',
                //     func: 'POSE_ENABLE_HAND'
                // },
                {
                    opcode: 'affdexGoToPart',
                    text: 'go to [AFFDEX_POINT]',
                    blockType: BlockType.COMMAND,
                    isTerminal: false,
                    arguments: {
                        AFFDEX_POINT: {
                            type: ArgumentType.STRING,
                            defaultValue: "0",
                            menu: 'AFFDEX_POINT'
                        },
                    },
                },
                {
                    opcode: 'goToHandPart',
                    text: 'go to [HAND_PART] [HAND_SUB_PART]',
                    blockType: BlockType.COMMAND,
                    isTerminal: false,
                    arguments: {
                        HAND_PART: {
                            type: ArgumentType.STRING,
                            defaultValue: 'thumb',
                            menu: 'HAND_PART'
                        },
                        HAND_SUB_PART: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 3,
                            menu: 'HAND_SUB_PART'
                        },
                    },
                },
                {
                    opcode: 'goToPart',
                    text: 'go to [PART]',
                    blockType: BlockType.COMMAND,
                    isTerminal: false,
                    arguments: {
                        PART: {
                            type: ArgumentType.STRING,
                            defaultValue: 'rightShoulder',
                            menu: 'PART'
                        },
                    },
                },
                '---',
                {
                    opcode: 'affdexExpressionAmount',
                    text: 'amount of [EXPRESSION]',
                    blockType: BlockType.REPORTER,
                    isTerminal: true,
                    arguments: {
                        EXPRESSION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'smile',
                            menu: 'EXPRESSION'
                        },
                    }
                },
                {
                    opcode: 'affdexIsExpression',
                    text: 'expressing [EXPRESSION]',
                    blockType: BlockType.BOOLEAN,
                    isTerminal: true,
                    arguments: {
                        EXPRESSION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'smile',
                            menu: 'EXPRESSION'
                        },
                    }
                },
                '---',
                {
                    opcode: 'affdexEmotionAmount',
                    text: 'level of [EMOTION_ALL]',
                    blockType: BlockType.REPORTER,
                    isTerminal: true,
                    arguments: {
                        EMOTION_ALL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'joy',
                            menu: 'EMOTION_ALL'
                        },
                    },
                },
                {
                    opcode: 'affdexIsTopEmotion',
                    text: 'feeling [EMOTION]',
                    blockType: BlockType.BOOLEAN,
                    isTerminal: true,
                    arguments: {
                        EMOTION: {
                            type: ArgumentType.STRING,
                            defaultValue: 'joy',
                            menu: 'EMOTION'
                        },
                    },
                },
                '---',
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
                            defaultValue: VideoState.OFF
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
                            defaultValue: 50
                        }
                    }
                },
                '---',
                // {
                //     opcode: 'affdexBrowRaise',
                //     text: 'eyebrow raise',
                //     blockType: BlockType.REPORTER,
                //     isTerminal: true,
                // },
                // {
                //     opcode: 'affdexSmileAmount',
                //     text: 'smile size',
                //     blockType: BlockType.REPORTER,
                //     isTerminal: true,
                // },
                // {
                //     opcode: 'affdexMouthOpenAmount',
                //     text: 'mouth opening',
                //     blockType: BlockType.REPORTER,
                //     isTerminal: true,
                // },
                // {
                //     opcode: 'affdexTopEmotionName',
                //     text: 'top emotion',
                //     blockType: BlockType.REPORTER,
                //     isTerminal: true,
                // },
                // // {
                // //     opcode: 'affdexTopEmotionAmount',
                // //     text: 'top emotion amount',
                // //     blockType: BlockType.REPORTER,
                // //     isTerminal: true,
                // // },
                // {
                //     opcode: 'affdexIsEmotion',
                //     text: 'emotion is [EMOTION_ALL]',
                //     blockType: BlockType.BOOLEAN,
                //     isTerminal: true,
                //     arguments: {
                //         EMOTION_ALL: {
                //             type: ArgumentType.STRING,
                //             defaultValue: 'joy',
                //             menu: 'EMOTION_ALL'
                //         },
                //     },
                // },
                // {
                //     opcode: 'affdexSmile',
                //     text: 'smiling',
                //     blockType: BlockType.BOOLEAN,
                //     isTerminal: true,
                // },
                // {
                //     opcode: 'affdexEyesClosed',
                //     text: 'eyes are closed',
                //     blockType: BlockType.BOOLEAN,
                //     isTerminal: true,
                // },
                // {
                //     opcode: 'affdexMouthOpen',
                //     text: 'mouth is open',
                //     blockType: BlockType.BOOLEAN,
                //     isTerminal: true,
                // },
                // {
                //     opcode: 'posePositionX',
                //     text: '[PART] position X',
                //     blockType: BlockType.REPORTER,
                //     isTerminal: true,
                //     arguments: {
                //         PART: {
                //             type: ArgumentType.STRING,
                //             defaultValue: 'nose',
                //             menu: 'PART'
                //         },
                //     },
                // },
                // {
                //     opcode: 'posePositionY',
                //     text: '[PART] position Y',
                //     blockType: BlockType.REPORTER,
                //     isTerminal: true,
                //     arguments: {
                //         PART: {
                //             type: ArgumentType.STRING,
                //             defaultValue: 'nose',
                //             menu: 'PART'
                //         },
                //     },
                // },
                // {
                //     opcode: 'handPosePositionX',
                //     text: '[HAND_PART] [HAND_SUB_PART] X',
                //     blockType: BlockType.REPORTER,
                //     isTerminal: true,
                //     arguments: {
                //         HAND_PART: {
                //             type: ArgumentType.STRING,
                //             defaultValue: 'thumb',
                //             menu: 'HAND_PART'
                //         },
                //         HAND_SUB_PART: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 3,
                //             menu: 'HAND_SUB_PART'
                //         },
                //     },
                // },
                // {
                //     opcode: 'handPosePositionY',
                //     text: '[HAND_PART] [HAND_SUB_PART] Y',
                //     blockType: BlockType.REPORTER,
                //     isTerminal: true,
                //     arguments: {
                //         HAND_PART: {
                //             type: ArgumentType.STRING,
                //             defaultValue: 'thumb',
                //             menu: 'HAND_PART'
                //         },
                //         HAND_SUB_PART: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 3,
                //             menu: 'HAND_SUB_PART'
                //         },
                //     },
                // },
            ],
            menus: {
                AFFDEX_POINT: {
                    items: [
                        {text: 'left ear', value: '0'},
                        {text: 'left chin', value: '1'},
                        {text: 'chin', value: '2'},
                        {text: 'right chin', value: '3'},
                        {text: 'right ear', value: '4'},
                        {text: 'left outer eyebrow', value: '5'},
                        {text: 'left eyebrow', value: '6'},
                        {text: 'left inner eyebrow', value: '7'},
                        {text: 'right inner eyebrow', value: '8'},
                        {text: 'right eyebrow', value: '9'},
                        {text: 'right outer eyebrow', value: '10'},
                        {text: 'nose bridge', value: '11'},
                        {text: 'nose tip', value: '12'},
                        {text: 'left nostril', value: '13'},
                        {text: 'nose tip', value: '14'},
                        {text: 'right nostril', value: '15'},
                        {text: 'left outer eye crease', value: '16'},
                        {text: 'left inner eye crease', value: '17'},
                        {text: 'right inner eye crease', value: '18'},
                        {text: 'right outer eye crease', value: '19'},
                        {text: 'left mouth crease', value: '20'},
                        {text: 'left upper lip point', value: '21'},
                        {text: 'upper lip', value: '22'},
                        {text: 'right upper lip point', value: '23'},
                        {text: 'right mouth crease', value: '24'},
                        {text: 'right lower lip point', value: '25'},
                        {text: 'lower lip', value: '26'},
                        {text: 'left lower lip point', value: '27'},
                        {text: 'upper lip bottom', value: '28'},
                        {text: 'lower lip top', value: '29'},
                        {text: 'left upper eyelid', value: '30'},
                        {text: 'left lower eyelid', value: '31'},
                        {text: 'right upper eyelid', value: '32'},
                        {text: 'right lower eyelid', value: '33'},
                    ]
                },
                EMOTION: {
                    acceptReporters: true,
                    items: [
                        {text: 'joyful', value: 'joy'},
                        {text: 'sad', value: 'sadness'},
                        {text: 'disgusted', value: 'disgust'},
                        // {text: 'contempt', value: 'contempt'},
                        {text: 'angry', value: 'anger'},
                        {text: 'fearful', value: 'fear'},
                        // {text: 'surprise', value: 'surprise'},
                        // {text: 'valence', value: 'valence'},
                        // {text: 'engagement', value: 'engagement'},
                    ]
                },
                EXPRESSION: {
                    acceptReporters: true,
                    items: [
                        {text: 'smile', value: 'smile'},
                        {text: 'mouth open', value: 'mouthOpen'},
                        {text: 'eye closure', value: 'eyeClosure'},
                        {text: 'eyebrow raise', value: 'browRaise'},
                        {text: 'eye widening', value: 'eyeWiden'},
                        // {text:'innerBrowRaise', value: 'innerBrowRaise'},
                        {text: 'eyebrow furrow', value: 'browFurrow'},
                        {text: 'nose wrinkle', value: 'noseWrinkle'},
                        {text: 'upper lip raise', value: 'upperLipRaise'},
                        {text: 'lip corner pull', value: 'lipCornerDepressor'},
                        {text: 'chin raise', value: 'chinRaise'},
                        {text: 'lip pucker', value: 'lipPucker'},
                        // {text:'lip press', value:  'lipPress'},
                        // {text:'lip suck', value:  'lipSuck'},
                        {text: 'smirk', value: 'smirk'},
                        {text: 'attention', value: 'attention'},
                        {text: 'eyelid tighten', value: 'lidTighten'},
                        {text: 'jaw drop', value: 'jawDrop'},
                        {text: 'cheek dimple', value: 'dimpler'},
                        {text: 'cheek raise', value: 'cheekRaise'},
                        {text: 'lip stretch', value: 'lipStretch'},
                    ]
                },
                EMOTION_ALL: {
                    acceptReporters: true,
                    items: [
                        {text: 'joy', value: 'joy'},
                        {text: 'sadness', value: 'sadness'},
                        {text: 'disgust', value: 'disgust'},
                        {text: 'contempt', value: 'contempt'},
                        {text: 'anger', value: 'anger'},
                        {text: 'fear', value: 'fear'},
                        {text: 'surprise', value: 'surprise'},
                        {text: 'valence', value: 'valence'},
                        {text: 'engagement', value: 'engagement'},
                    ]
                },
                PART: {
                    acceptReporters: true,
                    items: [
                        {text: 'nose', value: 'nose'},
                        {text: 'left eye', value: 'leftEye'},
                        {text: 'right eye', value: 'rightEye'},
                        {text: 'left ear', value: 'leftEar'},
                        {text: 'right ear', value: 'rightEar'},
                        {text: 'left shoulder', value: 'leftShoulder'},
                        {text: 'right shoulder', value: 'rightShoulder'},
                        {text: 'left elbow', value: 'leftElbow'},
                        {text: 'right elbow', value: 'rightElbow'},
                        {text: 'left wrist', value: 'leftWrist'},
                        {text: 'right wrist', value: 'rightWrist'},
                        {text: 'left hip', value: 'leftHip'},
                        {text: 'right hip', value: 'rightHip'},
                        {text: 'left knee', value: 'leftKnee'},
                        {text: 'right knee', value: 'rightKnee'},
                        {text: 'left ankle', value: 'leftAnkle'},
                        {text: 'right ankle', value: 'rightAnkle'},
                    ]
                },
                HAND_PART: {
                    acceptReporters: true,
                    items: [
                        {text: 'thumb', value: 'thumb'},
                        {text: 'index finger', value: 'indexFinger'},
                        {text: 'middle finger', value: 'middleFinger'},
                        {text: 'ring finger', value: 'ringFinger'},
                        {text: 'pinky', value: 'pinky'},
                        {text: 'base of palm', value: 'palmBase'},
                    ]
                },
                HAND_SUB_PART: {
                    acceptReporters: true,
                    items: [
                        {text: 'base', value: 0},
                        {text: 'first knuckle', value: 1},
                        {text: 'second knuckle', value: 2},
                        {text: 'tip', value: 3},
                    ]
                },
                ATTRIBUTE: {
                    acceptReporters: true,
                    items: this._buildMenu(this.ATTRIBUTE_INFO)
                },
                SUBJECT: {
                    acceptReporters: true,
                    items: this._buildMenu(this.SUBJECT_INFO)
                },
                VIDEO_STATE: {
                    acceptReporters: true,
                    items: this._buildMenu(this.VIDEO_STATE_INFO)
                }
            }
        };
    }

    affdexMouthOpen() {
        if (!this.affdexState || !this.affdexState.expressions) {
            return null;
        }
        return this.affdexState.expressions.mouthOpen > .5;
    }

    affdexIsExpression(args, util) {
        if (!this.affdexState || !this.affdexState.expressions) {
            return null;
        }
        return this.affdexState.expressions[args['EXPRESSION']] > .5;
    }

    affdexExpressionAmount(args, util) {
        if (!this.affdexState || !this.affdexState.expressions) {
            return null;
        }
        return friendlyRound(this.affdexState.expressions[args['EXPRESSION']]);
    }

    affdexMouthOpenAmount() {
        if (!this.affdexState || !this.affdexState.expressions) {
            return null;
        }
        return friendlyRound(this.affdexState.expressions.mouthOpen);
    }

    affdexIsEmotion(args, util) {
        if (!this.affdexState || !this.affdexState.emotions) {
            return null;
        }
        return this.affdexState.emotions[args['EMOTION_ALL']] > 50;
    }

    affdexIsTopEmotion(args, util) {
        if (!this.affdexState || !this.affdexState.emotions) {
            return null;
        }
        let maxEmotionValue = -Number.MAX_VALUE;
        let maxEmotion = null;
        ALL_EMOTIONS.forEach((emotion) => {
            const emotionValue = this.affdexState.emotions[emotion];
            if (emotionValue > maxEmotionValue) {
                maxEmotionValue = emotionValue;
                maxEmotion = emotion;
            }
        });
        return args['EMOTION'] === maxEmotion;
    }

    affdexTopEmotionName(args, util) {
        if (!this.affdexState || !this.affdexState.emotions) {
            return null;
        }
        let maxEmotionValue = -Number.MAX_VALUE;
        let maxEmotion = null;
        ALL_EMOTIONS.forEach((emotion) => {
            const emotionValue = this.affdexState.emotions[emotion];
            if (emotionValue > maxEmotionValue) {
                maxEmotionValue = emotionValue;
                maxEmotion = emotion;
            }
        });
        return maxEmotion;
    }

    affdexTopEmotionAmount(args, util) {
        if (!this.affdexState || !this.affdexState.emotions) {
            return null;
        }
        let maxEmotionValue = -Number.MAX_VALUE;
        let maxEmotion = null;
        ALL_EMOTIONS.forEach((emotion) => {
            const emotionValue = this.affdexState.emotions[emotion];
            if (emotionValue > maxEmotionValue) {
                maxEmotionValue = emotionValue;
                maxEmotion = emotion;
            }
        });
        return friendlyRound(maxEmotionValue);
    }

    affdexEmotionAmount(args, util) {
        if (!this.affdexState || !this.affdexState.emotions) {
            return 0;
        }
        return friendlyRound(this.affdexState.emotions[args['EMOTION_ALL']]);
    }

    affdexEyesClosed() {
        if (!this.affdexState || !this.affdexState.expressions) {
            return null;
        }
        return this.affdexState.expressions.eyeClosure > .5;
    }

    affdexSmile() {
        if (!this.affdexState || !this.affdexState.expressions) {
            return null;
        }
        return this.affdexState.expressions.smile > .5;
    }

    affdexSmileAmount() {
        if (!this.affdexState || !this.affdexState.expressions) {
            return null;
        }
        return friendlyRound(this.affdexState.expressions.smile);
    }

    affdexBrowRaise() {
        if (!this.affdexState || !this.affdexState.expressions) {
            return null;
        }
        return friendlyRound(this.affdexState.expressions.browRaise);
    }


    //featurePoints:
    // 0: {x: 135.26345825195312, y: 209.16903686523438}
    // indices 0 to 33

    affdexGoToPart(args, util) {
        if (!this.affdexState || !this.affdexState.featurePoints) {
            return null;
        }
        const featurePoint = this.affdexState.featurePoints[parseInt(args['AFFDEX_POINT'], 10)];
        const {x, y} = this.affdexCoordsToScratch(featurePoint);
        util.target.setXY(x, y, false);
    }

    goToPart(args, util) {
        if (this.poseState && this.poseState.keypoints)
        const {x, y} = this.tfCoordsToScratch(this.poseState.keypoints.find(point => point.part === args['PART']).position);
        util.target.setXY(x, y, false);
    }

    goToHandPart(args, util) {
        if (this.handPoseState && this.handPoseState.length > 0) {
            const [x, y, z] = this.handPoseState[0].annotations[args['HAND_PART']][args['HAND_SUB_PART']];
            const {x: scratchX, y: scratchY} = this.tfCoordsToScratch({x, y, z});
            util.target.setXY(scratchX, scratchY, false);
        }
    }

    /**
     * @param {object} args - the block arguments
     * @param {BlockUtility} util - the block utility
     * @returns {number} class name if video frame matched, empty number if model not loaded yet
     */
    posePositionX(args, util) {
        return this.tfCoordsToScratch({x: this.poseState.keypoints.find(point => point.part === args['PART']).position.x}).x;
    }

    /**
     * @param {object} args - the block arguments
     * @param {BlockUtility} util - the block utility
     * @returns {number} class name if video frame matched, empty number if model not loaded yet
     */
    posePositionY(args, util) {
        return this.tfCoordsToScratch({y: this.poseState.keypoints.find(point => point.part === args['PART']).position.y}).y;
    }

    /**
     * @param {object} args - the block arguments
     * @param {BlockUtility} util - the block utility
     * @returns {number} class name if video frame matched, empty number if model not loaded yet
     */
    handPosePositionX(args, util) {
        return this.handPoseState.length > 0 ? this.tfCoordsToScratch({x: this.handPoseState[0].annotations[args['HAND_PART']][args['HAND_SUB_PART']][0]}).x : 0;
    }

    /**
     * @param {object} args - the block arguments
     * @param {BlockUtility} util - the block utility
     * @returns {number} class name if video frame matched, empty number if model not loaded yet
     */
    handPosePositionY(args, util) {
        return this.handPoseState.length > 0 ? this.tfCoordsToScratch({y: this.handPoseState[0].annotations[args['HAND_PART']][args['HAND_SUB_PART']][1]}).y : 0;
    }

    tfCoordsToScratch({x, y}) {
        return {x: x - 250, y: 200 - y};
    }

    affdexCoordsToScratch({x, y}) {
        return {x: x - (Video.DIMENSIONS[0] / 2), y: (Video.DIMENSIONS[1] / 2) - y};
    }

    /**
     * A scratch command block handle that configures the video state from
     * passed arguments.
     * @param {object} args - the block arguments
     * @param {VideoState} args.VIDEO_STATE - the video state to set the device to
     */
    videoToggle (args) {
        const state = args.VIDEO_STATE;
        this.globalVideoState = state;
        if (state === VideoState.OFF) {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo();
            // Mirror if state is ON. Do not mirror if state is ON_FLIPPED.
            this.runtime.ioDevices.video.mirror = state === VideoState.ON;
        }
    }

    /**
     * A scratch command block handle that configures the video preview's
     * transparency from passed arguments.
     * @param {object} args - the block arguments
     * @param {number} args.TRANSPARENCY - the transparency to set the video
     *   preview to
     */
    setVideoTransparency (args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = transparency;
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }
}

module.exports = Scratch3PoseNetBlocks;
