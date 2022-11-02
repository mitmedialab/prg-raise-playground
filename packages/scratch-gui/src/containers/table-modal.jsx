import PropTypes from 'prop-types';
import React from 'react';
import bindAll from 'lodash.bindall';
import TableNameComponent from '../components/table-modal/table-modal.jsx';
import {connect} from 'react-redux';
import {closeTableModal} from '../reducers/modals';
import VM from 'scratch-vm';

class TableName extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOk',
            'handleCancel',
            'handleChange',
            'handleRowsChange',
            'handleColumnsChange'
        ]);
        this.state = {
            inputValue: '',
            rows: 1,
            columns: 1
        };
    }
    handleFocus (event) {
        event.target.select();
    }
    handleOk () {
        this.props.vm.runtime.emit('NEW_TABLE', {
            name: this.state.inputValue,
            rows: this.state.rows,
            columns: this.state.columns
        });
        this.props.onCancel();
    }
    handleCancel () {
        this.props.onCancel();
    }
    handleChange (e) {
        this.setState({inputValue: e.target.value});
    }
    handleRowsChange (e) {
        this.setState({rows: e.target.value});
    }
    handleColumnsChange (e) {
        this.setState({columns: e.target.value});
    }
    render () {
        return (
            <TableNameComponent
                defaultValue={"new-table"}
                onCancel={this.handleCancel}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onOk={this.handleOk}
                onRowsChange={this.handleRowsChange}
                onColumnsChange={this.handleColumnsChange}
            />
        );
    }
}

TableName.propTypes = {
    onCancel: PropTypes.func.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onCancel: () => {
        dispatch(closeTableModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TableName);
