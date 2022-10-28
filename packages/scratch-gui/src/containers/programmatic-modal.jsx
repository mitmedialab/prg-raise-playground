import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {closeProgrammaticModal, closeTextModelModal} from '../reducers/modals';
import Box from '../components/box/box';
import SvelteComponent from "../svelte/Modal";
import Modal from './modal';

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

TextModelModal.propTypes = {
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