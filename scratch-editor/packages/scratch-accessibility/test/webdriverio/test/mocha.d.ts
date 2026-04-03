import {Browser} from 'webdriverio';

declare module 'mocha' {
  export interface Context {
    /**
     * This is typically only defined by suite setup but it is more practical to
     * write tests that can assume it is defined.
     */
    browser: Browser;
  }
}
