const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const RenderedTarget = require('../../sprites/rendered-target');
const uid = require('../../util/uid');
const StageLayering = require('../../engine/stage-layering');
const MathUtil = require('../../util/math-util');
const log = require('../../util/log');

/**
 * @typedef {object} TextBoxState - the bubble state associated with a particular target.
 * @property {Boolean} onSpriteRight - tracks whether the bubble is right or left of the sprite.
 * @property {?int} drawableId - the ID of the associated bubble Drawable, null if none.
 * @property {string} text - the text of the bubble.
 * @property {string} type - the type of the bubble, "say" or "think"
 * @property {?string} usageId - ID indicating the most recent usage of the say/think bubble.
 *      Used for comparison when determining whether to clear a say/think bubble.
 */

class TextRender {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;

        this._onTargetChanged = this._onTargetChanged.bind(this);
        this._onResetTextBoxes = this._onResetTextBoxes.bind(this);
        this._onTargetWillExit = this._onTargetWillExit.bind(this);
        this._updateTextBox = this._updateTextBox.bind(this);

        // Reset all bubbles on start/stop
        this.runtime.on('PROJECT_STOP_ALL', this._onResetTextBoxes);
        this.runtime.on('targetWasRemoved', this._onTargetWillExit);

        // Enable other blocks to use bubbles like ask/answer
        this.runtime.on('TEXT', this._updateTextBox);
    }

    /**
     * The default bubble state, to be used when a target has no existing bubble state.
     * @type {TextBoxState}
     */
    static get DEFAULT_TEXT_BOX_STATE () {
        return {
            drawableId: null,
            onSpriteRight: true,
            skinId: null,
            text: '',
            type: 'say',
            usageId: null
        };
    }

    /**
     * The key to load & store a target's bubble-related state.
     * @type {string}
     */
    static get STATE_KEY () {
        return 'Scratch.text';
    }

    /**
     * Limit for say bubble string.
     * @const {string}
     */
    static get SAY_TEXT_BOX_LIMIT () {
        return 330;
    }

    /**
     * Limit for ghost effect
     * @const {object}
     */
    static get EFFECT_GHOST_LIMIT (){
        return {min: 0, max: 100};
    }

    /**
     * Limit for brightness effect
     * @const {object}
     */
    static get EFFECT_BRIGHTNESS_LIMIT (){
        return {min: -100, max: 100};
    }

    /**
     * @param {Target} target - collect bubble state for this target. Probably, but not necessarily, a RenderedTarget.
     * @returns {TextBoxState} the mutable bubble state associated with that target. This will be created if necessary.
     * @private
     */
    _getTextBoxState (target) {
        let textBoxState = target.getCustomState(TextRender.STATE_KEY);
        if (!textBoxState) {
            textBoxState = Clone.simple(TextRender.DEFAULT_TEXT_BOX_STATE);
            target.setCustomState(TextRender.STATE_KEY, textBoxState);
        }
        return textBoxState;
    }

    /**
     * Handle a target which has moved.
     * @param {RenderedTarget} target - the target which has moved.
     * @private
     */
    _onTargetChanged (target) {
        const textBoxState = this._getTextBoxState(target);
        if (textBoxState.drawableId) {
            this._positionTextBox(target);
        }
    }

    /**
     * Handle a target which is exiting.
     * @param {RenderedTarget} target - the target.
     * @private
     */
    _onTargetWillExit (target) {
        const textBoxState = this._getTextBoxState(target);
        if (textBoxState.drawableId && textBoxState.skinId) {
            this.runtime.renderer.destroyDrawable(textBoxState.drawableId, StageLayering.SPRITE_LAYER);
            this.runtime.renderer.destroySkin(textBoxState.skinId);
            textBoxState.drawableId = null;
            textBoxState.skinId = null;
            this.runtime.requestRedraw();
        }
        target.removeListener(RenderedTarget.EVENT_TARGET_VISUAL_CHANGE, this._onTargetChanged);
    }

    /**
     * Handle project start/stop by clearing all visible bubbles.
     * @private
     */
    _onResetTextBoxes () {
        for (let n = 0; n < this.runtime.targets.length; n++) {
            const textBoxState = this._getTextBoxState(this.runtime.targets[n]);
            textBoxState.text = '';
            this._onTargetWillExit(this.runtime.targets[n]);
        }
        clearTimeout(this._textBoxTimeout);
    }

    /**
     * Position the bubble of a target. If it doesn't fit on the specified side, flip and rerender.
     * @param {!Target} target Target whose bubble needs positioning.
     * @private
     */
    _positionTextBox (target) {
        log.log("POSITION");
        if (!target.visible) return;
        const textBoxState = this._getTextBoxState(target);
        const [textBoxWidth, textBoxHeight] = this.runtime.renderer.getCurrentSkinSize(textBoxState.drawableId);
        let targetBounds;
        try {
            targetBounds = target.getBoundsForTextBox();
        } catch (error_) {
            // Bounds calculation could fail (e.g. on empty costumes), in that case
            // use the x/y position of the target.
            targetBounds = {
                left: target.x,
                right: target.x,
                top: target.y,
                bottom: target.y
            };
        }
        const stageSize = this.runtime.renderer.getNativeSize();
        const stageBounds = {
            left: -stageSize[0] / 2,
            right: stageSize[0] / 2,
            top: stageSize[1] / 2,
            bottom: -stageSize[1] / 2
        };
        if (textBoxState.onSpriteRight && textBoxWidth + targetBounds.right > stageBounds.right &&
            (targetBounds.left - textBoxWidth > stageBounds.left)) { // Only flip if it would fit
            textBoxState.onSpriteRight = false;
            this._renderTextBox(target);
        } else if (!textBoxState.onSpriteRight && targetBounds.left - textBoxWidth < stageBounds.left &&
            (textBoxWidth + targetBounds.right < stageBounds.right)) { // Only flip if it would fit
            textBoxState.onSpriteRight = true;
            this._renderTextBox(target);
        } else {
            this.runtime.renderer.updateDrawableProperties(textBoxState.drawableId, {
                position: [
                    textBoxState.onSpriteRight ? (
                        Math.max(
                            stageBounds.left, // Bubble should not extend past left edge of stage
                            Math.min(stageBounds.right - textBoxWidth, targetBounds.right)
                        )
                    ) : (
                        Math.min(
                            stageBounds.right - textBoxWidth, // Bubble should not extend past right edge of stage
                            Math.max(stageBounds.left, targetBounds.left - bubbleWidth)
                        )
                    ),
                    // Bubble should not extend past the top of the stage
                    Math.min(stageBounds.top, targetBounds.bottom + textBoxHeight)
                ]
            });
            this.runtime.requestRedraw();
        }
    }

    /**
     * Create a visible bubble for a target. If a bubble exists for the target,
     * just set it to visible and update the type/text. Otherwise create a new
     * bubble and update the relevant custom state.
     * @param {!Target} target Target who needs a bubble.
     * @return {undefined} Early return if text is empty string.
     * @private
     */
    _renderTextBox (target) {
        if (!this.runtime.renderer) return;

        const textBoxState = this._getTextBoxState(target);
        const {type, text, onSpriteRight} = textBoxState;

        // Remove the bubble if target is not visible, or text is being set to blank.
        if (!target.visible || text === '') {
            this._onTargetWillExit(target);
            return;
        }

        if (textBoxState.skinId) {
            this.runtime.renderer.updateTextBoxSkin(textBoxState.skinId, type, text, onSpriteRight, [0, 0]);
        } else {
            target.addListener(RenderedTarget.EVENT_TARGET_VISUAL_CHANGE, this._onTargetChanged);
            textBoxState.drawableId = this.runtime.renderer.createDrawable(StageLayering.SPRITE_LAYER);
            textBoxState.skinId = this.runtime.renderer.createTextBoxSkin(type, text, textBoxState.onSpriteRight, [0, 0]);
            this.runtime.renderer.updateDrawableProperties(textBoxState.drawableId, {
                skinId: textBoxState.skinId
            });
        }

        this._positionTextBox(target);
    }

    /**
     * The entry point for say/think blocks. Clears existing bubble if the text is empty.
     * Set the bubble custom state and then call _renderBubble.
     * @param {!Target} target Target that say/think blocks are being called on.
     * @param {!string} type Either "say" or "think"
     * @param {!string} text The text for the bubble, empty string clears the bubble.
     * @private
     */
    _updateTextBox (target, type, text) {
        const textBoxState = this._getTextBoxState(target);
        textBoxState.type = type;
        textBoxState.text = text;
        textBoxState.usageId = uid();
        this._renderTextBox(target);
    }

    say (text, args, util) {
        // @TODO in 2.0 calling say/think resets the right/left bias of the bubble
        let message = text;
        if (typeof message === 'number') {
            message = parseFloat(message.toFixed(2));
        }
        message = String(message).substr(0, TextRender.SAY_TEXT_BOX_LIMIT);
        this.runtime.emit('TEXT', util.target, 'say', message);
    }

    changeSize (args, util) {
        const change = Cast.toNumber(args.CHANGE);
        util.target.setSize(util.target.size + change);
    }

    setSize (args, util) {
        const size = Cast.toNumber(args.SIZE);
        util.target.setSize(size);
    }

    getSize (args, util) {
        return Math.round(util.target.size);
    }
}

module.exports = TextRender;