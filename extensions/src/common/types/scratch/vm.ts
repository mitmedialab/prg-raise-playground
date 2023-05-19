import type * as VmRuntime from "$scratch-vm/engine/runtime";
import { AudioEngine } from "./audio";

export type Runtime = Omit<VmRuntime, "audioEngine"> & { audioEngine: AudioEngine };