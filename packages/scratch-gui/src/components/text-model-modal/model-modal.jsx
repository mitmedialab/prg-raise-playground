import PropTypes from 'prop-types';
import React from 'react';
import keyMirror from 'keymirror';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import ModelEditor from './model-editor.jsx';

import styles from './model-modal.css';

const PHASES = keyMirror({
    modelEditor: null,
    labelEditor: null
});

const TextModelModalComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel="Text Model Modal"
        headerClassName={styles.header}
        headerImage={props.connectionSmallIconURL}
        id="textModelModal"
        onHelp={props.onHelp}
        onRequestClose={props.onCancel}
    >
        <Box className={styles.body}>
            <ModelEditor 
                onAddLabel={props.onAddLabel} 
                onCancel={props.onCancel}
                onClearAll={props.onClearAll}
                onDeleteLabel={props.onDeleteLabel}
                onEditLabel={props.onEditLabel}
                classifierData={props.classifierData}
                imageData={props.imageData} />
        </Box>
    </Modal>
);

TextModelModalComponent.propTypes = {
    name: PropTypes.node,
    onCancel: PropTypes.func.isRequired,
    onHelp: PropTypes.func.isRequired,
    phase: PropTypes.oneOf(Object.keys(PHASES)).isRequired
};

export {
    TextModelModalComponent as default,
    PHASES
};