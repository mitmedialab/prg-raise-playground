/// <reference path="../typings/index.d.ts" />

declare class DOFInfo {
    getControlType():string;
    getDOFName():string;
    getLimit(limitName:string):number;
    getMax():number;
    getMin():number;
    isCyclic():boolean;
    isMetric():boolean;
}

export class DOFSet {
    getDOFs():string[];
    hasDOF(dofName:string):boolean;
    minus(otherSet:DOFSet):DOFSet;
    plus(otherSet:DOFSet):DOFSet;
}

export interface DOFSets {
    ALL: DOFSet,
    BASE: DOFSet,
    BODY: DOFSet,
    EYE: DOFSet,
    LED: DOFSet,
    OVERLAY: DOFSet,
    SCREEN: DOFSet,
    EYE_ROOT: DOFSet,
    EYE_DEFORM: DOFSet,
    EYE_RENDER: DOFSet,
    EYE_TRANSLATE: DOFSet,
    EYE_ROTATE: DOFSet,
    EYE_COLOR: DOFSet,
    EYE_TEXTURE: DOFSet,
    EYE_VISIBILITY: DOFSet,
    OVERLAY_ROOT: DOFSet,
    OVERLAY_DEFORM: DOFSet,
    OVERLAY_RENDER: DOFSet,
    OVERLAY_TRANSLATE: DOFSet,
    OVERLAY_ROTATE: DOFSet,
    OVERLAY_COLOR: DOFSet,
    OVERLAY_TEXTURE: DOFSet,
    OVERLAY_VISIBILITY: DOFSet,
    SCREEN_BG_RENDER: DOFSet,
    SCREEN_BG_COLOR: DOFSet,
    SCREEN_BG_TEXTURE: DOFSet
}

export interface AuxOutputDelegate {
    display(timestamp, dofValues, metadata): void;
}

export class AuxOutput {
    constructor(robotInfo:any, delegate:AuxOutputDelegate);
}

export declare namespace Animate {
    export const AnimationEventType:{
        STARTED: "STARTED",
        STOPPED: "STOPPED",
        CANCELLED: "CANCELLED",
        EVENT: "EVENT"
    };
    export const dofs:DOFSets;

    export const LookatEventType: {
        STARTED: "STARTED",
        TARGET_REACHED: "TARGET_REACHED",
        TARGET_SUPERSEDED: "TARGET_SUPERSEDED",
        STOPPED: "STOPPED",
        CANCELLED: "CANCELLED"
    };
    export function getRobotInfo():RobotInfo;
    export function getClock():Clock;
    export function createAnimationBuilder(uri:string, callback:(builder:AnimationBuilder)=>void, forceReload?:boolean):void;
    export function createAnimationBuilderFromData(animationData:any, parentDirectoryURI?:string, cacheKey?:string):AnimationBuilder;
    export function createAnimationBuilderFromPose(name:string, pose:{[name:string]:any}, dofs?:DOFSet|string[]):AnimationBuilder;
    export function createLookatBuilder():LookatBuilder;
    export function blink(interrupt?:boolean):void;
    export function setEyeVisible(visible:boolean):void;
    export function setEyeScale(scale:number):void;
    export function setEyeScaleXY(xScale:number, yScale:number):void;
    export function setEyePosition(x:number, y:number):void;
    export function setLEDColor(color:number[]):void;
    export function centerRobot(whichDOFs:DOFSet, centerGlobally?:boolean, completionCallback?:()=>void):void;
    export function setDefaultTransition(transition:TransitionBuilder):void;
    export function getDefaultTransition():TransitionBuilder;
    export function createLinearTransitionBuilder():LinearTransitionBuilder;
    export function createAccelerationTransitionBuilder(defaultMaxVelocity:number, defaultMaxAcceleration:number):AccelerationTransitionBuilder;
    export function installRenderPlugin(renderPlugin:RenderPlugin):void;
    export function removeRenderPlugin(renderPluginName:string):void;
    export function getInstalledRenderPluginNames():string[];

    //stuff exported for typing of variables
    export class AnimationInstance {
        stop():void;
        getTransitionStartTime():Time;
        getAnimationStartTime():Time;
        getAnimationEndTime():Time;
        getBuilder():AnimationBuilder;
    }
    type AnimationEventCallback = (eventName:string, animationInstance:AnimationInstance, payload:any)=>void;
    export class AnimationBuilder {
        play():AnimationInstance;
        on(eventName:string, callback:AnimationEventCallback):void;
        off(eventName:string, callback:AnimationEventCallback):void;
        setSpeed(speed:number):void;
        setNumLoops(numLoops:number):void;
        setDOFs(dofNames:DOFSet|string[]):void;
        getDOFs():string[];
        setPlayBounds(inPoint:number, outPoint:number):void;
        getSourceAnimationDuration():number;
        getConfiguredAnimationDuration():number;
        setTransitionIn(transition:TransitionBuilder):void;
        getTransitionIn():TransitionBuilder;
        setStopOrient(stopOrient:boolean):void;
        setLayer(layerName:string):void;
        getCleanCopy():AnimationBuilder;
    }
    export class TransitionBuilder {
        clone():TransitionBuilder;
    }
    type Vector3 = {
        x:number,
        y:number,
        z:number
    };
    export class LookatInstance {
        stop():void;
        updateTarget(target:Vector3|number[]):void;
        getTarget():Vector3;
        getBuilder():LookatBuilder;
    }
    type LookatEventCallback = (eventName:string, lookatInstance:LookatInstance)=>void;
    export class LookatBuilder {
        startLookat(target:Vector3|number[]):LookatInstance;
        on(eventName:string, callback:LookatEventCallback):void
        off(eventName:string, callback:LookatEventCallback):void
        setDOFs(dofNames:DOFSet|string[]):void;
        getDOFs():string[];
        setOrientFully(orientFully:boolean):void;
        setContinuousMode(isContinuous:boolean):void;
    }
    export class LinearTransitionBuilder extends TransitionBuilder {
        setTransitionTime(time:number):void;
        setMaxVelocity(defaultMaxVelocity:number, maxVelocityByDOFMap:{[dof:string]:number}):void;
        clone():LinearTransitionBuilder;
    }
    export class AccelerationTransitionBuilder extends TransitionBuilder {
        setDefaultLimits(defaultMaxVelocity:number, defaultMaxAcceleration:number):void
        setMinTransitionTime(time:number):void;
        setLimits(dofNames:string[], maxVelocity:number, maxAcceleration:number):void;
        clone():AccelerationTransitionBuilder;
    }
    class RenderPlugin {
        // TODO: Docs for this class reference Three.js scenes - is it still in use?
        // Are we stripping out all the three.js everythings?
    }
    export class RobotInfo {
        getBodyDOFNames():string[];
        getDefaultDOFValues():{[name:string]:any};
        getDOFInfo(dofName:string):DOFInfo;
        getDOFNames():string[];
        getDOFSet(dofSetName:string):DOFSet;
        getDOFSetNames():string[];
        getEyeDOFNames():string[];
    }
}

export class AnimationUtilities {
    static createAnimationUtilities(timeline?:any, robotInfo?:any): typeof Animate;
}

export var body:any;
export var LEDOutput:any;
export var animate: typeof AnimationUtilities;
export var visualize:any;
export var MouseCoordinateWrangler:any;
export var MouseTargetPositioner:any;
export var JiboConfig:any;
export var RobotInfo:any;
export var EyeKinematicsHelper:any;
export var TimelineBuilder:any;

export type Timestamp = [number, number];
export class Time {
    _timestamp: Timestamp;
    static createFromTimestamp(timestamp:Timestamp):Time;
    add(seconds:number):Time;
    equals(otherTime:Time):boolean;
    isGreater(otherTime:Time):boolean;
    isGreaterOrEqual(otherTime:Time):boolean;
    subtract(subtrahendTime:Time):number;
    toString():string;
}
export class Clock {
    static currentTime():Time;
}
export class TrajectoryControllerSim {
    constructor(initialPosition:number, initialVelocity:number, initialTime:Time);
}
export class PosVelControllerSim {
    constructor(initialPosition:number, initialVelocity:number, initialTime:Time);
}

import * as three_ns from 'three';
export import THREE = three_ns;

// export namespace THREE {
//     export class Vector3 {
//         x:number;
//         y:number;
//         z:number;
//         constructor(x?:number, y?:number, z?:number);
//         set (x:number, y:number, z:number):void;
//         setFromMatrixPosition(positionOrMatrix:any):void;
//     }
//     export var Mesh:any;
//     export var MeshBasicMaterial:any;
//     export var SphereGeometry:any;
//     export var Color:any;
//     export var Raycaster:any;
//     export var Vector2:any;
//     export var Matrix4:any;
//     export var BoxGeometry:any;
//     export var AxisHelper:any;
//     export var BoundingBoxHelper:any;
//     export var WireframeHelper:any;
// }

export declare namespace slog {
    export type LogFunction = (msg: any, ...params: any[]) => void;
    export function wrapLog(debug: LogFunction, info: LogFunction, warn: LogFunction, error: LogFunction);
}
