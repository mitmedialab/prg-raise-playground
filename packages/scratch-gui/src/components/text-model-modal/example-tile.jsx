import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';
import bindAll from 'lodash.bindall';
import Box from '../box/box.jsx';
import CloseButton from '../close-button/close-button.jsx';

import styles from './model-modal.css';

class ExampleTile extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleDeleteExample',
            'componentDidUpdate'
        ]);
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
            Here is text
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

ExampleTile.propTypes = {
    text: PropTypes.string,
    onDeleteExample: PropTypes.func,
    closeButton: PropTypes.bool
};

export default ExampleTile;