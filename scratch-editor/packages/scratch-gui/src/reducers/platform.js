import {PLATFORM} from '../lib/platform.js';

const SET_PLATFORM = 'scratch-gui/Platform/SET_PLATFORM';

const initialState = {
    platform: PLATFORM.WEB
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_PLATFORM:
        return {
            platform: action.platform
        };
    default:
        return state;
    }
};

const setPlatform = function (platform) {
    return {
        type: SET_PLATFORM,
        platform: platform
    };
};

export {
    reducer as default,
    initialState as platformInitialState,
    setPlatform
};
