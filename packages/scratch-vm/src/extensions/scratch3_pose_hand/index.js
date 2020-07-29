require("regenerator-runtime/runtime");
const Runtime = require('../../engine/runtime');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const Video = require('../../io/video');
const nets = require('nets');
const { promisify } = require('util')

const handpose = require('@tensorflow-models/handpose');

const precomputedOutputs = {
    'https://firebasestorage.googleapis.com/v0/b/dancing-with-ai.appspot.com/o/videos%2Fface-reaction.mp4?alt=media&token=c8eae246-2f0e-4fd7-8e0a-e178e46f69ed': 'https://firebasestorage.googleapis.com/v0/b/dancing-with-ai.appspot.com/o/precomputedOutputs%2Ftest2.json?alt=media&token=41d70f91-a3f7-46b2-b3d0-3584d47dd11d'
};

function friendlyRound(amount) {
    return Number(amount).toFixed(2);
}

/**
 * Icon svg to be displayed in the blocks category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIKCSBpZD0ic3ZnMTE3IiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKCSB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQwIDQwIgoJIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe29wYWNpdHk6MC4yNTtmaWxsOiMwRUJEOEM7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDt9Cgkuc3Qxe29wYWNpdHk6MC41O2ZpbGw6IzBFQkQ4QztlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDJ7b3BhY2l0eTowLjc1O2ZpbGw6IzBFQkQ4QztlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDN7ZmlsbDojMEVCRDhDO30KCS5zdDR7ZmlsbDojNDY5MkZGO30KPC9zdHlsZT4KPGNpcmNsZSBpZD0iT3ZhbC1Db3B5IiBjbGFzcz0ic3QwIiBjeD0iMzQuNSIgY3k9IjYuOCIgcj0iNC41Ii8+CjxjaXJjbGUgaWQ9Ik92YWwtQ29weV8xXyIgY2xhc3M9InN0MSIgY3g9IjI4LjMiIGN5PSI1LjIiIHI9IjQuNSIvPgo8Y2lyY2xlIGlkPSJPdmFsLUNvcHlfMl8iIGNsYXNzPSJzdDIiIGN4PSIyMi44IiBjeT0iNS4yIiByPSI0LjUiLz4KPGNpcmNsZSBpZD0iT3ZhbCIgY2xhc3M9InN0MyIgY3g9IjE2LjgiIGN5PSI3LjYiIHI9IjQuNSIvPgo8c29kaXBvZGk6bmFtZWR2aWV3ICBib3JkZXJjb2xvcj0iIzY2NjY2NiIgYm9yZGVyb3BhY2l0eT0iMSIgZ3JpZHRvbGVyYW5jZT0iMTAiIGd1aWRldG9sZXJhbmNlPSIxMCIgaWQ9Im5hbWVkdmlldzExOSIgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iRXh0ZW5zaW9ucy9Tb2Z0d2FyZS9WaWRlby1TZW5zaW5nLUJsb2NrIiBpbmtzY2FwZTpjeD0iMTQuNDY3MDY5IiBpbmtzY2FwZTpjeT0iNi41OTAzMDU2IiBpbmtzY2FwZTpkb2N1bWVudC1yb3RhdGlvbj0iMCIgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiIGlua3NjYXBlOnNuYXAtc21vb3RoLW5vZGVzPSJmYWxzZSIgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iOTA3IiBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIiBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE2MDAiIGlua3NjYXBlOndpbmRvdy14PSI1NzEiIGlua3NjYXBlOndpbmRvdy15PSI5NiIgaW5rc2NhcGU6em9vbT0iNy4wNCIgb2JqZWN0dG9sZXJhbmNlPSIxMCIgcGFnZWNvbG9yPSIjZmZmZmZmIiBzaG93Z3JpZD0iZmFsc2UiPgoJPC9zb2RpcG9kaTpuYW1lZHZpZXc+Cjx0aXRsZSAgaWQ9InRpdGxlMTA0Ij5FeHRlbnNpb25zL1NvZnR3YXJlL1ZpZGVvLVNlbnNpbmctQmxvY2s8L3RpdGxlPgo8ZGVzYyAgaWQ9ImRlc2MxMDYiPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgo8Zz4KCTxnPgoJCTxwYXRoIGNsYXNzPSJzdDQiIGQ9Ik0zLjksMjUuOGMtMC45LTMuNy0yLjgtNC45LTIuOS02Yy0wLjEtMC42LDEtMS40LDIuNC0wLjlzMS45LDEuNCwzLjEsMi45YzEuMywxLjUsMi4xLDIuOSwyLjgsMi40CgkJCWMwLDAsMS41LTEuOCwxLjgtMi4zYzAuNC0wLjksMi41LTcuNCwzLjgtMTAuMmMxLjItMi41LDIuOS0yLjEsMi45LTEuM2MwLjEsMS44LTMuNCwxMy0zLjQsMTNzMy42LTcuNCw0LjgtOS45CgkJCWMxLjItMi40LDMuNC0xLjksMy4yLTEuMmMtMS4xLDMuMi01LjEsMTMuNC01LjEsMTMuNHM0LjQtNy43LDUuMi05YzEtMS42LDIuOS0xLjcsMi45LTAuN2MwLDAuNy01LjMsMTEuOS01LjMsMTEuOQoJCQlzMy40LTUuNSw0LjQtNi44YzAuOS0xLjIsMi45LTEuNSwyLjUtMC4zYy0wLjMsMS01LjMsMTAuMi01LjgsMTFjLTAuOSwxLjktMi42LDMuNS00LjMsNS4xYy0xLjgsMS43LTMuOSwyLjItNC45LDIuNAoJCQljLTAuNCwwLjEtMC44LDAtMS4xLTAuM0w1LDM0LjNjLTAuMy0wLjItMC41LTAuNi0wLjUtMC45QzQuMiwzMi42LDQuOSwyOS44LDMuOSwyNS44eiIvPgoJPC9nPgo8L2c+Cjwvc3ZnPgo=';

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIKCSBpZD0ic3ZnMTE3IiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKCSB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQwIDQwIgoJIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQwIDQwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+CgkKCQkuc3Qwe29wYWNpdHk6MC4yNTtmaWxsOiNGRkZGRkY7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1vcGFjaXR5OjAuMTU7ZW5hYmxlLWJhY2tncm91bmQ6bmV3ICAgIDt9CgkKCQkuc3Qxe29wYWNpdHk6MC41O2ZpbGw6I0ZGRkZGRjtzdHJva2U6IzAwMDAwMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW9wYWNpdHk6MC4xNTtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCQoJCS5zdDJ7b3BhY2l0eTowLjc1O2ZpbGw6I0ZGRkZGRjtzdHJva2U6IzAwMDAwMDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW9wYWNpdHk6MC4xNTtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDN7ZmlsbDojRkZGRkZGO3N0cm9rZTojMDAwMDAwO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utb3BhY2l0eTowLjE1O30KCS5zdDR7ZmlsbDojRjE1QTgzO30KPC9zdHlsZT4KPGcgaWQ9IkV4dGVuc2lvbnNfeDJGX1NvZnR3YXJlX3gyRl9WaWRlby1TZW5zaW5nLUJsb2NrXzJfIj4KCTxjaXJjbGUgaWQ9Ik92YWwtQ29weV8yXyIgY2xhc3M9InN0MCIgY3g9IjM0LjYiIGN5PSI1LjYiIHI9IjQuMSIvPgoJPGNpcmNsZSBpZD0iY2lyY2xlMTA5XzJfIiBjbGFzcz0ic3QxIiBjeD0iMjkiIGN5PSI1LjciIHI9IjQuMSIvPgoJPGNpcmNsZSBpZD0iY2lyY2xlMTExXzJfIiBjbGFzcz0ic3QyIiBjeD0iMjMuNiIgY3k9IjYuNyIgcj0iNC4xIi8+Cgk8Y2lyY2xlIGlkPSJPdmFsXzJfIiBjbGFzcz0ic3QzIiBjeD0iMTkuNiIgY3k9IjguNSIgcj0iNC4xIi8+CjwvZz4KPHNvZGlwb2RpOm5hbWVkdmlldyAgYm9yZGVyY29sb3I9IiM2NjY2NjYiIGJvcmRlcm9wYWNpdHk9IjEiIGdyaWR0b2xlcmFuY2U9IjEwIiBndWlkZXRvbGVyYW5jZT0iMTAiIGlkPSJuYW1lZHZpZXcxMTkiIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9IkV4dGVuc2lvbnMvU29mdHdhcmUvVmlkZW8tU2Vuc2luZy1CbG9jayIgaW5rc2NhcGU6Y3g9IjE0LjQ2NzA2OSIgaW5rc2NhcGU6Y3k9IjYuNTkwMzA1NiIgaW5rc2NhcGU6ZG9jdW1lbnQtcm90YXRpb249IjAiIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIiBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIiBpbmtzY2FwZTpzbmFwLXNtb290aC1ub2Rlcz0iZmFsc2UiIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjkwNyIgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxNjAwIiBpbmtzY2FwZTp3aW5kb3cteD0iNTcxIiBpbmtzY2FwZTp3aW5kb3cteT0iOTYiIGlua3NjYXBlOnpvb209IjcuMDQiIG9iamVjdHRvbGVyYW5jZT0iMTAiIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIgc2hvd2dyaWQ9ImZhbHNlIj4KCTwvc29kaXBvZGk6bmFtZWR2aWV3Pgo8dGl0bGUgIGlkPSJ0aXRsZTEwNCI+RXh0ZW5zaW9ucy9Tb2Z0d2FyZS9WaWRlby1TZW5zaW5nLUJsb2NrPC90aXRsZT4KPGRlc2MgIGlkPSJkZXNjMTA2Ij5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KPGc+Cgk8Zz4KCQk8cGF0aCBjbGFzcz0ic3Q0IiBkPSJNNS41LDI0LjhjLTAuOS0zLjctMi44LTQuOS0yLjktNmMtMC4xLTAuNiwxLTEuNCwyLjQtMC45YzEuNCwwLjUsMS45LDEuNCwzLjEsMi45YzEuMywxLjUsMi4xLDIuOSwyLjgsMi40CgkJCWMwLDAsMS41LTEuOCwxLjgtMi4zYzAuNC0wLjksMi41LTcuNCwzLjgtMTAuMmMxLjItMi41LDIuOS0yLjEsMi45LTEuM2MwLjEsMS44LTMuNCwxMy0zLjQsMTNzMy42LTcuNCw0LjgtOS45CgkJCWMxLjItMi40LDMuNC0xLjksMy4yLTEuMmMtMS4xLDMuMi01LjEsMTMuMy01LjEsMTMuM3M0LjQtNy43LDUuMi05YzEtMS42LDIuOS0xLjcsMi45LTAuN2MwLDAuNy01LjMsMTEuOS01LjMsMTEuOQoJCQlzMy40LTUuNSw0LjQtNi44YzAuOS0xLjIsMi45LTEuNSwyLjUtMC4zYy0wLjMsMS01LjMsMTAuMi01LjgsMTFjLTAuOSwxLjktMi42LDMuNS00LjMsNS4xYy0xLjgsMS43LTMuOSwyLjItNC45LDIuNAoJCQljLTAuNCwwLjEtMC44LDAtMS4xLTAuM2wtNS45LTQuNmMtMC4zLTAuMi0wLjUtMC42LTAuNS0wLjlDNS44LDMxLjYsNi41LDI4LjgsNS41LDI0Ljh6Ii8+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==';

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


const EXTENSION_ID = 'poseHand';

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

        this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
        this.runtime.connectPeripheral(EXTENSION_ID, 0);
        this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);

        this.runtime.on('PROJECT_START', this.unmute.bind(this));
        this.runtime.on('PROJECT_STOP_ALL', this.mute.bind(this));

        this.videoPrecomputed = {};

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
        return 'Scratch.pose_hand';
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

    cameraEnabled() {
        const urlParams = new URLSearchParams(window.location.search);
        const nocamera = urlParams.get('nocamera')
        return !nocamera;
    }

    hasPrecomputed() {
        return !!window.videoBeingPlayed && !!window.videoURL && this.videoPrecomputed.hasOwnProperty(window.videoURL);
    }

    mute() {
        this.runtime.ioDevices.video.muteVideo();
    }

    unmute() {
        this.runtime.ioDevices.video.unmuteVideo();
    }

    async setVideoTikTok (args) {
        try {
            const promiseNets = promisify(nets)

            const {body} = await promiseNets({
                url: `https://dancing-with-ai.web.app/tikTokToVideo?tikTokURL=${args.TIK_TOK_URL}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                encoding: undefined,
            });
            await this.setVideoURL(JSON.parse(body).videoURL);
        } catch (e) {
            console.log(e);
        }
    }

    async setVideoDropdownBlock(args) {
        await this.setVideoURL(args.VIDEO_SELECT);
    }

    async setVideoURLBlock(args) {
        await this.setVideoURL(args.VIDEO_URL);
    }

    async setVideoURL(url) {
        await this.runtime.ioDevices.video.disableVideo();
        await this.runtime.ioDevices.video.setVideoTo(url);
        await this.loadPrecomputedIfAvailable(url);
    }

    async loadPrecomputedIfAvailable(url) {
        const promiseNets = promisify(nets)
        if (window.videoBeingPlayed &&
            precomputedOutputs.hasOwnProperty(url) &&
            !this.videoPrecomputed[url]
        ) {
            const result = await promiseNets({
                url: precomputedOutputs[url],
                method: 'GET',
                encoding: undefined,
            });
            this.videoPrecomputed[url] = JSON.parse(result.body);
        }
    }
    getNearestFor(videoPrecomputed, currentTime) {
        const needle = currentTime;
        const numbers = Object.keys(videoPrecomputed).map(n => parseFloat(n));
        numbers.sort((a, b) => {
            return Math.abs(needle - a) - Math.abs(needle - b);
        })

        const result = numbers[0];
        const precomputed = videoPrecomputed[`${result}`];
        return precomputed;
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

    isConnected() {
        return !!this.handPoseState && this.handPoseState.length > 0;
    }

    scan() {
    }

    connect() {
    }

    async _loop () {
        while (true) {
            const frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: Scratch3PoseNetBlocks.DIMENSIONS
            });

            const time = +new Date();
            if (frame) {
                if (this.hasPrecomputed()) {
                    this.handPoseState = this.getNearestFor(this.videoPrecomputed[window.videoURL], window.videoBeingPlayed.currentTime);
                } else {
                    this.handPoseState = await this.estimateHandPoseOnImage(frame);
                }

                if (this.isConnected()) {
                    this.tryCaptureState(this.handPoseState);
                    this.runtime.emit(this.runtime.constructor.PERIPHERAL_CONNECTED);
                } else {
                    this.runtime.emit(this.runtime.constructor.PERIPHERAL_DISCONNECTED);
                }
            }
            const estimateThrottleTimeout = (+new Date() - time) / 4;
            await new Promise(r => setTimeout(r, estimateThrottleTimeout));
        }
    }

    tryCaptureState(state) {
        const urlParams = new URLSearchParams(window.location.search);
        const record = urlParams.get('record')
        const shouldPrecompute = !!record;
        if (shouldPrecompute && window.videoBeingPlayed) {
            const timeToTag = window.videoBeingPlayed.currentTime;
            window.allVideoData = window.allVideoData || {};
            window.allVideoData[`${timeToTag}`] = state;
            window.downloadVideoData = () => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.allVideoData));
                const dlAnchorElem = document.createElement('a');
                dlAnchorElem.setAttribute("href", dataStr);
                dlAnchorElem.setAttribute("download", `${this.uuidv4()}.json`);
                document.body.appendChild(dlAnchorElem);
                dlAnchorElem.click();
                console.log(window.videoURL);
            }
        }
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
            this._handModel = null;
        }

        // Return extension definition
        return {
            id: EXTENSION_ID,
            name: formatMessage({
                id: 'pose_hand.categoryName',
                default: 'Hand Sensing',
                description: 'Label for Hand Sensing category'
            }),
            showStatusButton: true,
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            blocks: [
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
                '---',
                {
                    opcode: 'setVideoDropdownBlock',
                    text: formatMessage({
                        id: 'videoSensing.setVideoDropdownBlock',
                        default: 'play video [VIDEO_SELECT]',
                        description: 'Changes video source to a looping URL'
                    }),
                    arguments: {
                        VIDEO_SELECT: {
                            type: ArgumentType.STRING,
                            menu: 'VIDEO_SELECT',
                            defaultValue: 'https://firebasestorage.googleapis.com/v0/b/dancing-with-ai.appspot.com/o/videos%2Fdancing-guy.mp4?alt=media&token=012e0937-1109-42ea-b419-b3ccee00b61f'
                        }
                    }
                },
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
                {
                    opcode: 'setVideoURLBlock',
                    text: formatMessage({
                        id: 'videoSensing.setVideoSourceTikTok',
                        default: 'play video URL [VIDEO_URL]',
                        description: 'Changes video source to a looping URL'
                    }),
                    arguments: {
                        VIDEO_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://firebasestorage.googleapis.com/v0/b/dancing-with-ai.appspot.com/o/videos%2FPexels%20Videos%202795750.mp4?alt=media&token=fb248867-c2a8-4aa2-96da-426d0df3fb17'
                        }
                    }
                },

                {
                    opcode: 'setVideoTikTok',
                    text: formatMessage({
                        id: 'videoSensing.setVideoTikTok',
                        default: 'play tiktok [TIK_TOK_URL]',
                        description: 'Changes video source to a TikTok URL'
                    }),
                    arguments: {
                        TIK_TOK_URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://www.tiktok.com/@_ashuu_555_/video/6776613430515289346'
                            // defaultValue: 'https://www.tiktok.com/@messyjurdock/video/6682159214393036037'
                        }
                    }
                },
                '---',
            ],
            menus: {
                VIDEO_SELECT: {
                    acceptReporters: true,
                    items: [
                        {text: 'roof dancing', value: 'https://firebasestorage.googleapis.com/v0/b/dancing-with-ai.appspot.com/o/videos%2Fdancing-guy.mp4?alt=media&token=012e0937-1109-42ea-b419-b3ccee00b61f'},
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
                        // {text: 'base of palm', value: 'palmBase'},
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
