import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {closeProgrammaticModal} from '../reducers/modals';
import Box from '../components/box/box.jsx';
import SvelteComponent from "../svelte/Modal.svelte";
import Modal from './modal.jsx';
import bindAll from 'lodash.bindall';

class ProgrammaticModal extends Component {  
    constructor (props) {
        super(props);
        this.divRef = null;
        bindAll(this, 'setRef', 'componentWillUnmount');
    }

    componentWillUnmount() {
        this.component?.$destroy();
    }

    setRef(node) {
        if (this.divRef !== null) return;
        const {id, name, component} = this.props;
        this.divRef = node;
        this.component = new SvelteComponent({
            target: this.divRef,
            props: {id, name, component}
        });
    }
    
    render () {
        const {name, onCancel, id, component} = this.props;
        return (
            <Modal id={`${id}-${component}`} onRequestClose={onCancel} contentLabel={name}>
                <Box>
                    <div ref={this.setRef}></div>
                </Box>
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