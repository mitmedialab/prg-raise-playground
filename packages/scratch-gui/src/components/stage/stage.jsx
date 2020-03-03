import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

var aframe = require("aframe");
import Box from '../box/box.jsx';
import DOMElementRenderer from '../../containers/dom-element-renderer.jsx';
import Loupe from '../loupe/loupe.jsx';
import MonitorList from '../../containers/monitor-list.jsx';
import TargetHighlight from '../../containers/target-highlight.jsx';
import GreenFlagOverlay from '../../containers/green-flag-overlay.jsx';
import Question from '../../containers/question.jsx';
import MicIndicator from '../mic-indicator/mic-indicator.jsx';
import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants.js';
import {getStageDimensions} from '../../lib/screen-utils.js';
import styles from './stage.css';

const LoopMode = {
    once: THREE.LoopOnce,
    repeat: THREE.LoopRepeat,
    pingpong: THREE.LoopPingPong
};

/**
 * animation-mixer
 *
 * Player for animation clips. Intended to be compatible with any model format that supports
 * skeletal or morph animations through THREE.AnimationMixer.
 * See: https://threejs.org/docs/?q=animation#Reference/Animation/AnimationMixer
 */
aframe.registerComponent('animation-mixer', {
    schema: {
        clip:  {default: '*'},
        duration: {default: 0},
        clampWhenFinished: {default: false, type: 'boolean'},
        crossFadeDuration: {default: 0},
        loop: {default: 'repeat', oneOf: Object.keys(LoopMode)},
        repetitions: {default: Infinity, min: 0},
        timeScale: {default: 1}
    },

    init: function () {
        /** @type {THREE.Mesh} */
        this.model = null;
        /** @type {THREE.AnimationMixer} */
        this.mixer = null;
        /** @type {Array<THREE.AnimationAction>} */
        this.activeActions = [];

        const model = this.el.getObject3D('mesh');

        if (model) {
            this.load(model);
        } else {
            this.el.addEventListener('model-loaded', (e) => {
                this.load(e.detail.model);
            });
        }
    },

    load: function (model) {
        const el = this.el;
        this.model = model;
        this.mixer = new THREE.AnimationMixer(model);
        this.mixer.addEventListener('loop', (e) => {
            el.emit('animation-loop', {action: e.action, loopDelta: e.loopDelta});
        });
        this.mixer.addEventListener('finished', (e) => {
            el.emit('animation-finished', {action: e.action, direction: e.direction});
        });
        if (this.data.clip) this.update({});
    },

    remove: function () {
        if (this.mixer) this.mixer.stopAllAction();
    },

    update: function (prevData) {
        if (!prevData) return;

        const data = this.data;
        const changes = AFRAME.utils.diff(data, prevData);

        // If selected clips have changed, restart animation.
        if ('clip' in changes) {
            this.stopAction();
            if (data.clip) this.playAction();
            return;
        }

        // Otherwise, modify running actions.
        this.activeActions.forEach((action) => {
            if ('duration' in changes && data.duration) {
                action.setDuration(data.duration);
            }
            if ('clampWhenFinished' in changes) {
                action.clampWhenFinished = data.clampWhenFinished;
            }
            if ('loop' in changes || 'repetitions' in changes) {
                action.setLoop(LoopMode[data.loop], data.repetitions);
            }
            if ('timeScale' in changes) {
                action.setEffectiveTimeScale(data.timeScale);
            }
        });
    },

    stopAction: function () {
        const data = this.data;
        for (let i = 0; i < this.activeActions.length; i++) {
            data.crossFadeDuration
                ? this.activeActions[i].fadeOut(data.crossFadeDuration)
                : this.activeActions[i].stop();
        }
        this.activeActions.length = 0;
    },

    playAction: function () {
        if (!this.mixer) return;

        const model = this.model,
            data = this.data,
            clips = model.animations || (model.geometry || {}).animations || [];

        if (!clips.length) return;

        const re = wildcardToRegExp(data.clip);

        for (let clip, i = 0; (clip = clips[i]); i++) {
            if (clip.name.match(re)) {
                const action = this.mixer.clipAction(clip, model);
                action.enabled = true;
                action.clampWhenFinished = data.clampWhenFinished;
                if (data.duration) action.setDuration(data.duration);
                if (data.timeScale !== 1) action.setEffectiveTimeScale(data.timeScale);
                action
                    .setLoop(LoopMode[data.loop], data.repetitions)
                    .fadeIn(data.crossFadeDuration)
                    .play();
                this.activeActions.push(action);
            }
        }
    },

    tick: function (t, dt) {
        if (this.mixer && !isNaN(dt)) this.mixer.update(dt / 1000);
    }
});

/**
 * Creates a RegExp from the given string, converting asterisks to .* expressions,
 * and escaping all other characters.
 */
function wildcardToRegExp (s) {
    return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$');
}

/**
 * RegExp-escapes all characters in the given string.
 */
function regExpEscape (s) {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}


const StageComponent = props => {
    const {
        canvas,
        dragRef,
        isColorPicking,
        isFullScreen,
        isStarted,
        colorInfo,
        micIndicator,
        question,
        stageSize,
        useEditorDragStyle,
        onDeactivateColorPicker,
        onDoubleClick,
        onQuestionAnswered,
        ...boxProps
    } = props;

    const stageDimensions = getStageDimensions(stageSize, isFullScreen);

    return (
        <div>
            <Box
                className={classNames({
                    [styles.stageWrapper]: !isFullScreen,
                    [styles.stageWrapperOverlay]: isFullScreen,
                    [styles.withColorPicker]: !isFullScreen && isColorPicking
                })}
                style={{
                    minHeight: stageDimensions.height,
                    minWidth: stageDimensions.width
                }}
                onDoubleClick={onDoubleClick}
            >
                <Box
                    className={classNames(
                        styles.stage,
                        {[styles.stageOverlayContent]: isFullScreen}
                    )}
                    style={{
                        height: stageDimensions.height,
                        width: stageDimensions.width
                    }}
                >
                    <a-scene
                        id="scene"
                        shadow="type: pcfsoft"
                        embedded
                        renderer="
           antialias: true;
           colorManagement: true;
            "
                        fog="type: linear; color: #e0e0e0; near: 20; far: 100"
                    >
                        <a-entity
                            lerp="properties: light"
                            duration=".2"
                            id="directional-light" light="type: directional; color: #ffffff; castShadow: true; " position="10 13 10"></a-entity>
                        <a-entity light="type: hemisphere; groundColor: #444444; skyColor: #FFFFFF" castShadow position="0 20 0"></a-entity>
                        <a-entity position="0 0 3"
                                  rotation="0 0 0"
                                  look-controls
                                  wasd-controls="acceleration: 300"
                                  comment="add offset, also rotate 180 degs around y axis?"
                                  firebase-broadcast="components: position, rotation, scale"
                                  shadow="cast: true"
                        >
                            <a-entity gltf-model="src: url(https://bcjordan.com/aframe-play/lib/RobotExpressive.glb);"
                                      animation-mixer="clip: Running;"
                                      scale=".3 .3 .3"
                                      rotation="0 180 0"
                                      visible="false">
                            </a-entity>
                            <a-entity camera="fov: 45" position="0 .6 0"></a-entity>
                        </a-entity>
                        <a-entity position="0 0 0"
                                  rotation="0 0 0"
                                  scale=".3 .3 .3"
                                  id="test-robot"
                                  animation-mixer="clip: Wave;"
                                  gltf-model="src: url(https://bcjordan.com/aframe-play/lib/RobotExpressive.glb);"
                                  shadow="cast: true; receive: false;"
                                  lerp="properties: position, rotation, scale"
                                  duration="0.001"
                                  modify-materials="color: #4f2eff"
                        >
                        </a-entity>
                        <a-entity position="0 0 0">
                            <a-box position="-2 0.5 -1.8" rotation="0 45 0" color="#4CC3D9" shadow="cast: true"></a-box>
                            <a-sphere position="1 1.25 -5" radius="1.25" color="#EF2D5E" shadow="cast: true"></a-sphere>
                            <a-cylinder position="2 0.75 -1.6" radius="0.5" height="1.5" color="#FFC65D" shadow="cast: true"></a-cylinder>
                        </a-entity>
                        <a-plane position="0 0 -4" rotation="-90 0 0" width="20" height="20" color="#7BC8A4" shadow="receive: true"></a-plane>
                    </a-scene>
                    <DOMElementRenderer
                        domElement={canvas}
                        style={{
                            height: stageDimensions.height,
                            width: stageDimensions.width
                        }}
                        {...boxProps}
                    />
                </Box>
                {/*<Box className={styles.monitorWrapper}>*/}
                {/*</Box>*/}
                <Box className={styles.monitorWrapper}>
                    <MonitorList
                        draggable={useEditorDragStyle}
                        stageSize={stageDimensions}
                    />
                </Box>
                <Box className={styles.frameWrapper}>
                    <TargetHighlight
                        className={styles.frame}
                        stageHeight={stageDimensions.height}
                        stageWidth={stageDimensions.width}
                    />
                </Box>
                {isStarted ? null : (
                    <GreenFlagOverlay
                        className={styles.greenFlagOverlay}
                        wrapperClass={styles.greenFlagOverlayWrapper}
                    />
                )}
                {isColorPicking && colorInfo ? (
                    <Box className={styles.colorPickerWrapper}>
                        <Loupe colorInfo={colorInfo} />
                    </Box>
                ) : null}
                <div
                    className={styles.stageBottomWrapper}
                    style={{
                        width: stageDimensions.width,
                        height: stageDimensions.height,
                        left: '50%',
                        marginLeft: stageDimensions.width * -0.5
                    }}
                >
                    {micIndicator ? (
                        <MicIndicator
                            className={styles.micIndicator}
                            stageSize={stageDimensions}
                        />
                    ) : null}
                    {question === null ? null : (
                        <div
                            className={styles.questionWrapper}
                            style={{width: stageDimensions.width}}
                        >
                            <Question
                                question={question}
                                onQuestionAnswered={onQuestionAnswered}
                            />
                        </div>
                    )}
                </div>
                <canvas
                    className={styles.draggingSprite}
                    height={0}
                    ref={dragRef}
                    width={0}
                />
            </Box>
            {isColorPicking ? (
                <Box
                    className={styles.colorPickerBackground}
                    onClick={onDeactivateColorPicker}
                />
            ) : null}
        </div>
    );
};
StageComponent.propTypes = {
    canvas: PropTypes.instanceOf(Element).isRequired,
    colorInfo: Loupe.propTypes.colorInfo,
    dragRef: PropTypes.func,
    isColorPicking: PropTypes.bool,
    isFullScreen: PropTypes.bool.isRequired,
    isStarted: PropTypes.bool,
    micIndicator: PropTypes.bool,
    onDeactivateColorPicker: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onQuestionAnswered: PropTypes.func,
    question: PropTypes.string,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    useEditorDragStyle: PropTypes.bool
};
StageComponent.defaultProps = {
    dragRef: () => {}
};
export default StageComponent;
