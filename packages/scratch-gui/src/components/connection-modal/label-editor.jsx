import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bindAll from 'lodash.bindall';

import Box from '../box/box.jsx';
import ImageTile from './image-tile.jsx';
import Dots from './dots.jsx';
import CloseButton from '../close-button/close-button.jsx';

import radarIcon from './icons/searching.png';
import refreshIcon from './icons/refresh.svg';

import styles from './ml-modal.css';

class LabelEditor extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleRenameLabel'
        ]);
    }
    handleRenameLabel (input) { //call props.onRenameLabel with the current active label and the value in the input field
        if (this.props.activeLabel !== input.target.value) {
            this.props.onRenameLabel(this.props.activeLabel, input.target.value);
        }
    }

    render () {
        return (
            <Box className={styles.body}>
                <Box className={styles.activityArea}>
                    <Box className={styles.verticalLayout}>
                        <Box className={styles.exampleViewerText}>
                            Label <input type="text" className={styles.inputField} defaultValue={this.props.activeLabel} onBlur={this.handleRenameLabel}/> {"("+this.props.classifierData[this.props.activeLabel].length+" examples)"}
                        </Box>
                        <Box className={styles.exampleViewerImageContainer}>
                            {this.props.classifierData[this.props.activeLabel].length !== this.props.imageData[this.props.activeLabel].length ?
                                <Box className={styles.loadedExamplesBox}>
                                    <CloseButton
                                        className={styles.deleteButton}
                                        size={CloseButton.SIZE_SMALL}
                                        onClick={this.props.onDeleteLoadedExamples}
                                    />
                                    {this.props.classifierData[this.props.activeLabel].length-this.props.imageData[this.props.activeLabel].length} examples loaded from file
                                </Box>
                                : <div></div>
                            }
                            {this.props.imageData[this.props.activeLabel].map(example => (
                                <Box className={styles.exampleImage} key={this.props.imageData[this.props.activeLabel].findIndex(obj => obj.data === example.data)}>
                                    <ImageTile 
                                        image={example} 
                                        id={this.props.imageData[this.props.activeLabel].findIndex(obj => obj.data === example.data)} 
                                        closeButton={true} 
                                        onDeleteExample={this.props.onDeleteExample}
                                    />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Box>
                <Box className={classNames(styles.bottomArea)}>
                    <Box className={classNames(styles.bottomAreaItem, styles.buttonRow)}>
                        <button onClick={this.props.onAddExamples}>Add Examples</button>
                        <button onClick={this.props.onEditModel}>Done</button>
                    </Box>
                </Box>
            </Box>
        );
    }
}

LabelEditor.propTypes = {
    onAddExamples: PropTypes.func,
    onDeleteExample: PropTypes.func,
    onDeleteLoadedExamples: PropTypes.func,
    onEditModel: PropTypes.func,
    onRenameLabel: PropTypes.func,
    activeLabel: PropTypes.string,
    classifierData: PropTypes.object,
    imageData: PropTypes.object
};

export default LabelEditor;