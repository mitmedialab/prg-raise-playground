import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import TextModelModalComponent from '../components/text-model-modal/model-modal.jsx';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {closeTextModelModal} from '../reducers/modals';

class TextModelModal extends React.Component {
    constructor (props) {
        console.log("Loading Text Model Modal");
        super(props);
        bindAll(this, [
            'handleAddLabel',
            'handleEditLabel',
            'handleDoneEditLabel',
            'handleRenameLabel',
            'handleDeleteLabel',
            'handleNewExamples',
            'handleDeleteExample',
            'handleDeleteLoadedExamples',
            'handleClearAll',
            'handleCancel',
            'handleHelp',
        ]);
        this.state = {
            textData: props.vm.runtime.modelData.textData,  //when the modal opens, get the model data and the next label number from the vm runtime
            nextLabelNumber: props.vm.runtime.modelData.nextLabelNumber,
            //classifiedData: props.vm.runtime.this.classifier.getClassifierDataset(),
            activeLabel: ""   //used by the label and example editors to keep track of the label currently being viewed/edited
        };
    }
    handleAddLabel () { //when a new label is first created, create a new active label and change to the example editor
        console.log("Text Model Modal: add a label");
        // Make a new label
        let newLabelName = "Class " + this.state.nextLabelNumber;
        this.props.vm.runtime.emit('NEW_LABEL', newLabelName);
        this.props.vm.runtime.modelData.nextLabelNumber++;
        this.setState({
            nextLabelNumber: this.props.vm.runtime.modelData.nextLabelNumber,
            activeLabel: newLabelName
        });
    }
    handleEditLabel (labelName) {   //change to label editor, set active label based on which label's "edit" button was pressed
        console.log("Text Model Modal: edit label " + labelName);
        this.setState({
            activeLabel: labelName
        });
    }
    handleDoneEditLabel (labelName) {   //change to label editor, set active label based on which label's "edit" button was pressed
        console.log("Text Model Modal: done editing label " + labelName);
        this.setState({
            activeLabel: ""
        });
    }
    handleRenameLabel (labelName, newLabelName) {   //rename a label: emit an event so the label changes in the vm, change active label accordingly, and reset model data with the new label name
        console.log("Text Model Modal: rename label " + labelName + " to " + newLabelName);
        this.props.vm.runtime.emit('RENAME_LABEL', labelName, newLabelName);
        this.setState({
            activeLabel: newLabelName
        });
    }
    handleDeleteLabel (labelName) { //delete a label: emit an event so the label is deleted in the vm, reset model data without the deleted label
        console.log("Text Model Modal: delete label " + labelName);
        this.props.vm.runtime.emit('DELETE_LABEL', labelName);
        this.setState({});
    }
    handleNewExamples (labelNum, examples) {    //add new examples: emit an event so the example is added in the vm, switch back to label editor, reset model data with the new example
        console.log("Text Model Modal: add examples from a new label")
        this.props.vm.runtime.emit('NEW_EXAMPLES', examples, labelNum);
        this.setState({ });
    }
    handleDeleteExample (labelName, exampleNum) {
        console.log("Text Model Modal: delete " + exampleNum + " from label " + labelName);
        this.props.vm.runtime.emit('DELETE_EXAMPLE', labelName, exampleNum);
        this.setState({ });
    }
    handleDeleteLoadedExamples () {
        console.log("Text Model Modal: delete examples")
        this.props.vm.runtime.emit('DELETE_LOADED_EXAMPLES', labelName);
    }
    handleClearAll () { //clear all labels/examples: emit an event so the data is cleared in the vm, reset model data to be empty
        console.log("Text Model Modal: clear all labels")
        this.props.vm.runtime.emit('CLEAR_ALL_LABELS');
        this.setState({ });
    }
    handleCancel () {   //when modal closed, store the next label number in the runtime for later, then call props.onCancel() to close the modal
        console.log("Text Model Modal: handle cancel")
        this.props.vm.runtime.modelDatanextLabelNumber = this.state.nextLabelNumber;
        this.setState({
            activeLabel: ""
        });
        this.props.onCancel();
    }
    handleHelp () { //TODO?
        console.log("Text Model Modal: Help requested");
        //window.open(link, '_blank');
    }
    render () {
        return (
            <TextModelModalComponent
                vm={this.props.vm}
                onCancel={this.handleCancel}
                onHelp={this.handleHelp}
                onEditModel={this.handleEditModel}
                onAddLabel={this.handleAddLabel}
                onEditLabel={this.handleEditLabel}
                onDoneEditLabel={this.handleDoneEditLabel}
                onRenameLabel={this.handleRenameLabel}
                onDeleteLabel={this.handleDeleteLabel}
                onNewExamples={this.handleNewExamples}
                onDeleteExample={this.handleDeleteExample}
                onDeleteLoadedExamples={this.handleDeleteLoadedExamples}
                onClearAll={this.handleClearAll}
                textData={this.state.textData}
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