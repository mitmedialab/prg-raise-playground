import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import LabelTile from './label-tile.jsx';
import Dots from './dots.jsx';

import radarIcon from './icons/searching.png';
import refreshIcon from './icons/refresh.svg';

import styles from './ml-modal.css';

const ModelEditor = props => (
    <Box className={styles.body}>
        <Box className={styles.activityArea}>
            <div className={styles.labelTilePane}>
                {Object.keys(props.imageData).map(label => (    //create column of label tiles
                    <LabelTile
                        name={label}
                        key={label}
                        exampleCount={props.classifierData[label].length}
                        onEditLabel={props.onEditLabel}
                        onDeleteLabel={props.onDeleteLabel}
                        imageData={props.imageData}
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
    onEditLabel: PropTypes.func,
    classifierData: PropTypes.object,
    imageData: PropTypes.object
};

export default ModelEditor;