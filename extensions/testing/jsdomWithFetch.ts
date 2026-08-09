import JSDOMEnvironment from "jest-environment-jsdom";

/**
 * jsdom does not implement fetch, so any extension block that talks to a backend throws
 * `ReferenceError: fetch is not defined` under the stock `jsdom` test environment.
 *
 * This environment is plain jsdom with Node's fetch stack copied into the sandbox. The
 * whole stack is copied together on purpose: Node's fetch only accepts its own
 * FormData/Blob/File for request bodies, so mixing in jsdom's versions breaks uploads.
 */
export default class JSDOMEnvironmentWithFetch extends JSDOMEnvironment {
  constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
    super(...args);

    for (const name of ["fetch", "Headers", "Request", "Response", "FormData", "Blob", "File"]) {
      (this.global as any)[name] = (globalThis as any)[name];
    }
  }
}
