import Target from "$root/packages/scratch-vm/src/engine/target";
import { Voice } from "./voices";

export type State = { currentVoice: Voice; }

const stateKey = "Scratch.text2speech";

export const setState = (target: Target, state: State) => target.setCustomState(stateKey, state);

export const hasState = (target: Target) => target.getCustomState(stateKey) !== undefined && target.getCustomState(stateKey) !== null;

export const getState = (target: Target): State => {
    let state: State = target.getCustomState(stateKey);
    if (state) return state;
    state = { currentVoice: "SQUEAK" };
    target.setCustomState(stateKey, state);
    return state;
}

export const tryCopyStateToClone = (newTarget: Target, sourceTarget: Target) => {
    if (!sourceTarget || !hasState(sourceTarget)) return; // not a clone, or no state to copy
    setState(newTarget, { currentVoice: getState(sourceTarget).currentVoice });
}