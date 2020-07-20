import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import ClassifierModelEditor from './classifier-model-editor.jsx';

import styles from './classifier-model-modal.css';

const ClassifierModelModalComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel="Edit Classifier Model"
        headerClassName={styles.header}
        headerImage={props.connectionSmallIconURL}
        id="classifierModelModal"
        onHelp={props.onHelp}
        onRequestClose={props.onCancel}
    >
        <Box className={styles.body}>
            <ClassifierModelEditor 
                onCancel={props.onCancel}
                onFileUploader={props.onFileUploader}
                onAddLabel={props.onAddLabel} 
                onExport={props.onExport}
                classifierData={props.classifierData}
                textData={props.textData}
                activeLabel={props.activeLabel} />
        </Box>
    </Modal>
);

ClassifierModelModalComponent.propTypes = {
    name: PropTypes.node,
    onCancel: PropTypes.func.isRequired,
    onHelp: PropTypes.func.isRequired,
};

export {
    ClassifierModelModalComponent as default
};

