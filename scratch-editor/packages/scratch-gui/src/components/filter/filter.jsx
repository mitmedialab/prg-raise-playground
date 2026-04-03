import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useCallback, useRef} from 'react';

import filterIcon from './icon--filter.svg';
import xIcon from './icon--x.svg';
import styles from './filter.css';
import {defineMessage, useIntl} from 'react-intl';

const ariaLabel = defineMessage({
    id: 'gui.aria.clearButton',
    defaultMessage: 'Clear',
    description: 'ARIA label for the clear input button'
});

const FilterComponent = props => {
    const {
        className,
        onChange,
        onClear,
        placeholderText,
        filterQuery,
        inputClassName
    } = props;
    const intl = useIntl();
    const inputRef = useRef(null);

    const handleClear = useCallback(e => {
        onClear(e);

        // Return focus to the input after clearing
        if (inputRef?.current) {
            inputRef.current.focus();
        }
    }, [onClear]);

    return (
        <div
            className={classNames(className, styles.filter, {
                [styles.isActive]: filterQuery.length > 0
            })}
        >
            <img
                className={styles.filterIcon}
                src={filterIcon}
            />
            <input
                ref={inputRef}
                className={classNames(styles.filterInput, inputClassName)}
                placeholder={placeholderText}
                type="text"
                value={filterQuery}
                onChange={onChange}
            />
            <button
                type="button"
                className={styles.xIconWrapper}
                onClick={handleClear}
                aria-label={intl.formatMessage(ariaLabel)}
                // Make x button focusable only when visible
                tabIndex={filterQuery.length > 0 ? 0 : -1}
            >
                <img
                    className={styles.xIcon}
                    src={xIcon}
                />
            </button>
        </div>
    );
};

FilterComponent.propTypes = {
    className: PropTypes.string,
    filterQuery: PropTypes.string,
    inputClassName: PropTypes.string,
    onChange: PropTypes.func,
    onClear: PropTypes.func,
    placeholderText: PropTypes.string
};
FilterComponent.defaultProps = {
    placeholderText: 'Search'
};
export default FilterComponent;
