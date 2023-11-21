import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import recordIcon from './icon--record-new.svg';
import stopIcon from './icon--record-stop.svg';
import styles from './record-button.css';

const RecordComponent = function (props) {
    const {
        active,
        className,
        onClick,
        title,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.recording,
                {
                    [styles.isActive]: active
                }
            )}
            draggable={false}
            src={active ? stopIcon : recordIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};

RecordComponent.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

RecordComponent.defaultProps = {
    active: false,
    title: 'Record'
};

export default RecordComponent;
