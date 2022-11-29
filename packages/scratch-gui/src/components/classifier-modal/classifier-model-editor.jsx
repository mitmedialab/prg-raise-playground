import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import keyMirror from 'keymirror';

import Box from '../box/box.jsx';
import LabelTile from './label-tile.jsx';
import EditLabelTile from './label-editor.jsx';
import Dots from './dots.jsx';

import styles from './classifier-model-modal.css';

const ClassifierModelEditor = props => (
    <Box className={styles.body}>
        <Box className={classNames(styles.bottomArea)}>
            <Box className={classNames(styles.bottomAreaItem, styles.buttonRow)}>
                <button onClick={props.onExport}>Export Classifier</button>
                <button onClick={props.onFileUploader}>Import Classifier
                    <input type="file" id="imported-classifier" accept=".json"></input>
                </button> 
                <button onClick={props.onCancel}>Done</button>
            </Box>
        </Box>
    </Box>
);

ClassifierModelEditor.propTypes = {
    onCancel: PropTypes.func,
    onFileUploader: PropTypes.func,
    onAddLabel: PropTypes.func,
    onExport: PropTypes.func,
    classifierData: PropTypes.object,
    activeLabel: PropTypes.string
};

export default ClassifierModelEditor;

