import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import bindAll from 'lodash.bindall';
import keyMirror from 'keymirror';

import Box from '../box/box.jsx';
import ExampleTile from './example-tile.jsx';

import styles from './classifier-model-modal.css';

class EditLabelTile extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleRenameLabel',
            'handleDeleteLabel',
            'handleNewExample',
            'handleInputForNewExample',
            'handleDoneEditLabel'
        ]);
        this.state = {
            inputText: ""
        };
    }
    handleDoneEditLabel () {    
        console.log("Text Model Modal: done editing label " + this.props.labelName);
        this.props.onDoneEditLabel(this.props.labelName);
    }
    handleRenameLabel (input) { //call props.onRenameLabel with the current active label and the value in the input field
        if (this.props.labelName !== input.target.value) {
            this.props.onRenameLabel(this.props.labelName, input.target.value);
        }
    }
    handleDeleteLabel () {  //call props.onDeleteLabel with this label name
        this.props.onDeleteLabel(this.props.labelName);
    }
    handleNewExample () {  //call props.onAddExample
        let newExample = this.state.inputText;
        if (newExample != undefined && newExample != '') {
            this.props.onNewExamples(this.props.labelName, [newExample]);
        }
    }
    handleInputForNewExample (input) {  //call props.onAddExample
        this.setState({
            inputText: input.target.value
        });
        
    }

    render () {
        return (
            <Box className={styles.labelTile}>
                <Box className={styles.verticalLayout}>
                    <Box className={styles.labelTileHeader}>
                        <Box className={styles.exampleViewerText}>
                            <input type="text" className={styles.inputField} defaultValue={this.props.labelName} onBlur={this.handleRenameLabel}/>
                            {" ("+this.props.exampleCount+" examples)"}
                        </Box>
                        <button onClick={this.handleDoneEditLabel}>Done Editing</button>
                        <button onClick={this.handleDeleteLabel}>Delete Label</button>
                    </Box>
                    <Box className={styles.exampleBox}>
                        {this.props.textData[this.props.labelName].map(example => (
                            <Box className={styles.exampleText} key={this.props.textData[this.props.labelName].indexOf(example)}>
                                <ExampleTile
                                    label={this.props.labelName}
                                    text={example} 
                                    id={this.props.textData[this.props.labelName].indexOf(example)} 
                                    closeButton={true}  // RANDI make this true?                                    
                                    onDeleteExample={this.props.onDeleteExample}
                                />
                            </Box>
                        ))}
                    </Box>
                    <Box className={styles.labelTileFooter}>
                        <Box className={styles.addExampleRow}>
                            <input type="text" className={styles.inputField} onBlur={this.handleInputForNewExample}/>
                            <button onClick={this.handleNewExample}>Add Example</button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }
}

EditLabelTile.propTypes = {
    labelName: PropTypes.string,
    onRenameLabel: PropTypes.func,
    onDeleteExample: PropTypes.func,
    onDeleteLabel: PropTypes.func,
    onNewExamples: PropTypes.func,
    onDoneEditLabel: PropTypes.func,
    textData: PropTypes.object,
    exampleCount: PropTypes.number
};

export default EditLabelTile;