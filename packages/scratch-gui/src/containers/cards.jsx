import { connect } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import {
    activateDeck,
    closeCards,
    shrinkExpandCards,
    nextStep,
    prevStep,
    dragCard,
    startDrag,
    endDrag,
    jiboHelp,
} from "../reducers/cards";

import { openTipsLibrary } from "../reducers/modals";

import CardsComponent from "../components/cards/cards.jsx";
import { loadImageData } from "../lib/libraries/decks/translate-image.js";
import { notScratchDesktop } from "../lib/isScratchDesktop";

class Cards extends React.Component {
    componentDidMount() {
        if (this.props.locale !== "en") {
            loadImageData(this.props.locale);
        }
        // emit runtime event when tutorial cards open
        let cardDesc =
            this.props.content[this.props.activeDeckId].steps[this.props.step].description;
        this.props.vm.runtime.emit(
            "TUTORIAL_CHANGED",
            this.props.activeDeckId,
            this.props.step,
            `Tutorial Card ${this.props.step}: ${cardDesc}`
        );
    }
    componentDidUpdate(prevProps) {
        if (this.props.locale !== prevProps.locale) {
            loadImageData(this.props.locale);
        }
        // emit runtime event when tutorial card changes
        if (prevProps.step != this.props.step) {
            let cardDesc =
                this.props.content[this.props.activeDeckId].steps[this.props.step].description;
            this.props.vm.runtime.emit(
                "TUTORIAL_CHANGED",
                this.props.activeDeckId,
                this.props.step,
                `Tutorial Card ${this.props.step}: ${cardDesc}`
            );
        }
        if (prevProps.help_flag != this.props.help_flag) {
            this.props.vm.runtime.emit("JIBO_HELP_REQUESTED");
        }
    }
    render() {
        return <CardsComponent {...this.props} />;
    }
}

Cards.propTypes = {
    locale: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
    visible: state.scratchGui.cards.visible,
    content: state.scratchGui.cards.content,
    activeDeckId: state.scratchGui.cards.activeDeckId,
    step: state.scratchGui.cards.step,
    expanded: state.scratchGui.cards.expanded,
    x: state.scratchGui.cards.x,
    y: state.scratchGui.cards.y,
    isRtl: state.locales.isRtl,
    locale: state.locales.locale,
    dragging: state.scratchGui.cards.dragging,
    showVideos: notScratchDesktop(),
    help_flag: state.scratchGui.cards.help_flag,
});

const mapDispatchToProps = (dispatch) => ({
    onActivateDeckFactory: (id) => () => dispatch(activateDeck(id)),
    onShowAll: () => {
        dispatch(openTipsLibrary());
        dispatch(closeCards());
    },
    onJiboHelp: () => dispatch(jiboHelp()),
    onCloseCards: () => dispatch(closeCards()),
    onShrinkExpandCards: () => dispatch(shrinkExpandCards()),
    onNextStep: () => dispatch(nextStep()),
    onPrevStep: () => dispatch(prevStep()),
    onDrag: (e_, data) => dispatch(dragCard(data.x, data.y)),
    onStartDrag: () => dispatch(startDrag()),
    onEndDrag: () => dispatch(endDrag()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cards);
