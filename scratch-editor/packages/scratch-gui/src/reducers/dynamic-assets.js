// Reducer for dynamic assets (sprites, backdrops, costumes, sounds),
// passed down to the editor on runtime.
const SET_DYNAMIC_ASSETS = 'scratch-gui/dynamic-assets/SET_DYNAMIC_ASSETS';

const initialState = {
    sprites: [],
    backdrops: [],
    costumes: [],
    sounds: []
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_DYNAMIC_ASSETS:
        return {
            sprites: action.dynamicAssets.sprites || [],
            backdrops: action.dynamicAssets.backdrops || [],
            costumes: action.dynamicAssets.costumes || [],
            sounds: action.dynamicAssets.sounds || []
        };
    default:
        return state;
    }
};

const setDynamicAssets = function (dynamicAssets) {
    return {
        type: SET_DYNAMIC_ASSETS,
        dynamicAssets
    };
};

export {
    reducer as default,
    initialState as dynamicAssetsInitialState,
    setDynamicAssets
};
