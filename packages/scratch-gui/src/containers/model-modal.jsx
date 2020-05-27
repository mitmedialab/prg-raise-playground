import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import TextModelModalComponent, {PHASES} from '../components/text-model-modal/model-modal.jsx';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {closeTextModelModal} from '../reducers/modals';

class TextModelModal extends React.Component {
    constructor (props) {
        console.log("Loading Text Model Modal");
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
            phase: PHASES.modelEditor,
            imageData: props.vm.runtime.modelData.textData,  //when the modal opens, get the model data and the next label number from the vm runtime
            nextLabelNumber: props.vm.runtime.modelData.nextLabelNumber,
            activeLabel: "Label " + props.vm.runtime.modelData.nextLabelNumber   //used by the label and example editors to keep track of the label currently being viewed/edited
        };
    }
    handleEditModel () {    //change to model editor
        console.log("Text Model Modal: edit model");
        this.setState({
            phase: PHASES.modelEditor
        });
    }
    handleAddLabel () { //when a new label is first created, create a new active label and change to the example editor
        console.log("Text Model Modal: add a label");
        // TODO make a new editable label tile
        this.setState({
            activeLabel: "Label " + this.state.nextLabelNumber
            //phase: PHASES.exampleEditor
        });
    }
    handleEditLabel (labelName) {   //change to label editor, set active label based on which label's "edit" button was pressed
        console.log("Text Model Modal: edit label " + labelName);
        this.setState({
            // TODO make the label an editable tile
            activeLabel: labelName
            //phase: PHASES.labelEditor
        });
    }
    handleRenameLabel (labelName, newLabelName) {   //rename a label: emit an event so the label changes in the vm, change active label accordingly, and reset model data with the new label name
        console.log("Text Model Modal: rename label " + labelName + " to " + newLabelName);
        this.props.vm.runtime.emit('RENAME_LABEL', labelName, newLabelName);
        this.setState({
            activeLabel: newLabelName
            // imageData: this.props.vm.runtime.modelData.imageData,
            //classifierData: this.props.vm.runtime.modelData.classifierData,
        });
    }
    handleDeleteLabel (labelName) { //delete a label: emit an event so the label is deleted in the vm, reset model data without the deleted label
        console.log("Text Model Modal: delete label " + labelName);
        this.props.vm.runtime.emit('DELETE_LABEL', labelName);
        this.setState({
            //imageData: this.props.vm.runtime.modelData.imageData
        });
    }
    handleAddExamples () {  // RANDI might not need this anymore
        console.log("Text Model Modal: add examples");
        this.setState({
            //phase: PHASES.exampleEditor
        });
    }
    handleNewExamples (examples, incrementLabelNum) {    //add new examples: emit an event so the example is added in the vm, switch back to label editor, reset model data with the new example
        console.log("Text Model Modal: add examples from a new label")
        this.props.vm.runtime.emit('NEW_EXAMPLES', examples, this.state.activeLabel);
        if (incrementLabelNum) {
            this.props.vm.runtime.modelData.nextLabelNumber++;
        }
        this.setState({
            nextLabelNumber: incrementLabelNum ? ++this.state.nextLabelNumber : this.state.nextLabelNumber
            //imageData: this.props.vm.runtime.modelData.imageData,
            //phase: PHASES.labelEditor
        });
    }
    handleDeleteExample (exampleNum) {
        console.log("Text Model Modal: delete a particular example")
        this.props.vm.runtime.emit('DELETE_EXAMPLE', this.state.activeLabel, exampleNum);
        this.setState({
            //imageData: this.props.vm.runtime.modelData.imageData
        })
    }
    handleDeleteLoadedExamples () {
        console.log("Text Model Modal: delete examples")
        this.props.vm.runtime.emit('DELETE_LOADED_EXAMPLES', this.state.activeLabel);
        this.setState({
            //imageData: this.props.vm.runtime.modelData.imageData
        })
    }
    handleClearAll () { //clear all labels/examples: emit an event so the data is cleared in the vm, reset model data to be empty
        console.log("Text Model Modal: clear all labels")
        this.props.vm.runtime.emit('CLEAR_ALL_LABELS');
        this.setState({
            //imageData: this.props.vm.runtime.modelData.imageData
        })
    }
    handleCancel () {   //when modal closed, store the next label number in the runtime for later, then call props.onCancel() to close the modal
        console.log("Text Model Modal: handle cancel")
        this.props.vm.runtime.modelDatanextLabelNumber = this.state.nextLabelNumber;
        this.props.onCancel();
    }
    handleHelp () { //TODO?
        console.log("Text Modael Modal: Help requested");
        //window.open(link, '_blank');
    }
    render () {
        return (
            <TextModelModalComponent
                phase={this.state.phase}
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

TextModelModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onCancel: () => {
        dispatch(closeTextModelModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TextModelModal);