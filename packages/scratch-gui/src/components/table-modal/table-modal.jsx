import classNames from 'classnames';
import {defineMessages, FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import styles from './table-modal.css';


const TableNameComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={"Add a table"}
        id="tableNameModal"
        onRequestClose={props.onCancel}
    >
        <Box className={styles.body}>
            <Box className={styles.label}>
                {"Table Name"}
            </Box>
            <Box>
                <input
                    autoFocus
                    className={styles.variableNameTextInput}
                    defaultValue={props.defaultValue}
                    name={"Table Name"}
                    onChange={props.onChange}
                    onFocus={props.onFocus}
                />
                <div className={styles.numberInputGroup}>
                    <Box className={styles.label}>
                        {"Number of Rows"}
                    </Box>
                    <input
                        className={styles.numberInput}
                        defaultValue={1}
                        type={"number"}
                        min={"1"}
                        max={"100"}
                        name={"Number of Rows"}
                        onChange={props.onRowsChange}
                        onFocus={props.onFocus}
                    />
                </div>
                <div className={styles.numberInputGroup}>
                    <Box className={styles.label}>
                        {"Number of Columns"}
                    </Box>
                    <input
                        className={styles.numberInput}
                        defaultValue={1}
                        min={"1"}
                        type={"number"}
                        max={"100"}
                        name={"Number of Columns"}
                        onChange={props.onColumnsChange}
                        onFocus={props.onFocus}
                    />
                </div>
            </Box>
            <Box className={styles.buttonRow}>
                <button
                    className={styles.cancelButton}
                    onClick={props.onCancel}
                >
                    <FormattedMessage
                        defaultMessage="Cancel"
                        description="Button in prompt for cancelling the dialog"
                        id="gui.prompt.cancel"
                    />
                </button>
                <button
                    className={styles.okButton}
                    onClick={props.onOk}
                >
                    <FormattedMessage
                        defaultMessage="OK"
                        description="Button in prompt for confirming the dialog"
                        id="gui.prompt.ok"
                    />
                </button>
            </Box>
        </Box>
    </Modal>
);

TableNameComponent.propTypes = {
    defaultValue: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onRowsChange: PropTypes.func.isRequired,
    onColumnsChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

export default TableNameComponent;
