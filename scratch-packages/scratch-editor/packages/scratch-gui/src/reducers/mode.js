const SET_FULL_SCREEN = 'scratch-gui/mode/SET_FULL_SCREEN';
const SET_PLAYER = 'scratch-gui/mode/SET_PLAYER';
const SET_EMBEDDED = 'scratch-gui/mode/SET_EMBEDDED';

const initialState = {
    showBranding: false,
    isFullScreen: false,
    isPlayerOnly: false,
    hasEverEnteredEditor: true
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_FULL_SCREEN:
        return Object.assign({}, state, {
            isFullScreen: action.isFullScreen
        });
    case SET_PLAYER:
        return Object.assign({}, state, {
            isPlayerOnly: action.isPlayerOnly,
            hasEverEnteredEditor: state.hasEverEnteredEditor || !action.isPlayerOnly
        });
    case SET_EMBEDDED:
        if (action.isEmbedded) {
            return Object.assign({}, state, {
                showBranding: true,
                isFullScreen: true,
                isPlayerOnly: true,
                hasEverEnteredEditor: false
            });
        }
        return state;
    default:
        return state;
    }
};

const setFullScreen = function (isFullScreen) {
    return {
        type: SET_FULL_SCREEN,
        isFullScreen: isFullScreen
    };
};
const setPlayer = function (isPlayerOnly) {
    return {
        type: SET_PLAYER,
        isPlayerOnly: isPlayerOnly
    };
};
const setEmbedded = function (isEmbedded) {
    return {
        type: SET_EMBEDDED,
        isEmbedded: isEmbedded
    };
};

export {
    reducer as default,
    initialState as modeInitialState,
    setFullScreen,
    setPlayer,
    setEmbedded
};
