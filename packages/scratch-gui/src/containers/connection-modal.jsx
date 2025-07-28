import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import ConnectionModalComponent, {PHASES} from '../components/connection-modal/connection-modal.jsx';
import VM from 'scratch-vm';
import analytics from '../lib/analytics';
import extensionData from '../lib/libraries/extensions/index.jsx';
import {connect} from 'react-redux';
import {closeConnectionModal} from '../reducers/modals';

class ConnectionModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleEditModel',
            'handleAddLabel',
            'handleEditLabel',
            'handleRenameLabel',
            'handleDeleteLabel',
            'handleAddExamples',
            'handleNewExamples',
            'handleDeleteExample',
            'handleDeleteLoadedExamples',
            'handleClearAll',
            'handleCancel',
            'handleHelp'
        ]);
        this.state = {
            extension: extensionData.find(ext => ext.extensionId === props.extensionId),
            phase: Object.keys(props.vm.runtime.modelData.imageData).length === 0 ? PHASES.exampleEditor : PHASES.modelEditor,            
                imageData: props.vm.runtime.modelData.imageData,  //when the modal opens, get the model data and the next label number from the vm runtime
            nextLabelNumber: props.vm.runtime.modelData.nextLabelNumber,
            activeLabel: "Label " + props.vm.runtime.modelData.nextLabelNumber   //used by the label and example editors to keep track of the label currently being viewed/edited

        };
    }
    handleEditModel () {    //change to model editor        
        this.setState({           
        phase: PHASES.modelEditor
        });
    }
    handleAddLabel () { //when a new label is first created, create a new active label and change to the example editor        
        this.setState({            
        activeLabel: "Label " + this.state.nextLabelNumber,
            phase: PHASES.exampleEditor
        });
    }
    handleEditLabel (labelName) {   //change to label editor, set active label based on which label's "edit" button was pressed
        this.setState({
            phase: PHASES.labelEditor,
            activeLabel: labelName
        });
    }
    handleRenameLabel (labelName, newLabelName) {   //rename a label: emit an event so the label changes in the vm, change active label accordingly, and reset model data with the new label name	        
        this.props.vm.runtime.emit('RENAME_LABEL', labelName, newLabelName);
        this.setState({
            imageData: this.props.vm.runtime.modelData.imageData,
            classifierData: this.props.vm.runtime.modelData.classifierData,
            activeLabel: newLabelName
        });
    }
    handleDeleteLabel (labelName) { //delete a label: emit an event so the label is deleted in the vm, reset model data without the deleted label
        this.props.vm.runtime.emit('DELETE_LABEL', labelName);
        this.setState({
            imageData: this.props.vm.runtime.modelData.imageData
        });
    }
    handleAddExamples () {  //change to example editor
        this.setState({
            phase: PHASES.exampleEditor
        });    
    }
    handleNewExamples (examples, incrementLabelNum) {    //add new examples: emit an event so the example is added in the vm, switch back to label editor, reset model data with the new example
        this.props.vm.runtime.emit('NEW_EXAMPLES', examples, this.state.activeLabel);
        if (incrementLabelNum) {
            this.props.vm.runtime.modelData.nextLabelNumber++;
        }
        this.setState({
            nextLabelNumber: incrementLabelNum ? ++this.state.nextLabelNumber : this.state.nextLabelNumber,
            imageData: this.props.vm.runtime.modelData.imageData,
            phase: PHASES.labelEditor
        });
    }
    handleDeleteExample (exampleNum) {
        this.props.vm.runtime.emit('DELETE_EXAMPLE', this.state.activeLabel, exampleNum);
        this.setState({
            imageData: this.props.vm.runtime.modelData.imageData
        })
    }
    handleDeleteLoadedExamples () {
        this.props.vm.runtime.emit('DELETE_LOADED_EXAMPLES', this.state.activeLabel);
        this.setState({
            imageData: this.props.vm.runtime.modelData.imageData
        })
    }
    handleClearAll () { //clear all labels/examples: emit an event so the data is cleared in the vm, reset model data to be empty
        this.props.vm.runtime.emit('CLEAR_ALL_LABELS');
        this.setState({
            imageData: this.props.vm.runtime.modelData.imageData
        })
    }
    handleCancel () {   //when modal closed, store the next label number in the runtime for later, then call props.onCancel() to close the modal
        this.props.vm.runtime.modelDatanextLabelNumber = this.state.nextLabelNumber;
        this.props.onCancel();
    }
    handleHelp () {
        window.open(this.state.extension.helpLink, '_blank');
        analytics.event({
            category: 'extensions',
            action: 'help',
            label: this.props.extensionId
        });
    }
    render () {
        return (
            <ConnectionModalComponent
                extensionId={this.props.extensionId}
                name={this.state.extension && this.state.extension.name}
                phase={this.state.phase}
                title={this.props.extensionId}
                vm={this.props.vm}
                onCancel={this.handleCancel}
                onHelp={this.handleHelp}
                onEditModel={this.handleEditModel}
                onAddLabel={this.handleAddLabel}
                onEditLabel={this.handleEditLabel}
                onRenameLabel={this.handleRenameLabel}
                onDeleteLabel={this.handleDeleteLabel}
                onAddExamples={this.handleAddExamples}
                onNewExamples={this.handleNewExamples}
                onDeleteExample={this.handleDeleteExample}
                onDeleteLoadedExamples={this.handleDeleteLoadedExamples}
                onClearAll={this.handleClearAll}
                imageData={this.state.imageData}
                classifierData={this.props.vm.runtime.modelData.classifierData}
                nextLabelNumber={this.state.nextLabelNumber}
                activeLabel={this.state.activeLabel}
            />
        );
    }
}

ConnectionModal.propTypes = {
    extensionId: PropTypes.string.isRequired,
    onCancel: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
    extensionId: state.scratchGui.connectionModal.extensionId
});

const mapDispatchToProps = dispatch => ({
    onCancel: () => {
        dispatch(closeConnectionModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectionModal);
