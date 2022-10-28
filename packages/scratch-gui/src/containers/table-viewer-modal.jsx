import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import TableViewerModalComponent from '../components/table-viewer-modal/table-viewer-modal.jsx';
import {connect} from 'react-redux';
import {closeTableViewerModal} from '../reducers/modals';
import VM from 'scratch-vm';

class TableViewerModal extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOk',
            'handleCancel',
            'handleChangeTable',
            'handleChangeValue',
        ]);
        let currentTableName = Object.keys(props.vm.runtime.tables)[0];
        this.state = {
            activeTableName: currentTableName,
            activeTable: props.vm.runtime.tables[currentTableName]
        };
    }
    handleFocus (e) {
        e.target.focus();
    }
    handleOk () {
        this.props.onCancel();
    }
    handleCancel () {
        this.props.onCancel();
    }
    handleChangeTable (e) {
        this.setState({
            activeTableName: e.target.value,
            activeTable: this.props.vm.runtime.tables[e.target.value]
        });
    }
    handleChangeValue (e) {
        let tableInfo = {
            tableName: e.target.dataset.tablename,
            row: parseInt(e.target.dataset.row),
            column: parseInt(e.target.dataset.col),
            newValue: parseInt(e.target.value)
        };
        this.props.vm.runtime.emit('CHANGE_TABLE_VALUE', tableInfo);
        this.setState({
            activeTable: this.props.vm.runtime.tables[tableInfo.tableName]
        });
    }
    render () {
        return (
            <TableViewerModalComponent
                tableNameValue={this.state.activeTableName}
                tableValue={this.state.activeTable}
                tableNameList={Object.keys(this.props.vm.runtime.tables)}
                onCancel={this.handleCancel}
                onChangeTable={this.handleChangeTable}
                onChangeValue={this.handleChangeValue}
                onFocus={this.handleFocus}
                onOk={this.handleOk}
            />
        );
    }
}

TableViewerModal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onCancel: () => {
        dispatch(closeTableViewerModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TableViewerModal);
