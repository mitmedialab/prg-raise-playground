/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Hooks to run before the first test and after the last test.
 * These create a shared chromedriver instance, so we don't have to fire up
 * a new one for every suite.
 */
import {RootHookObject} from 'mocha';
import {driverSetup, driverTeardown} from './test_setup.js';

export const mochaHooks: RootHookObject = {
  async beforeAll(this: Mocha.Context) {
    // Set a long timeout for startup.
    this.timeout(60000);
    return await driverSetup(this.timeout());
  },
  async afterAll() {
    return await driverTeardown();
  },
};
