"use strict";

import CyclicDOFTargetSelector from "./CyclicDOFTargetSelector.js";

/**
 * Collection of tools to help alignment of DOFs accounting
 * for their global-space (world space) positions.
 *
 * @param {KinematicGroup} kinematicGroup
 * @param {Object.<string,CyclicDOFTargetSelector>} [customGlobalSelectors]
 * @constructor
 */
class DOFGlobalAlignment {
	constructor(kinematicGroup, customGlobalSelectors){
		let i;

		/** @type {Object.<string,CyclicDOFTargetSelector>} */
		const globalTargetSelectors = {};
		const localTargetSelectors = {};
		const dofNames = kinematicGroup.getDOFNames();


		//////////init ancestor sort ordering/////////////
		/** @type {Object.<string,number>} */
		const dofDepth = {};
		const dofDepthComparator = function(dofName1, dofName2){
			const d1 = dofDepth[dofName1];
			const d2 = dofDepth[dofName2];
			if(d1 != null && d2 != null){ //null or undefined (eqnull)
				return d1 - d2;
			}else{
				return 0;
			}
		};

		for(i = 0; i < dofNames.length; i++){
			let depth = 0;
			const control = kinematicGroup.getModelControlGroup().getControlForDOF(dofNames[i]);
			if(control != null){ //null of undefined (eqnull)
				if(control.getControlType() === "ROTATION" || control.getControlType() === "TRANSLATION"){
					const transformName = control.getTransformName();
					let transform = kinematicGroup.getTransform(transformName);
					if(transform != null){ //null or undefined (eqnull)
						while(transform.parent != null){ //null or undefined (eqnull)
							depth++;
							transform = transform.parent;
						}
					}
				}
			}
			dofDepth[dofNames[i]] = depth;
		}

		/** @type {Array.<string>} */
		const sortedDOFNames = dofNames.slice();
		sortedDOFNames.sort(dofDepthComparator);

		/** @type {KinematicGroup} */
		this._kinematicGroup = kinematicGroup;

		/** @type {Array.<string>} */
		this._sortedDOFNames = sortedDOFNames;

		/** @type {Object.<string,CyclicDOFTargetSelector>} */
		this._globalTargetSelectors = globalTargetSelectors;

		/** @type {Object.<string,CyclicDOFTargetSelector>} */
		this._localTargetSelectors = localTargetSelectors;

		///////////init target selectors///////////////
		for(i = 0; i < dofNames.length; i++){
			const dofName = dofNames[i];
			if(kinematicGroup.getModelControlGroup().getDOFInfo(dofName).isCyclic()){
				if(customGlobalSelectors && customGlobalSelectors.hasOwnProperty(dofName)){
					globalTargetSelectors[dofName] = customGlobalSelectors[dofName];
				}else{
					globalTargetSelectors[dofName] = new CyclicDOFTargetSelector(dofName);
				}
				localTargetSelectors[dofName] = new CyclicDOFTargetSelector(dofName);
			}
		}
		///////////////////////////////////////////////

		/**
		 * Sort the provided list of dof names inplace by the order of the hierarchical location of
		 * their corresponding transforms, from root to leaves.  Each node will precede
		 * its children, and order amongst same-level nodes is arbitrary.  DOFs with no corresponding
		 * transforms will be at the beginning of the list in an arbitrary order.
		 *
		 * @param {string[]} dofNames - inplace list of dofnames to be sorted
		 * @return {string[]} the inplace dofNames list is sorted (modified) and also returned for convenience
		 */
		this.sortDOFsByDepth = function(dofNames){
			return dofNames.sort(dofDepthComparator);
		};

		/**
		 * Get the target selector for this DOF.  May be the default CyclicDOFTargetSelector,
		 * or a custom implementation for this joint that takes into account parent motion
		 * to find a better preferred direction.
		 *
		 * @param {string} dofName
		 * @returns {CyclicDOFTargetSelector}
		 */
		this.getGlobalTargetSelector = function(dofName){
			return globalTargetSelectors[dofName];
		};

		/**
		 * Get the target selector for this DOF.
		 *
		 * @param {string} dofName
		 * @returns {CyclicDOFTargetSelector}
		 */
		this.getLocalTargetSelector = function(dofName){
			return localTargetSelectors[dofName];
		};

		/**
		 * Modifies toPose inplace to represent an equivalent orientation for each dof, but with the values
		 * potentially modified to cyclically equivalent values to represent less global motion between
		 * fromPose and toPose.
		 *
		 * @param {Pose} fromPose - starting position
		 * @param {Pose} toPose - target position, will be modified to have the same orientation but less rotation
		 * @param {string[]} [onDOFs] - computed for these dofs.  dofs from fomPose used if null or undefined
		 */
		this.refineToGloballyClosestTargetPose = function(fromPose, toPose, onDOFs){
			if(onDOFs == null){ //null or undefined (eqnull)
				onDOFs = fromPose.getDOFNames();
			}

			const sortedOnDOFs = this.sortDOFsByDepth(onDOFs.slice(0));

			for (let di = 0; di < sortedOnDOFs.length; di++) {
				const targetSelector = this.getGlobalTargetSelector(sortedOnDOFs[di]);
				if(targetSelector) {
					const t = targetSelector.closestEquivalentRotation(fromPose, toPose);
					toPose.set(sortedOnDOFs[di], t, 0); //update pose for children computation
				}
			}
		};

		/**
		 * Modifies toPose inplace to represent an equivalent orientation for each dof, with the values
		 * computed to have each DOF have the least local motion to get to target.
		 *
		 * @param {Pose} fromPose - starting position
		 * @param {Pose} toPose - target position, will be modified to have the same orientation but less rotation
		 * @param {string[]} [onDOFs] - computed for these dofs.  dofs from fomPose used if null or undefined
		 */
		this.refineToLocallyClosestTargetPose = function(fromPose, toPose, onDOFs){
			if(onDOFs == null){ //null or undefined (eqnull)
				onDOFs = fromPose.getDOFNames();
			}

			//don't need to sort for local computations

			for (let di = 0; di < onDOFs.length; di++) {
				const targetSelector = this.getLocalTargetSelector(onDOFs[di]);
				if(targetSelector) {
					const t = targetSelector.closestEquivalentRotation(fromPose, toPose);
					toPose.set(onDOFs[di], t, 0); //save result in inplace output
				}
			}
		};
	}
}

export default DOFGlobalAlignment;