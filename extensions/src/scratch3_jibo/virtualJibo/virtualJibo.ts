import Target from "$scratch-vm/engine/target";
import type RenderedTarget from "$scratch-vm/sprites/rendered-target";
import MockBitmapAdapter from "$common/extension/mixins/optional/addCostumes/MockBitmapAdapter";
import { getUrlHelper } from "$common/extension/mixins/optional/addCostumes/utils";

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

import jiboEye1 from "./jiboEye/Eye1.svg";
import jiboEye2 from "./jiboEye/Eye2.svg";
import jiboEye3 from "./jiboEye/Eye3.svg";
import jiboEye4 from "./jiboEye/Eye4.svg";
import jiboEye5 from "./jiboEye/Eye5.svg";

import Runtime from "$root/packages/scratch-vm/src/engine/runtime";

let bitmapAdapter: MockBitmapAdapter;
let urlHelper: ReturnType<typeof getUrlHelper>;

const rendererKey: keyof RenderedTarget = "renderer";
const isRenderedTarget = (target: Target | RenderedTarget): target is RenderedTarget => rendererKey in target;

const JIBO_BODY = "jibo-body";
const JIBO_EYE = "jibo-eye";

const DEFAULT_JIBO_EYE = {
    dx: 0, // jibo eye = jibo body + dx * jibo body size
    dy: .76, // jibo eye = (jibo body) + dy * jibo body size
    dsize: .65, // jibo eye = jibo body * dsize
    diconSize: .35,
}

type Coords = {
    dx: number;
    dy: number;
};
type DirDefType = {
    value: Coords;
};
const directionDef: Record<DirType, DirDefType> = {
    [Direction.up]: {
        value: { dx: 0, dy: 1 },
    },
    [Direction.down]: {
        value: { dx: 0, dy: 0.45 },
    },
    [Direction.left]: {
        value: { dx: 0.45, dy: 0.76 },
    },
    [Direction.right]: {
        value: { dx: -0.45, dy: 0.76 },
    },
    [Direction.forward]: {
        value: { dx: 0, dy: 0.76 },
    },
};

type ImageDefType = {
    imageData: string;
};

const jiboEyeDef: Record<string, ImageDefType> = {
    "Eye1": {
        imageData: jiboEye1,
    },
    "Eye2": {
        imageData: jiboEye2,
    },
    "Eye3": {
        imageData: jiboEye3,
    },
    "Eye4": {
        imageData: jiboEye4,
    },
    "Eye5": {
        imageData: jiboEye5,
    },
};
const JIBO_EYE_ANIM = [
    "Eye1", "Eye2", "Eye2", "Eye3", "Eye4", "Eye5", "Eye3", "Eye2", "Eye1"
];

const colorDef: Record<ColorType, ImageDefType> = {
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

type AnimFileType = {
    imageData: string;
};
const iconFiles: Record<IconType, ImageDefType> = {
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
    answer: string;

    init(runtime: Runtime) {
        this.runtime = runtime;
        this.answer = "";
    }

    resetJiboEyeTarget(target: Target, type: string ="eye") {
        let bodyTarget = this.getJiboBodyTarget(target);
        let eyeTarget = this.getJiboEyeTarget(target);

        if (!isRenderedTarget(bodyTarget) || !isRenderedTarget(eyeTarget)) {
            console.warn("Eye could not be reset as the supplied target didn't lead to rendered eye and body targets");
            return false;
        }

        if (eyeTarget) {
            let mult = type === "eye" ? 
                1 :
                DEFAULT_JIBO_EYE.diconSize / DEFAULT_JIBO_EYE.dsize;
            let newX = bodyTarget.x + DEFAULT_JIBO_EYE.dx * bodyTarget.size;
            let newY = bodyTarget.y + DEFAULT_JIBO_EYE.dy * bodyTarget.size;
            let newSize = bodyTarget.size * DEFAULT_JIBO_EYE.dsize * mult;
            eyeTarget.setXY(newX, newY, null);
            eyeTarget.setSize(newSize);
            eyeTarget.goToFront();
        }
    }
    async setSpriteCostume(target: Target, name: string, imageDataURI: string) {
        // try to set the costume of the target by name
        let foundCostume = this.setCostumeByName(target, name);

        if (!foundCostume) {
            console.log("Did not find the costume we wanted. Adding new one");
            // if not, add and set the costume
            await this.addCostumeBitmap(target, imageDataURI, "add and set", name);
        }
    }
    getJiboBodyTarget(currentTarget: Target): Target {
        // find the jibo-body sprite
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
    getJiboEyeTarget(currentTarget: Target): Target {
        // find the jibo-eye sprite
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
    async ask(text: string) {
      // wait for stage to get answer
      this.runtime.emit('QUESTION', text);
      this.answer = await this.answer_receive();
    }
    answer_receive(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.runtime.once('ANSWER', (answer) => {
                // TODO this introduces a bug with the sensing blocks, improve if possible
                resolve(answer);
            });
        });
    }

    /* update the appearance of virtual Jibo's LED*/
    async setLED(color: string, currentTarget: Target) {
        // find the jibo-body sprite to edit 
        let spriteTarget = this.getJiboBodyTarget(currentTarget);
        if (spriteTarget) {
            // change the Sprite costume
            if (color == "random") {
                const randomColorIdx = Math.floor(
                    // exclude random and off
                    Math.random() * (Object.keys(colorDef).length - 2)
                );
                color = Object.keys(colorDef)[randomColorIdx];
            }

            let imageData = colorDef[color].imageData;
            await this.setSpriteCostume(spriteTarget, color, imageData);
        } else {
            console.log("No Jibo body found");
        }
    }

    async blink(jiboEye: Target) {
        this.resetJiboEyeTarget(jiboEye);
        for (let i=0; i<JIBO_EYE_ANIM.length; i++) {
            let costumeName = JIBO_EYE_ANIM[i];
            let imageData = jiboEyeDef[costumeName].imageData;
            await this.setSpriteCostume(jiboEye, costumeName, imageData);
            await new Promise((r) => setTimeout(r, 50));
        }
    }
    async jumpTransition(jiboEye: Target, newAnim: string, imageData: string) {
        let type = newAnim.includes("Eye") ? "eye" : "icon";
        if (!isRenderedTarget(jiboEye)) {
            console.warn("Eye could not be reset as the supplied target wasn't a rendered target");
            return false;
        }

        // move up 5 loops
        for (let i=0; i<5; i++) {
            jiboEye.setXY(jiboEye.x, jiboEye.y + 5, null)
            await new Promise((r) => setTimeout(r, 50));
        }
        // move eye down 7 loops
        for (let i=0; i<7; i++) {
            jiboEye.setXY(jiboEye.x, jiboEye.y - 5, null)
            await new Promise((r) => setTimeout(r, 50));
        }
        // switch costume
        this.resetJiboEyeTarget(jiboEye, type);
        await this.setSpriteCostume(jiboEye, newAnim, imageData);
        // move up 4 loops
        for (let i=0; i<4; i++) {
            jiboEye.setXY(jiboEye.x, jiboEye.y + 5, null)
            await new Promise((r) => setTimeout(r, 50));
        }
        // move down 2 loops
        for (let i=0; i<2; i++) {
            jiboEye.setXY(jiboEye.x, jiboEye.y - 5, null)
            await new Promise((r) => setTimeout(r, 50));
        }
    }
    async anim(animation: string, commandType: string, currentTarget: Target) {
        // find the jibo-eye sprite to edit
        let spriteTarget = this.getJiboEyeTarget(currentTarget);
        if (!isRenderedTarget(spriteTarget)) {
            console.warn("No rendered jibo-eye target could be found");
            return false;
        }

        // change the Sprite costume 
        let imageDataURI;
        //if (commandType == "dance") imageDataURI = danceFiles[animation].imageData;
        //else if (commandType == "emotion") imageDataURI = emotionFiles[animation].imageData;
        if (commandType == "icon") {
            imageDataURI = iconFiles[animation].imageData;
            await this.jumpTransition(spriteTarget, animation, imageDataURI);
            await new Promise((r) => setTimeout(r, 3000));
            await this.jumpTransition(spriteTarget, "Eye1", jiboEyeDef["Eye1"].imageData);
            // finish a blink
            await this.blink(spriteTarget);
        }
    }
    async lookAt(direction: string, currentTarget: Target) {
        // find the jibo-body and jibo-eye sprites to edit
        let eyeTarget = this.getJiboEyeTarget(currentTarget);
        let bodyTarget = this.getJiboBodyTarget(currentTarget);
        if (!isRenderedTarget(eyeTarget)|| !(isRenderedTarget(bodyTarget))) {
            console.warn("Eye could not be reset as the supplied target wasn't a rendered target");
            return false;
        }

        let coords = directionDef[direction].value;
        let newX = bodyTarget.x + coords.dx * bodyTarget.size;
        let newY = bodyTarget.y + coords.dy * bodyTarget.size;
        let xStepSize = (newX - eyeTarget.x) / 10;
        let yStepSize = (newY - eyeTarget.y) / 10;
        for (let i=0; i<10; i++) {
            eyeTarget.setXY(
                eyeTarget.x + xStepSize,
                eyeTarget.y + yStepSize,
                null
            );
            await new Promise((r) => setTimeout(r, 50));
        }
    }


    // Copied code from /workspace/prg-extension-boilerplate/extensions/src/common/extension/mixins/optional/addCostumes/index.ts
    // until I figure out a better way

    /**
     * Add a costume to the current sprite based on some image data
     * @param {Target} target (e.g. `util.target`)
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
     * @param {Target} target (e.g. `util.target`)
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
     * @param {Target} target (e.g. `util.target`)
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