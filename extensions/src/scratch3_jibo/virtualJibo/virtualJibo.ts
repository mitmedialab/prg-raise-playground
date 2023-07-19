import Target from "$scratch-vm/engine/target";

import { Color, ColorType } from "../jiboUtils/ColorDef";
import { Direction, DirType } from "../jiboUtils/LookAtDef";
import {
    Dance, DanceType,
    Emotion, EmotionType,
    Icon, IconType,
    Audio, AudioType
} from "../jiboUtils/AnimDef";

import jiboBodyBlack from "./jiboBody/black.png";
import jiboBodyRed from "./jiboBody/red.png";
import jiboBodyYellow from "./jiboBody/yellow.png";
import jiboBodyGreen from "./jiboBody/green.png";
import jiboBodyCyan from "./jiboBody/cyan.png";
import jiboBodyBlue from "./jiboBody/blue.png";
import jiboBodyMagenta from "./jiboBody/magenta.png";
import jiboBodyWhite from "./jiboBody/white.png";

import jiboEyeAirplane from "./jiboEye/Airplane.png";
import jiboEyeApple from "./jiboEye/Apple.png";
import jiboEyeArt from "./jiboEye/Art.png";
import jiboEyeBowling from "./jiboEye/Bowling.png";
import jiboEyeCheckmark from "./jiboEye/Checkmark.png";
import jiboEyeExclamation from "./jiboEye/Exclamation.png";
import jiboEyeFootball from "./jiboEye/Football.png";
import jiboEyeHeart from "./jiboEye/Heart.png";
import jiboEyeMagic from "./jiboEye/Magic.png";
import jiboEyeOcean from "./jiboEye/Ocean.png";
import jiboEyePenguin from "./jiboEye/Penguin.png";
import jiboEyeRainbow from "./jiboEye/Rainbow.png";
import jiboEyeRobot from "./jiboEye/Robot.png";
import jiboEyeRocket from "./jiboEye/Rocket.png";
import jiboEyeSnowflake from "./jiboEye/Snowflake.png";
import jiboEyeTaco from "./jiboEye/Taco.png";
import jiboEyeVideoGame from "./jiboEye/Videogame.png";
import Runtime from "$root/packages/scratch-vm/src/engine/runtime";


import type RenderedTarget from "$scratch-vm/sprites/rendered-target";
import MockBitmapAdapter from "$common/extension/mixins/optional/addCostumes/MockBitmapAdapter";
import { getUrlHelper } from "$common/extension/mixins/optional/addCostumes/utils";

let bitmapAdapter: MockBitmapAdapter;
let urlHelper: ReturnType<typeof getUrlHelper>;

const rendererKey: keyof RenderedTarget = "renderer";
const isRenderedTarget = (target: Target | RenderedTarget): target is RenderedTarget => rendererKey in target;

const JIBO_BODY = "jibo-body";
const JIBO_EYE = "jibo-eye";

const DEFAULT_JIBO_BODY = {
    x: 4,
    y: -9,
    size: 100,
    direction: 90,
}

// TODO make Jibo eye relative to body
const DEFAULT_JIBO_EYE = {
    x: 1,
    y: 75,
    size: 35,
    direction: 90,
}

type ColorDefType = {
    imageData: string;
};
const colorDef: Record<ColorType, ColorDefType> = {
    [Color.Red]: {
        imageData: jiboBodyRed,
    },
    [Color.Yellow]: {
        imageData: jiboBodyYellow,
    },
    [Color.Green]: {
        imageData: jiboBodyGreen,
    },
    [Color.Cyan]: {
        imageData: jiboBodyCyan,
    },
    [Color.Blue]: {
        imageData: jiboBodyBlue,
    },
    [Color.Magenta]: {
        imageData: jiboBodyMagenta,
    },
    [Color.White]: {
        imageData: jiboBodyWhite,
    },
    [Color.Random]: {
        imageData: ""
    },
    [Color.Off]: {
        imageData: jiboBodyBlack,
    },
};

type Coords = {
    x: number;
    y: number;
};
type DirDefType = {
    value: Coords;
};
const directionDef: Record<DirType, DirDefType> = {
    [Direction.up]: {
        value: { x: 500, y: 100 },
    },
    [Direction.down]: {
        value: { x: 500, y: 100 },
    },
    [Direction.left]: {
        value: { x: 100, y: 500 },
    },
    [Direction.right]: {
        value: { x: 100, y: -500 },
    },
    [Direction.forward]: {
        value: { x: 500, y: 100 },
    },
    [Direction.backward]: {
        value: { x: -500, y: 100 },
    },
};

type AnimFileType = {
    imageData: string;
};
const iconFiles: Record<IconType, AnimFileType> = {
    [Icon.Airplane]: {
        imageData: jiboEyeAirplane,
    },
    [Icon.Apple]: {
        imageData: jiboEyeApple,
    },
    [Icon.Art]: {
        imageData: jiboEyeArt,
    },
    [Icon.Bowling]: {
        imageData: jiboEyeBowling,
    },
    [Icon.Checkmark]: {
        imageData: jiboEyeCheckmark,
    },
    [Icon.ExclamationPoint]: {
        imageData: jiboEyeExclamation,
    },
    [Icon.Football]: {
        imageData: jiboEyeFootball,
    },
    [Icon.Heart]: {
        imageData: jiboEyeHeart,
    },
    [Icon.Magic]: {
        imageData: jiboEyeMagic,
    },
    [Icon.Ocean]: {
        imageData: jiboEyeOcean,
    },
    [Icon.Penguin]: {
        imageData: jiboEyePenguin,
    },
    [Icon.Rainbow]: {
        imageData: jiboEyeRainbow,
    },
    [Icon.Robot]: {
        imageData: jiboEyeRobot,
    },
    [Icon.Rocket]: {
        imageData: jiboEyeRocket,
    },
    [Icon.Snowflake]: {
        imageData: jiboEyeSnowflake,
    },
    [Icon.Taco]: {
        imageData: jiboEyeTaco,
    },
    [Icon.VideoGame]: {
        imageData: jiboEyeVideoGame,
    },
};

export default class Scratch3VirtualJibo {
    runtime: Runtime;

    init(runtime: Runtime) {
        console.log("virtual Jibo init");
        this.runtime = runtime;
    }

    resetJiboBodyTarget(target: Target) {
        let spriteTarget = this.getJiboBodyTarget(target);
        if (spriteTarget) {
            spriteTarget.setXY(DEFAULT_JIBO_BODY.x, DEFAULT_JIBO_BODY.y);
            spriteTarget.setDirection(DEFAULT_JIBO_BODY.direction);
            spriteTarget.setSize(DEFAULT_JIBO_BODY.size);
        }
    }
    setSpriteCostume(target: Target, name: string, imageDataURI: string) {
        // try to set the costume of the target by name
        let foundCostume = this.setCostumeByName(target, name);

        if (!foundCostume) {
            console.log("Did not find the costume we wanted. Adding new one");
            // if not, add and set the costume
            this.addCostumeBitmap(target, imageDataURI, "add and set", name);
        }
    }
    getJiboBodyTarget(currentTarget: Target) {
        // find the jibo-body sprite to make speak
        let spriteTarget;
        if (currentTarget.getName().startsWith(JIBO_BODY)) {
            // first see if the current target is a Jibo body
            // if so, assume this is the one we want to edit
            spriteTarget = currentTarget;
        } else if (currentTarget.getName().startsWith(JIBO_EYE)) {
            // next see if this is a Jibo eye, and select the corresponding jibo body (same suffix)
            let jiboEyeName = currentTarget.getName();
            let suffix = jiboEyeName.substring(jiboEyeName.indexOf(JIBO_EYE) + JIBO_EYE.length);
            let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_BODY + suffix));
            if (matches.length > 0) spriteTarget = matches[0];
        } else {
            // otherwise, pick the first Jibo body you see
            let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_BODY));
            if (matches.length > 0) spriteTarget = matches[0];
        }
        return spriteTarget;
    }

    async say(text: string, currentTarget: Target) {
        let spriteTarget = this.getJiboBodyTarget(currentTarget);
        if (spriteTarget) {
            // emit the say function
            this.runtime.emit('SAY', spriteTarget, 'say', text);
            // wait for a bit of time
            let wordCount = text.match(/\S+/g).length;
            await new Promise((r) => setTimeout(r, 500 * wordCount));
            this.runtime.emit('SAY', spriteTarget, 'say', '');
        } else {
            console.log("No Jibo body found");
        }
    }
    answer_receive() {
        return new Promise((resolve, reject) => {
            this.runtime.once('ANSWER', (answer) => {
                // TODO this introduces a bug with the sensing blocks, improve if possible
                resolve(answer);
            });
        });
    }

    /* update the appearance of virtual Jibo's LED*/
    setLED(color: string, currentTarget: Target) {
        // find the jibo-body sprite to edit
        let spriteTarget;
        if (currentTarget.getName().startsWith(JIBO_BODY)) {
            // first see if the current target is a Jibo body
            // if so, assume this is the one we want to edit
            spriteTarget = currentTarget;
        } else if (currentTarget.getName().startsWith(JIBO_EYE)) {
            // next see if this is a Jibo eye, and select the corresponding jibo body (same suffix)
            let jiboEyeName = currentTarget.getName();
            let suffix = jiboEyeName.substring(jiboEyeName.indexOf(JIBO_EYE) + JIBO_EYE.length);
            let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_BODY + suffix));
            if (matches.length > 0) spriteTarget = matches[0];
        } else {
            // otherwise, pick the first Jibo body you see
            let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_BODY));
            if (matches.length > 0) spriteTarget = matches[0];
        }

        if (spriteTarget) {
            // change the Sprite costume
            if (color == "random") {
                const randomColorIdx = Math.floor(
                    // exclude random and off
                    Math.random() * (Object.keys(colorDef).length - 2)
                );
                color = Object.keys(colorDef)[randomColorIdx];
            }

            let imageDataURI = colorDef[color].imageData;
            this.setSpriteCostume(spriteTarget, color, imageDataURI);

            spriteTarget.setXY(DEFAULT_JIBO_BODY.x, DEFAULT_JIBO_BODY.y);
            spriteTarget.setDirection(DEFAULT_JIBO_BODY.direction);
            spriteTarget.setSize(DEFAULT_JIBO_BODY.size);

        } else {
            console.log("No Jibo body found");
        }
    }

    anim(animation: string, commandType: string, currentTarget: Target) {
        // find the jibo-body sprite to edit
        let spriteTarget;
        if (currentTarget.getName().startsWith(JIBO_EYE)) {
            // first see if the current target is a Jibo eye
            // if so, assume this is the one we want to edit
            spriteTarget = currentTarget;
        } else if (currentTarget.getName().startsWith(JIBO_BODY)) {
            // next see if this is a Jibo body, and select the corresponding jibo eye (same suffix)
            let jiboBodyName = currentTarget.getName();
            let suffix = jiboBodyName.substring(jiboBodyName.indexOf(JIBO_BODY) + JIBO_BODY.length);
            let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_EYE + suffix));
            if (matches.length > 0) spriteTarget = matches[0];
        } else {
            // otherwise, pick the first Jibo eye you see
            let matches = this.runtime.targets.filter((target) => target.getName().startsWith(JIBO_EYE));
            if (matches.length > 0) spriteTarget = matches[0];
        }

        if (spriteTarget) {
            // change the Sprite costume 
            let imageDataURI;
            //if (commandType == "dance") imageDataURI = danceFiles[animation].imageData;
            //else if (commandType == "emotion") imageDataURI = emotionFiles[animation].imageData;
            if (commandType == "icon") imageDataURI = iconFiles[animation].imageData;

            // TODO do transition animation to change sprite icon
            this.setSpriteCostume(spriteTarget, animation, imageDataURI);
            spriteTarget.setXY(DEFAULT_JIBO_EYE.x, DEFAULT_JIBO_EYE.y);
            spriteTarget.setDirection(DEFAULT_JIBO_EYE.direction);
            spriteTarget.setSize(DEFAULT_JIBO_EYE.size);

        } else {
            console.log("No Jibo eye found");
        }
    }


    // Copied code from /workspace/prg-extension-boilerplate/extensions/src/common/extension/mixins/optional/addCostumes/index.ts
    // until I figure out a better way

    /**
 * Add a costume to the current sprite based on some image data
 * @param {RenderedTarget} target (e.g. `util.target`)
 * @param {ImageData} image What image to use to create the costume
 * @param {"add only" | "add and set"} action What action should be applied
 * - **_add only_**: generates the costume and append it it to the sprite's costume library
 * - **_add and set_**: Both generate the costume (adding it to the sprite's costume library) and set it as the sprite's current costume
 * @param {string?} name optional name to attach to the costume
 */
    async addCostume(target: Target, image: ImageData, action: "add only" | "add and set", name?: string) {
        if (!isRenderedTarget(target)) return console.warn("Costume could not be added as the supplied target wasn't a rendered target");

        name ??= `virtualJibo_generated_${Date.now()}`;
        bitmapAdapter ??= new MockBitmapAdapter();
        urlHelper ??= getUrlHelper(image);

        // storage is of type: https://github.com/LLK/scratch-storage/blob/develop/src/ScratchStorage.js
        const { storage } = this.runtime;
        const dataFormat = storage.DataFormat.PNG;
        const assetType = storage.AssetType.ImageBitmap;
        const dataBuffer = await bitmapAdapter.importBitmap(urlHelper.getDataURL(image));

        const asset = storage.createAsset(assetType, dataFormat, dataBuffer, null, true);
        const { assetId } = asset;
        const costume = { name, dataFormat, asset, md5: `${assetId}.${dataFormat}`, assetId };

        await this.runtime.addCostume(costume);

        const { length } = target.getCostumes();

        target.addCostume(costume, length);
        if (action === "add and set") target.setCostume(length);
    }

    /**
     * Add a costume to the current sprite based on a bitmpa input
     * @param {RenderedTarget} target (e.g. `util.target`)
     * @param {string} bitmapImage What image to use to create the costume
     * @param {"add only" | "add and set"} action What action should be applied
     * - **_add only_**: generates the costume and append it it to the sprite's costume library
     * - **_add and set_**: Both generate the costume (adding it to the sprite's costume library) and set it as the sprite's current costume
     * @param {string?} name optional name to attach to the costume
     */
    async addCostumeBitmap(target: Target, bitmapImage: string, action: "add only" | "add and set", name?: string) {
        if (!isRenderedTarget(target)) return console.warn("Costume could not be added as the supplied target wasn't a rendered target");

        name ??= `virtualJibo_generated_${Date.now()}`;
        bitmapAdapter ??= new MockBitmapAdapter();
        //urlHelper ??= getUrlHelper(image);

        // storage is of type: https://github.com/LLK/scratch-storage/blob/develop/src/ScratchStorage.js
        const { storage } = this.runtime;
        const dataFormat = storage.DataFormat.PNG;
        const assetType = storage.AssetType.ImageBitmap;
        const dataBuffer = await bitmapAdapter.importBitmap(bitmapImage);

        const asset = storage.createAsset(assetType, dataFormat, dataBuffer, null, true);
        const { assetId } = asset;
        const costume = { name, dataFormat, asset, md5: `${assetId}.${dataFormat}`, assetId };

        await this.runtime.addCostume(costume);

        const { length } = target.getCostumes();

        target.addCostume(costume, length);
        if (action === "add and set") target.setCostume(length);
    }

    /**
     * Add a costume to the current sprite based on same image data
     * @param {RenderedTarget} target (e.g. `util.target`)
     * @param {string?} name costume name to look for
     */
    setCostumeByName(target: Target, name: string): boolean {
        if (!isRenderedTarget(target)) {
            console.warn("Costume could not be set as the supplied target wasn't a rendered target");
            return false;
        }

        let costumeIdx = target.getCostumeIndexByName(name);
        if (costumeIdx >= 0) {
            target.setCostume(costumeIdx);
            return true;
        }
        return false;
    }
}