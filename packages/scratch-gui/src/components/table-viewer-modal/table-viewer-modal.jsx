import classNames from 'classnames';
import {defineMessages, FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Box from '../box/box.jsx';
import Modal from '../../containers/modal.jsx';

import styles from './table-viewer-modal.css';


const TableViewerModalComponent = props => (
    <Modal
        className={styles.modalContent}
        contentLabel={"View / Edit Table Values"}
        id="tableNameModal"
        onRequestClose={props.onCancel}
    >
        <Box className={styles.body}>
            <Box className={styles.label}>
                <label htmlFor={"table-list"}>{"Table List"}</label>
            </Box>
            <Box>
                <select
                    className={styles.tableListDropdown}
                    value={props.tableNameValue}
                    name={"table-list"}
                    id={"table-list"}
                    onChange={props.onChangeTable}
                    onFocus={props.onFocus}
                >
                {props.tableNameList.map((tableName, i) => {
                    return (
                        <option
                            className={styles.tableListItem}
                            value={tableName}
                            key={`${tableName}-${i}`}
                        >
                            {tableName}
                        </option>
                    )
                })}
                </select>
            </Box>
            <Box className={styles.tableBox}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th key={'blank'}>{''}</th>
                        {[...Array(props.tableValue[0].length)].map((x,i) =>
                            <th key={`col-${i+1}`}>{i+1}</th>
                        )}
                        </tr>
                    </thead>
                    <tbody>
                        {props.tableValue.map((row, i) =>
                            <tr key={`row-${i+1}`}>
                                <th key={`row-${i+1}-header`}>{i+1}</th>
                            {row.map((value, j) =>
                                <th key={`${i}-${j}`}>
                                    <input
                                        className={styles.tableValueInput}
                                        value={value}
                                        type={"number"}
                                        onChange={props.onChangeValue}
                                        onFocus={props.onFocus}
                                        data-tablename={props.tableNameValue}
                                        data-row={i}
                                        data-col={j}
                                    />
                                </th>
                            )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </Box>
            <Box className={styles.buttonRow}>
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

TableViewerModalComponent.propTypes = {
    tableNameValue: PropTypes.string,
    tableValue: PropTypes.array,
    tableNameList: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChangeTable: PropTypes.func.isRequired,
    onChangeValue: PropTypes.func.isRequired,
    onFocus: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

export default TableViewerModalComponent;
