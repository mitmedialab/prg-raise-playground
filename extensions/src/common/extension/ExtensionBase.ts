import Runtime from "$scratch-vm/engine/runtime";

import { AbstractConstructor, Environment, ExlcudeFirst } from "$common/types";

export type ExtensionConstructorParams = ConstructorParameters<typeof ConstructableExtension>;
export type CodeGenParams = ExlcudeFirst<ExtensionConstructorParams>;
export type ExtensionBaseConstructor = AbstractConstructor<ExtensionBase>;

export abstract class ConstructableExtension {
  /**
   * @summary This member function (or 'method') will be called when a user adds your extension via the Extensions Menu (i.e. when your extension is instantiated)
   * @example
   * // Initialize class field(s)
   * private count: number;
   *
   * init() {
   *  count = 0;
   * }
   * @example
   * // Interact with environment's runtime
   * init(env: Environment) {
   *  env.runtime.emit(RuntimeEvent.ProjectStart);
   * }
   * @example
   * // Nothing to initialize
   * init() {}
   * @description This function is intended to behave exactly like a constructor, used to initialize the state of your extension.
   *
   * The reason we use this function INSTEAD of a constructor is so that the base Extension class can manage the construction of this class.
   * 
   * This also allows us to enable this method to be async (if you'd like).
   * @param {Environment} env An object that allows your Extension to interact with the Scratch Environment. Currently is a little bare, but will be expanded soon.
   * Can be ommitted if not needed.
   *
   * For Scratch developers: The `runtime` property on env is the same as the runtime passed to non-Typescript-Framework Extension constructors
   */
  abstract init(env: Environment): void | Promise<void>;

  protected async internal_init() {
    const runtime = this.runtime;
    return await Promise.resolve(this.init({
      runtime,
      get extensionManager() { return runtime.getExtensionManager() }
    }));
  }

  /**
   *
   * @param runtime The 'runtime' connected to the scratch-vm that enables your extension to interact with the scratch workspace
   * @param name The name of this extension.
   * @param id The ID of this extension.
   * @param blockIconURI
   */
  constructor(readonly runtime: Runtime, readonly name: string, readonly id: string, readonly blockIconURI: string) {
  }
}

export const extensionsMap = new Map<string, ExtensionBase>();

export abstract class ExtensionBase extends ConstructableExtension {
  constructor(FORBIDDEN: never) {
    // @ts-ignore
    super(...arguments);
    extensionsMap.set(this.id, this);
  }
}