import animationUtilities from '../src/index.js';


const { visualize, JiboConfig, RobotInfo, TimelineBuilder, THREE, animate } = animationUtilities;


import AnimationLoader from '../src/ifr-motion/loaders/AnimationLoader.js';

// Global variables for our animation system
let robotRenderer = null;
let robotInfo = null;
let motionTimeline = null;
let animUtils = null;
let currentAnimationInstance = null;

function updateStatus(message) {
    const statusElement = document.getElementById('status-text');
    if (statusElement) {
        statusElement.textContent = message;
    }
    console.log('Full Animation Demo Status:', message);
}

async function initializeJibo() {
    try {
        updateStatus('Loading configuration...');
        const config = new JiboConfig();
        return new Promise((resolve, reject) => {
            RobotInfo.createInfo(config, (loadedRobotInfo) => {
                if (loadedRobotInfo) {
                    robotInfo = loadedRobotInfo;
                    updateStatus('Configuration loaded');
                    resolve(robotInfo);
                } else {
                    reject(new Error('Failed to load configuration'));
                }
            });
        });
        
    } catch (error) {
        updateStatus('Error: ' + error.message);
        throw error;
    }
}

function createRobotRenderer() {
    return new Promise((resolve, reject) => {
        updateStatus('Loading renderer...');
        
        const container = document.getElementById('robot-container');
        const loadingElement = container.querySelector('.loading');
        
        visualize.createRobotRenderer(
            robotInfo,
            container,
            visualize.DisplayType.BODY,
            (renderer) => {
                if (renderer) {
                    robotRenderer = renderer;
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                    }
                    
                    renderer.setBackgroundColor(0.2, 0.2, 0.2);
                    
                    if (renderer.scene && renderer.scene.setAutoResize) {
                        renderer.scene.setAutoResize(false);
                    }
                    
                    updateStatus('Renderer loaded');
                    resolve(renderer);
                } else {
                    const error = new Error('Failed to create renderer');
                    if (loadingElement) {
                        loadingElement.textContent = 'Failed to load';
                        loadingElement.style.color = '#999';
                    }
                    reject(error);
                }
            }
        );
    });
}

function createAnimationSystem() {
    return new Promise((resolve, reject) => {
        try {
            updateStatus('Creating animation system...');
            
            motionTimeline = TimelineBuilder.createTimeline(robotInfo, null, 30);
            
            TimelineBuilder.connectRenderer(motionTimeline, robotRenderer);
            
            animUtils = animate.createAnimationUtilities();
            animUtils.init(motionTimeline, robotInfo);
            
            
            updateStatus('Animation system ready');
            resolve();
            
        } catch (error) {
            reject(error);
        }
    });
}

function playAnimation(animPath) {
    if (!animUtils) {
        updateStatus('Error: Animation system not initialized');
        return;
    }
    
    if (currentAnimationInstance) {
        currentAnimationInstance.stop();
        currentAnimationInstance = null;
    }
    
    updateStatus(`Loading animation: ${animPath}`);
    console.log('Playing animation:', animPath);
    
    const fullAnimPath = `./animations/${animPath}`;
    
    animUtils.createAnimationBuilder(fullAnimPath, (builder) => {
        if (builder) {
            updateStatus(`Playing animation: ${animPath}`);
            
            builder.on(animate.AnimationEventType.STOPPED, (eventType, instance, payload) => {
                console.log(`Animation ${animPath} completed`);
                updateStatus('Animation completed');
                currentAnimationInstance = null;
            });
            
            builder.on(animate.AnimationEventType.CANCELLED, (eventType, instance, payload) => {
                console.log(`Animation ${animPath} cancelled`);
                updateStatus('Animation cancelled');
                currentAnimationInstance = null;
            });
            
            builder.on(animate.AnimationEventType.STARTED, (eventType, instance, payload) => {
                console.log(`Animation ${animPath} started`);
                updateStatus(`Playing animation: ${animPath}`);
            });
            
            currentAnimationInstance = builder.play();
            
        } else {
            updateStatus(`Failed to create animation builder for: ${animPath}`);
            console.error('Failed to create animation builder for:', animPath);
        }
    });
}

function playDefaultPose() {
    if (!animUtils) {
        updateStatus('Error: Animation system not initialized');
        return;
    }
    
    if (currentAnimationInstance) {
        currentAnimationInstance.stop();
        currentAnimationInstance = null;
    }
    
    updateStatus('Resetting to default pose...');
    
    if (robotRenderer && robotInfo) {
        const defaultPose = robotInfo.getDefaultDOFValues();
        
        const resetPose = {
            ...defaultPose,
            // Set eye colors to white/visible
            'eye_redChannelBn_r': 1.0,
            'eye_greenChannelBn_r': 1.0,
            'eye_blueChannelBn_r': 1.0,
            'eye_alphaChannelBn_r': 1.0,
            'eyeSubRootBn_t': 0.0,
            'eyeSubRootBn_t_2': 0.0
        };
        
        robotRenderer.display(resetPose);
        updateStatus('Default pose set');
    } else {
        updateStatus('Error: Renderer or robot info not available');
    }
}

function blink() {
    if (!animUtils) {
        updateStatus('Error: Animation system not initialized');
        return;
    }
    
    updateStatus('Blinking...');
    animUtils.blink();
}

function stopAnimation() {
    if (currentAnimationInstance) {
        currentAnimationInstance.stop();
        currentAnimationInstance = null;
        updateStatus('Animation stopped');
    } else {
        updateStatus('No animation playing');
    }
}

function testAnimationLoader() {
    updateStatus('Testing AnimationLoader...');
    
    const loader = new AnimationLoader();
    const testAnimPath = './animations/blinks/eye_quick_blink_01_01.anim';
    
    loader.load(testAnimPath, () => {
        const result = loader.getResult();
        if (result && result.success) {
            updateStatus('AnimationLoader test: SUCCESS');
            console.log('Loaded animation:', result.motion);
            console.log('Animation duration:', result.motion.getDuration());
            console.log('Animation tracks:', Object.keys(result.motion.getTracks()));
        } else {
            updateStatus('AnimationLoader test: FAILED');
            console.error('AnimationLoader failed:', result ? result.message : 'Unknown error');
        }
    });
}

async function initializeDemo() {
    try {
        updateStatus('Initializing full animation system...');
        
        await initializeJibo();
        await createRobotRenderer();
        await createAnimationSystem();
        
        updateStatus('Full animation system ready!');
        
        document.querySelectorAll('button').forEach(button => {
            button.disabled = false;
        });
        
        testAnimationLoader();
        
    } catch (error) {
        console.error('Initialization failed:', error);
        updateStatus('Initialization failed: ' + error.message);
    }
}

window.playAnimation = playAnimation;
window.playDefaultPose = playDefaultPose;
window.blink = blink;
window.stopAnimation = stopAnimation;
window.testAnimationLoader = testAnimationLoader;

document.addEventListener('DOMContentLoaded', initializeDemo);

window.animationUtilities = animationUtilities;
window.robotInfo = () => robotInfo;
window.robotRenderer = () => robotRenderer;
window.motionTimeline = () => motionTimeline;
window.animUtils = () => animUtils;