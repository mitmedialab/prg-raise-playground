import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import ModelEditor from './model-editor.jsx';

import styles from './model-modal.css';

const TextModelModalComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel="Edit Text Model"
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
                onDoneEditLabel={props.onDoneEditLabel}
                onDeleteExample={props.onDeleteExample}
                onRenameLabel={props.onRenameLabel}
                onNewExamples={props.onNewExamples}
                classifierData={props.classifierData}
                textData={props.textData}
                activeLabel={props.activeLabel} />
        </Box>
    </Modal>
);

TextModelModalComponent.propTypes = {
    name: PropTypes.node,
    onCancel: PropTypes.func.isRequired,
    onHelp: PropTypes.func.isRequired
};

export {
    TextModelModalComponent as default
};