import type * as VmRuntime from "$scratch-vm/engine/runtime";
import { AudioEngine } from "./audio";
import type { EventEmitter } from "events";

export type Runtime = Omit<VmRuntime, "audioEngine"> & { audioEngine: AudioEngine } & EventEmitter;