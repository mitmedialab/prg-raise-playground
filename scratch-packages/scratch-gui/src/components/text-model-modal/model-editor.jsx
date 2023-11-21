import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import keyMirror from 'keymirror';

import Box from '../box/box.jsx';
import LabelTile from './label-tile.jsx';
import EditLabelTile from './label-editor.jsx';
import Dots from './dots.jsx';

import styles from './model-modal.css';

const ModelEditor = props => (
    <Box className={styles.body}>
        <Box className={styles.activityArea}>
            <div className={styles.labelTilePane}>
                {Object.keys(props.textData).map(label => (    //create column of label tiles
                    label === props.activeLabel ? <EditLabelTile
                        labelName={label}
                        key={label}
                        exampleCount={props.classifierData[label].length}
                        onDoneEditLabel={props.onDoneEditLabel}
                        onRenameLabel={props.onRenameLabel}                    
                        onDeleteExample={props.onDeleteExample}
                        onDeleteLabel={props.onDeleteLabel}
                        onNewExamples={props.onNewExamples}
                        textData={props.textData}
                    />
                    : <LabelTile
                        labelName={label}
                        key={label}
                        exampleCount={props.classifierData[label].length}
                        onEditLabel={props.onEditLabel}
                        textData={props.textData}
                    />
                ))}
            </div>
        </Box>
        <Box className={classNames(styles.bottomArea)}>
            <Box className={classNames(styles.bottomAreaItem, styles.buttonRow)}>
                <button onClick={props.onAddLabel}>Add a Label</button>
                <button onClick={props.onClearAll}>Clear All</button>
                <button onClick={props.onCancel}>Done</button>
            </Box>
        </Box>
    </Box>
);

ModelEditor.propTypes = {
    onAddLabel: PropTypes.func,
    onCancel: PropTypes.func,
    onClearAll: PropTypes.func,
    onDeleteLabel: PropTypes.func,
    onDeleteExample: PropTypes.func,
    onEditLabel: PropTypes.func,
    onDoneEditLabel: PropTypes.func,
    onRenameLabel: PropTypes.func,
    onNewExamples: PropTypes.func,
    classifierData: PropTypes.object,
    activeLabel: PropTypes.string
};

export default ModelEditor;