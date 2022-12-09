import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import bindAll from 'lodash.bindall';
import Box from '../box/box.jsx';
import ImageTile from './image-tile.jsx';

import styles from './ml-modal.css';

class LabelTile extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleEditLabel',
            'handleDeleteLabel'
        ]);
    }
    handleEditLabel () {    //call props.onEditLabel with this label name
        this.props.onEditLabel(this.props.name);
    }
    handleDeleteLabel () {  //call props.onDeleteLabel with this label name
        this.props.onDeleteLabel(this.props.name);
    }

    render () {
        return (
            <Box className={styles.labelTile}>
                <Box className={styles.verticalLayout}>
                    <Box className={styles.labelTileHeader}>
                        <Box className={styles.labelTileName}>
                            {this.props.name+" ("+this.props.exampleCount+" examples)"}
                        </Box>
                        <button onClick={this.handleEditLabel}>Edit</button>
                        <button onClick={this.handleDeleteLabel}>Delete</button>
                    </Box>
                    <Box className={styles.examplePreview}>
                        {this.props.imageData[this.props.name].map(example => (
                            <Box className={styles.exampleImage} key={this.props.imageData[this.props.name].findIndex(obj => obj.data === example.data)}>
                                <ImageTile 
                                    image={example} 
                                    id={this.props.imageData[this.props.name].findIndex(obj => obj.data === example.data)} 
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
    name: PropTypes.string,
    onEditLabel: PropTypes.func,
    onDeleteLabel: PropTypes.func,
    imageData: PropTypes.object,
    exampleCount: PropTypes.number
};

export default LabelTile;