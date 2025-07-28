import PropTypes from 'prop-types';
import React from 'react';
import keyMirror from 'keymirror';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import ModelEditor from './model-editor.jsx';
import LabelEditor from './label-editor.jsx';
import ExampleEditor from './example-editor.jsx';


import styles from './ml-modal.css';

const PHASES = keyMirror({
    modelEditor: null,
    labelEditor: null,
    exampleEditor: null
});

const ConnectionModalComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={props.name}
        headerClassName={styles.header}
        headerImage={props.connectionSmallIconURL}
        id="connectionModal"
        onHelp={props.onHelp}
        onRequestClose={props.onCancel}
    >
        <Box className={styles.body}>
            {props.phase === PHASES.modelEditor && <ModelEditor
            onAddLabel={props.onAddLabel}
            onCancel={props.onCancel}
            onClearAll={props.onClearAll}
            onDeleteLabel={props.onDeleteLabel}
            onEditLabel={props.onEditLabel}
            classifierData={props.classifierData} 
            imageData={props.imageData} />}

            {props.phase === PHASES.labelEditor && <LabelEditor
            onAddExamples={props.onAddExamples}
            onDeleteExample={props.onDeleteExample}
            onDeleteLoadedExamples={props.onDeleteLoadedExamples}
            onEditModel={props.onEditModel}
            onRenameLabel={props.onRenameLabel}
            activeLabel={props.activeLabel}
            classifierData={props.classifierData}
            imageData={props.imageData} />}

            {props.phase === PHASES.exampleEditor && <ExampleEditor
            onEditLabel={props.onEditLabel}
            onEditModel={props.onEditModel}
            onNewExamples={props.onNewExamples}
            activeLabel={props.activeLabel}
            imageData={props.imageData} />}

        </Box>
    </Modal>
);

ConnectionModalComponent.propTypes = {
    name: PropTypes.node,
    onCancel: PropTypes.func.isRequired,
    onHelp: PropTypes.func.isRequired,
    phase: PropTypes.oneOf(Object.keys(PHASES)).isRequired,
    title: PropTypes.string.isRequired,
};

export {
    ConnectionModalComponent as default,
    PHASES
};
