import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import bindAll from 'lodash.bindall';
import keyMirror from 'keymirror';

import Box from '../box/box.jsx';
import ExampleTile from './example-tile.jsx';

import styles from './model-modal.css';

class LabelTile extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleEditLabel'
        ]);
        this.state = {
            inputText: ""
        };
    }
    handleEditLabel () {    
        console.log("Text Model Modal: edit label " + this.props.labelName);
        this.props.onEditLabel(this.props.labelName);
    }


    render () {
        return (
            <Box className={styles.labelTile}>
                <Box className={styles.verticalLayout}>
                    <Box className={styles.labelTileHeader}>
                        <Box className={styles.exampleViewerText}>
                            {this.props.labelName}
                            {" ("+this.props.exampleCount+" examples)"}
                        </Box>
                        <button onClick={this.handleEditLabel}>Edit Label</button>
                    </Box>
                    <Box className={styles.exampleBox}>
                        {this.props.textData[this.props.labelName].map(example => (
                            <Box className={styles.exampleText} key={this.props.textData[this.props.labelName].indexOf(example)}>
                                <ExampleTile
                                    label={this.props.labelName}
                                    text={example} 
                                    id={this.props.textData[this.props.labelName].indexOf(example)} 
                                    closeButton={false}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        );
    }
}

LabelTile.propTypes = {
    labelName: PropTypes.string,
    onEditLabel: PropTypes.func,
    onNewExamples: PropTypes.func,
    textData: PropTypes.object,
    exampleCount: PropTypes.number
};

export default LabelTile;