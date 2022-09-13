/**
 * A group of functions used to manage the cloud variable limit,
 * to be used when adding (or attempting to add) or removing a cloud variable.
 */
export type CloudDataManager = {
  /**
   * A function to call to check that a cloud variable can be added.
   */
  canAddCloudVariable: () => boolean;
  /**
   * A function to call to track a new cloud variable on the runtime.
   */
  addCloudVariable: () => void;
  /**
   * A function to call when removing an existing cloud variable.
   */
  removeCloudVariable: () => void;
  /**
   * A function to call to check that the runtime has any cloud variables.
   */
  hasCloudVariables: () => boolean;
}

/**
 * Creates and manages cloud variable limit in a project,
 * and returns two functions to be used to add a new
 * cloud variable (while checking that it can be added)
 * and remove an existing cloud variable.
 * These are to be called whenever attempting to create or delete
 * a cloud variable.
 * @return {CloudDataManager} The functions to be used when adding or removing a
 * cloud variable.
 */
export const getCloudDataManager: () => CloudDataManager = () => {
  const limit = 10;
  let count = 0;

  const canAddCloudVariable = () => count < limit;

  const addCloudVariable = () => {
    count++;
  };

  const removeCloudVariable = () => {
    count--;
  };

  const hasCloudVariables = () => count > 0;

  return {
    canAddCloudVariable,
    addCloudVariable,
    removeCloudVariable,
    hasCloudVariables
  };
};