require('babel-polyfill');
//require ('@tensorflow/tfjs-node');
const Runtime = require('../../engine/runtime');

const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const Video = require('../../io/video');
const formatMessage = require('format-message');
const canvas = require('canvas'); 
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = canvas

//const posenet = require('@tensorflow-models/posenet')
//import * as posenet from '@tensorflow-models/posenet'

//const tf = require('@tensorflow/tfjs');



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

var referenceData = []
var refIndex = 0
var recognition = null

/**
 * Class for the motion-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class faceApi {
    constructor(runtime) {
        

        this.faceapiInit()
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

        if (this.runtime.ioDevices) {
            // Clear target motion state values when the project starts.
            this.runtime.on(Runtime.PROJECT_RUN_START, this.reset.bind(this));

            // Kick off looping the analysis logic.
            // this._loop();

            // Configure the video device with values from a globally stored
            // location.
            this.setVideoTransparency({
                TRANSPARENCY: this.globalVideoTransparency
            });
            this.videoToggle({
                VIDEO_STATE: this.globalVideoState
            });
        }

       
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
            const state = targets[i].getCustomState(faceApi .STATE_KEY);
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
        setTimeout(this._loop.bind(this), Math.max(this.runtime.currentStepTime, faceApi .INTERVAL));

        // Add frame to detector
        const time = Date.now();
        if (this._lastUpdate === null) {
            this._lastUpdate = time;
        }
        const offset = time - this._lastUpdate;
        if (offset > faceApi .INTERVAL) {
            const frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: faceApi .DIMENSIONS
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
        let motionState = target.getCustomState(faceApi .STATE_KEY);
        if (!motionState) {
            motionState = Clone.simple(faceApi .DEFAULT_MOTION_STATE);
            target.setCustomState(faceApi .STATE_KEY, motionState);
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

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'faceapi',
            name: 'face api',
            blocks: [
                {
                    opcode: 'videoToggle',
                    text: 'turn video [VIDEO_STATE]',
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
                    text: 'set video transparency to [TRANSPARENCY]',
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                {
                    opcode: 'stop',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'faceapi.STOP',
                        default: 'STOP',
                        description: 'terminate current operation'
                    })
                },
                {
                    opcode: 'clearRef',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'faceapi.CLEAR',
                        default: 'CLEAR',
                        description: 'clear reference data'
                    })
                },
                {
                    opcode: 'faceDetection',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'faceapi.faceDetection',
                        default: 'faceDetection',
                        description: 'faceDetection is loaded'
                    })
                },
                {
                    opcode: 'facialFeatureDiskObtain',
                    text: 'load [IMAGENUM] images from disk',
                    arguments: {
                            IMAGENUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        }
                    }
                },
                {
                    opcode: 'facialFeatureWebcamObtain',
                    text: 'obtain [IMAGENUM] webcam images for [NAME]',
                    arguments: {
                            IMAGENUM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 10
                        },
                            NAME: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Michael'
                        }
                    }
                },
                {
                    opcode: 'facialFeatureMatch',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'faceapi.facialFeatureMatch',
                        default: 'facialFeatureMatch',
                        description: 'recognize facial features from the reference data'
                    })
                },
                {
                    opcode: 'multiFeatureMatch',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'faceapi.multiFeatureMatch',
                        default: 'multiFeatureMatch',
                        description: 'recognize all facial features from the reference data'
                    })
                },
                {
                    opcode: 'getResult',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'knn.getResult',
                        default: 'Result',
                        description: 'getResult'
                    }),
                    arguments: {

                    }
                },
                {
                    opcode: 'whenGetResult',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'faceapi.whenGetResult',
                        default: 'when get [STRING]',
                        description: 'whenGetResult'
                    }),
                    arguments: {
                        STRING: {
                            type: ArgumentType.STRING,
                            defaultValue: "Michael"
                        }
                    }
                }
            ],
            menus: {
                ATTRIBUTE: this._buildMenu(this.ATTRIBUTE_INFO),
                SUBJECT: this._buildMenu(this.SUBJECT_INFO),
                VIDEO_STATE: this._buildMenu(this.VIDEO_STATE_INFO)
            }
        };
    }


    /**
     * A scratch command block handle that configures the video state from
     * passed arguments.
     * @param {object} args - the block arguments
     * @param {VideoState} args.VIDEO_STATE - the video state to set the device to
     */
    videoToggle(args) {
        const state = args.VIDEO_STATE;
        this.globalVideoState = state;
        if (state === VideoState.OFF) {
            this.runtime.ioDevices.video.disableVideo();
        } else {
            this.runtime.ioDevices.video.enableVideo().then(() => {
                // 获得video数据
                this.video = this.runtime.ioDevices.video.provider.video
                console.log('this.video got')
                this.originCanvas = this.runtime.renderer._gl.canvas  // 右上侧canvas
                this.timer = setTimeout(async () => {
                    this.canvas = faceapi.createCanvasFromMedia(this.video) // 创建用于绘制canvas
                    console.log('this.canvas got')
                },1000)
            });
;
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

    clearRef(){
        console.log(referenceData.length)
        referenceData = [] //clear previous data
        refIndex = 0 //reset refIdex
    }

    faceDetection()
	{
        return new Promise((resolve, reject) => {

            const originCanvas = this.originCanvas  // 右上侧canvas
            const canvas = this.canvas  // 创建用于绘制canvas

            canvas.width = 480
            canvas.height = 360

           // 将绘制的canvas覆盖于原canvas之上
            originCanvas.parentElement.style.position = 'relative'
            canvas.style.position = 'absolute'
            canvas.style.top = '0'
            canvas.style.left = '0'
            originCanvas.parentElement.append(canvas)

            // 循环检测并绘制检测结果
            this.timer = setInterval(async () => {
                const results = await faceapi
                    .detectSingleFace(this.video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })).withFaceLandmarks().withFaceExpressions()

                // 确认仅得到数据后进行绘制
                if (results) {
                    const displaySize = {width: 480 , height: 360}
                    const resizedDetections = faceapi.resizeResults(results, displaySize)
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                    faceapi.draw.drawDetections(canvas, resizedDetections)
                    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
                    faceapi.draw.drawFaceExpressions(canvas, resizedDetections) 
                }
                resolve('success')
            }, 500);
        })
        }
        
        facialFeatureDiskObtain(args)
        {
            var num = args.IMAGENUM //the number of base images that you want to load
            var faceRef = []
            

            this.timer = setTimeout(async () => {
                
                const labels = ['penny','raj', 'sheldon', 'howard','bernadette','杨文奇']
                for(var i = 0; i< num ; i++){
                        // fetch image data from urls and convert blob to HTMLImage element
                    imgUrl = './static/imageBase/base_'+i+'.png'
                    const img = await faceapi.fetchImage(imgUrl)
                    if(img) {
                        // detect the face with the highest score in the image and compute it's landmarks and face descriptor
                        faceRef = await faceapi
                        .detectSingleFace(img)
                        .withFaceLandmarks()
                        .withFaceDescriptor()
    
                        const faceDescriptor = [faceRef.descriptor]
                        referenceData[refIndex] = new faceapi.LabeledFaceDescriptors(labels[i], faceDescriptor)
                        console.log(referenceData[refIndex])
                        if (!referenceData[refIndex]) {
                            
                            return
                        }
                        refIndex += 1 // length of array plus one
                    }
                }
             },1000)   
        }      
        

        facialFeatureWebcamObtain(args){
            var num = args.IMAGENUM //the number of base images that you want to load
            var faceRef = [] //a cache space for raw data obtained from webcam
            
            this.timer = setTimeout(async () => {
                //const labels = ['sheldon','raj', 'leonard', 'howard']
                for(var i = 0; i< num ; i++){
                        
                    // detect the face with the highest score in the image and compute it's landmarks and face descriptor
                    faceRef[i] = await faceapi
                    .detectSingleFace(this.video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
                    .withFaceLandmarks()
                    .withFaceDescriptor()

                    //console.log(faceRef[i])
                    if(faceRef[i] == undefined) { 
                        i-- 
                        alert("Please stay within the boundary of webcam, thanks!")
                        continue
                    }
                    else{

                        const faceDescriptor = [faceRef[i].descriptor]
                        referenceData[refIndex] = new faceapi.LabeledFaceDescriptors(args.NAME,faceDescriptor)
                        console.log(referenceData[refIndex])
                        refIndex += 1 // length of array plus one
                    }
                }
            },1000)   
        }

        facialFeatureMatch(){

            const originCanvas = this.originCanvas  // 右上侧canvas
            const canvas = this.canvas  // 创建用于绘制canvas


            canvas.width = 480
            canvas.height = 360

            // 将绘制的canvas覆盖于原canvas之上
            originCanvas.parentElement.style.position = 'relative'
            canvas.style.position = 'absolute'
            canvas.style.top = '0'
            canvas.style.left = '0'
            originCanvas.parentElement.append(canvas)


            this.timer = setInterval(async () => {
                // create FaceMatcher with automatically assigned labels
                // from the detection results for the reference image
                const faceMatcher = new faceapi.FaceMatcher(referenceData)
                const queryImage =  await faceapi
                    .detectSingleFace(this.video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })).withFaceLandmarks().withFaceDescriptor()
                if (queryImage) {
                    const displaySize = {width: 400 , height: 300}
                    const resizedDetections = faceapi.resizeResults(queryImage, displaySize)
                    const bestMatch = faceMatcher.findBestMatch(queryImage.descriptor)
                    recognition = bestMatch.label
                    var box = { x: 50, y: 50, width: 100, height: 100 }
                    box.x = resizedDetections.detection.box.x 
                    box.y = resizedDetections.detection.box.y 
                    box.width = resizedDetections.detection.box.width 
                    box.height = resizedDetections.detection.box.height 
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                    const drawBox = new faceapi.draw.DrawBox(box, { label: recognition })
                    drawBox.draw(canvas)
                    //recognition = recognition.substring(recognition.length-5)
                    console.log(recognition)
                    //return text
                }
            },500);
        }   
    

        multiFeatureMatch(){

            const originCanvas = this.originCanvas  // 右上侧canvas
            const canvas = this.canvas  // 创建用于绘制canvas


            canvas.width = 480
            canvas.height = 360

           // 将绘制的canvas覆盖于原canvas之上
            originCanvas.parentElement.style.position = 'relative'
            canvas.style.position = 'absolute'
            canvas.style.top = '0'
            canvas.style.left = '0'
            originCanvas.parentElement.append(canvas)
            this.timer = setInterval(async () => {
                // create FaceMatcher with automatically assigned labels
                // from the detection results for the reference image
                const faceMatcher = new faceapi.FaceMatcher(referenceData)
                const results =  await faceapi
                    .detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })).withFaceLandmarks().withFaceDescriptors()
                if (results) {
                    results.forEach(fd => {
                        const results = faceMatcher.findBestMatch(fd.descriptor)
                        console.log(results)
                      })
                }
            },1000)
        }

        getResult(){
            return recognition

        }

        whenGetResult(args, util){
        
            if (recognition) {
                console.log(args.STRING === recognition)
                const re = args.STRING === recognition
                recognition = null
                return re
            }
        }

        

    async faceapiInit () {

        await faceapi.nets.tinyFaceDetector.loadFromUri('./static/faceapi'),
		await faceapi.nets.faceLandmark68Net.loadFromUri('./static/faceapi'),
		await faceapi.nets.faceRecognitionNet.loadFromUri('./static/faceapi'),
        await faceapi.nets.faceExpressionNet.loadFromUri('./static/faceapi'),
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/static/faceapi'),
        console.log(faceapi.nets)

        
        //array to accommodate the facial deta (max 100)

        


    }
}

module.exports = faceApi;