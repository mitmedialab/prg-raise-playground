import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import LabelTile from './label-tile.jsx';
import Dots from './dots.jsx';

import bindAll from 'lodash.bindall';

import radarIcon from './icons/searching.png';
import refreshIcon from './icons/refresh.svg';

import styles from './ml-modal.css';

import ModalVideoManager from '../../lib/video/modal-video-manager.js';

class ExampleEditor extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleGoBack',
            'setCanvas',
            'handleLoaded',
            'handleAccess',
            'handleNewExample',
            'countdown',
            'createNewExamples',
            'takePicture'
        ]);
        this.state = {
            trainInfo: "Press Train when you're ready!",
            intervalHandler: null,
            loaded: false,
            access: false,
            training: false,
            newExamples: []
        };
        this.loadedText = "";
        this.loadingText = "Loading Camera...";
    }
    componentWillUnmount () {
        clearInterval(this.state.intervalHandler);
        this.videoDevice.disableVideo();
    }
    handleGoBack () {    //go back to the previous screen (which might be the model editor or the label editor, depending on whether or not this is a new label)
        this.videoDevice.disableVideo();
        this.props.activeLabel in this.props.imageData ? 
            this.props.onEditLabel(this.props.activeLabel) :
            this.props.onEditModel();
    }
    setCanvas (canvas) {    //set up the video on the canvas
        this.canvas = canvas;
        if (this.canvas) {
            this.videoDevice = new ModalVideoManager(this.canvas);
            this.videoDevice.enableVideo(this.handleAccess, this.handleLoaded);
        }
    }
    handleLoaded () {
        this.setState ({
            loaded: true
        })
    }
    handleAccess () {
        this.setState ({
            access: true
        })
    }
    handleNewExample () {   //take a picture and call props.onNewExample with the new image data
        this.setState({trainInfo: 3, training: true, intervalHandler: setInterval(this.countdown, 1000)});
    }

    countdown () {
        if (this.state.trainInfo > 1) {
            this.setState({trainInfo: this.state.trainInfo - 1});
        } else {
            this.setState({trainInfo: "training..."});
            clearInterval(this.state.intervalHandler);
            this.createNewExamples();
        }
    }

    createNewExamples () {
        if (this.canvas) {
            this.setState({intervalHandler: setInterval(this.takePicture, 200)})
        }
    }

    takePicture () {
        const frame = this.videoDevice._videoProvider.getFrame({
            format: 'image-data'
        });
        if (frame) {
            this.setState({newExamples: this.state.newExamples.concat([frame])})
        }
        if (this.state.newExamples.length === 10) {
            clearInterval(this.state.intervalHandler);
            this.videoDevice.disableVideo();
            this.props.activeLabel in this.props.imageData ?
                this.props.onNewExamples(this.state.newExamples, false) :
                this.props.onNewExamples(this.state.newExamples, true);
        }
    }

    render () {
        return (
            <Box className={styles.body}>
                <Box className={styles.activityArea}>
                    <Box className={styles.verticalLayout}>
                        <Box className={styles.instructions}>
                            {this.state.trainInfo}
                        </Box>
                        <Box className={styles.canvasArea}>
                            <canvas
                                    height="720"
                                    className={styles.canvas}
                                    ref={this.setCanvas}
                                    width="960"
                            />
                            {this.state.access ?
                                <div className={classNames(styles.loadingCameraMessage)}>{this.state.loaded ? this.loadedText : this.loadingText}</div>
                                : <div className={classNames(styles.loadingCameraMessage)}>We need your permission to use your camera</div>}
                        </Box>
                    </Box>
                </Box>
                <Box className={classNames(styles.bottomArea)}>
                    {this.state.training ?
                        <Box className={classNames(styles.bottomAreaItem, styles.buttonRow)}></Box>
                        : <Box className={classNames(styles.bottomAreaItem, styles.buttonRow)}>
                            <button onClick={this.handleNewExample}>Train</button>
                            <button onClick={this.handleGoBack}>Back</button>
                        </Box>
                    }
                </Box>
            </Box>
        );
    }
}

ExampleEditor.propTypes = {
    onEditLabel: PropTypes.func,
    onEditModel: PropTypes.func,
    onNewExamples: PropTypes.func,
    activeLabel: PropTypes.string,
    imageData: PropTypes.object
};

export default ExampleEditor;