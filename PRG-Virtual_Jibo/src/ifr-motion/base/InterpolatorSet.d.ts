export default InterpolatorSet;
declare class InterpolatorSet {
    /**
     * associate an interpolator with a specified DOF
     * @param {string} dofName
     * @param {Interpolators.BaseInterpolator} interpolator
     */
    addInterpolator(dofName: string, interpolator: Interpolators.BaseInterpolator): void;
    /**
     * get the interpolator associated with the specified DOF, or null if none is set
     * @param {string} dofName
     * @return {Interpolators.BaseInterpolator}
     */
    getInterpolator(dofName: string): Interpolators.BaseInterpolator;
    /**
     * add interpolators for all of the DOFs in the specified ModelControlGroup
     * @param {ModelControlGroup} modelControlGroup
     */
    addModelControlGroup(modelControlGroup: ModelControlGroup): void;
}
import Interpolators from "./Interpolators.js";
