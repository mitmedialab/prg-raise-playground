import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import SvelteComponent from "../../svelte/Modal.svelte";
import Modal from '../../containers/modal.jsx';
import bindAll from 'lodash.bindall';
import {closeProgrammaticModal} from '../../reducers/modals.js';
import styles from './programmatic-modal.css';

class ProgrammaticModal extends Component {  
    constructor (props) {
        super(props);
        this.divRef = null;
        bindAll(this, 'setRef', 'componentWillUnmount');
        this.style = {
            width: 100
        }
    }

    componentWillUnmount() {
        this.component?.$destroy();
    }

    setRef(node) {
        if (this.divRef !== null) return;
        const {id, name, component, label, vm, onCancel} = this.props;
        this.divRef = node;
        this.component = new SvelteComponent({
            target: this.divRef,
            props: {id, name, component, label, vm, close: onCancel}
        });
    }
    
    render () {
        const {name, onCancel, id, component, label} = this.props;
        return (
            <Modal id={`${id}-${component}`} onRequestClose={onCancel} contentLabel={label ?? name} className={styles.modalContent}>
                <div ref={this.setRef}></div>
            </Modal>
        );
    }
}

ProgrammaticModal.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired,
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    onCancel: () => {
        dispatch(closeProgrammaticModal());
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProgrammaticModal);