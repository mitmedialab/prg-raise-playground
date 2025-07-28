import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import bindAll from 'lodash.bindall';
import Box from '../box/box.jsx';
import CloseButton from '../close-button/close-button.jsx';

import styles from './ml-modal.css';

class ImageTile extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setCanvas',
            'handleDeleteExample',
            'componentDidUpdate'
        ]);
    }
    setCanvas (canvas) {    //set up the canvas to display an image on this image tile
        this.canvas = canvas;
        if (this.canvas) {
            const ctx = this.canvas.getContext('2d');
            ctx.putImageData(this.props.image, 0, 0);
        }
    }
    componentDidUpdate () {
        this.setCanvas(this.canvas);
    }
    handleDeleteExample () {
        this.props.onDeleteExample(this.props.id);
    }


    render () {
        return (
            <div className={styles.canvas}>
                <canvas
                    height="360"
                    className={styles.canvas}
                    ref={this.setCanvas}
                    width="480"
                />
                {this.props.closeButton ?
                    <CloseButton
                        className={styles.deleteButton}
                        size={CloseButton.SIZE_SMALL}
                        onClick={this.handleDeleteExample}
                    />
                : <div></div>}
            </div>
        );
    }
}

ImageTile.propTypes = {
    image: PropTypes.instanceOf(ImageData),
    onDeleteExample: PropTypes.func,
    closeButton: PropTypes.bool
};

export default ImageTile;