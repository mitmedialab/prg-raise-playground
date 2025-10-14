import animationUtilities from '../src/index.js';

const { visualize, JiboConfig, RobotInfo, THREE } = animationUtilities;

let robotRenderer = null;
let robotInfo = null;

function updateStatus(message) {
    const statusElement = document.getElementById('status-text');
    if (statusElement) {
        statusElement.textContent = message;
    }
    console.log('Demo Status:', message);
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
                    
                    const dofValues = robotInfo.getDefaultDOFValues();
                    renderer.display(dofValues);
                    
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

async function initializeDemo() {
    try {
        updateStatus('Initializing...');
        
        await initializeJibo();
        await createRobotRenderer();
        
        updateStatus('Ready');
        
        document.querySelectorAll('button').forEach(button => {
            button.disabled = false;
        });
        
    } catch (error) {
        console.error('Initialization failed:', error);
        updateStatus('Initialization failed: ' + error.message);
    }
}

function animateEye() {
    if (robotRenderer) {
        const eyeAnimation = {
            'eyeSubRootBn_t': Math.random() * 0.04 - 0.02,  // Random eye movement
            'eyeSubRootBn_t_2': Math.random() * 0.02 - 0.01,
            'eye_redChannelBn_r': Math.random() * 0.5 + 0.5,    // Random eye color
            'eye_greenChannelBn_r': Math.random() * 0.5 + 0.5,
            'eye_blueChannelBn_r': Math.random() * 0.5 + 0.5,
            'eye_alphaChannelBn_r': 1.0
        };
        robotRenderer.display(eyeAnimation);
        updateStatus('Eye animation applied');
    }
}

function animateBody() {
    if (robotRenderer) {
        const bodyAnimation = {
            'bottomSection_r': Math.random() * Math.PI - Math.PI/2,
            'middleSection_r': Math.random() * 0.5 - 0.25,
            'topSection_r': Math.random() * 0.5 - 0.25
        };
        robotRenderer.display(bodyAnimation);
        updateStatus('Body animation applied');
    }
}

function resetPose() {
    if (robotRenderer && robotInfo) {
        const defaultPose = robotInfo.getDefaultDOFValues();
        
        // Ensure eye remains visible after reset by setting appropriate eye values
        const resetPose = {
            ...defaultPose,
            // Set eye colors to white/visible
            'eye_redChannelBn_r': 1.0,
            'eye_greenChannelBn_r': 1.0,
            'eye_blueChannelBn_r': 1.0,
            'eye_alphaChannelBn_r': 1.0,
            // Reset eye position to center
            'eyeSubRootBn_t': 0.0,
            'eyeSubRootBn_t_2': 0.0
        };
        
        robotRenderer.display(resetPose);
        updateStatus('Pose reset');
    }
}

window.animateEye = animateEye;
window.animateBody = animateBody;
window.resetPose = resetPose;

document.addEventListener('DOMContentLoaded', initializeDemo);

window.animationUtilities = animationUtilities;
window.robotInfo = robotInfo;
window.robotRenderer = robotRenderer; 