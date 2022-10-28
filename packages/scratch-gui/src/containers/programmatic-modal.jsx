import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {closeProgrammaticModal} from '../reducers/modals';
import Box from '../components/box/box.jsx';
import SvelteComponent from "../svelte/Modal.svelte";
import Modal from './modal.jsx';

class ProgrammaticModal extends React.Component {
    divRef;
    component;
  
    constructor (props) {
        super(props);
    }

    componentDidMount() {
        console.log(this.divRef);
        console.log(this.props.vm);
        this.component = new SvelteComponent({
            target: this.divRef
        });
    }

    componentWillUnmount() {
        this.component.$destroy();
    }
    
    render () {
        return (
            <Modal>
                <Box>
                    <div ref={this.divRef}></div>
                </Box>
            </Modal>
        );
    }
}

ProgrammaticModal.propTypes = {
    vm: PropTypes.instanceOf(VM).isRequired
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