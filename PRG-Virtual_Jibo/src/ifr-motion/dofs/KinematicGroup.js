"use strict";

import Pose from "../base/Pose.js";

/**
 * @class THREE.Object3D
 * @property {boolean} _nodeDirtyToKG - indicate that this node has update position or rotation and needs local matrix update (it's children will also need world matrix updates)
 */

/**
 * THREE will update the "rotation" of each node with every quaternion update.
 * The quaternion rep is used by THREE to do the local/world frames, neither THREE
 * nor KG uses the rotation for the uses here, so let's save time and not update
 * them by removing the change listener on the quaternions.
 *
 * THREE will normally update the entire tree to get up to date world/local frames.
 * We're adding a dirty flag so we can skip local updates of nodes that haven't changed,
 * and global updates of those whose parents haven't as well.
 *
 * @param {THREE.Object3D} node
 */
const configureTHREETree = function (node) {
    //strip the quatnernion change listener to stop updates of "rotation"
    node.quaternion.onChange(function () { });

    //add our own "dirty" flag which we will use to do less updating of world frames when things don't move
    node._nodeDirtyToKG = true;
    //node._parentDirtyToKG = true;

    for (let i = 0; i < node.children.length; i++) {
        configureTHREETree(node.children[i]);
    }
};

/**
 *
 * @param {ModelControlGroup} modelControlGroup
 * @param {THREE.Object3D} hierarchyRoot
 * @constructor
 */
class KinematicGroup {
    constructor(modelControlGroup, hierarchyRoot) {
        /**
         * @type {ModelControlGroup}
         * @private
         */
        this._modelControlGroup = modelControlGroup;

        /**
         * @type {THREE.Object3D}
         * @private
         */
        this._hierarchyRoot = hierarchyRoot;

        /** @type {Object<string, THREE.Object3D>} */
        this._modelMap = null;

        /**
         * @type {Pose}
         * @private
         */
        this._lastPose = new Pose("KG Last Pose", modelControlGroup.getDOFNames());

        configureTHREETree(this._hierarchyRoot);

        /**
         * if "true", we assume that no one else is modifying our transform hierarchy, so we can
         * lazy-update because we know which transforms will have changed
         *
         * @type {boolean}
         * @private
         */
        this._assumeKGHasSoleHierarcyControl = true;
    }

    /**
     * Get a copy of this KinematicGroup, including a copy of the transform hierarchy and a copy of the ModelControls,
     * bound to the new hierarchy.  If requiredTransforms is present, the copy will include a sub-tree of the original
     * hierarchy, with only transforms required to connect the required transforms to the root.  Only ModelControls
     * associated with those branches will be included.
     *
     * If kinematicOnly is true, the copy will only include controls that are associated with the motion of transforms,
     * not any render-only controls (e.g, texture, color, etc.).
     *
     * @param {string[]} [requiredTransforms] - if present, only include chains connecting root to required transforms
     * @param {boolean} [kinematicOnly=true] - if true, only include ModelControls that represent kinematic motions
     * @returns {KinematicGroup}
     */
    getCopy(requiredTransforms, kinematicOnly) { // eslint-disable-line no-unused-vars
        //TODO: support requiredTransforms and kinematicOnly
        //TODO: get meshes out of here!

        let copiedHierarchy;

        if (requiredTransforms != null && this._hierarchyRoot != null) {
            const toInclude = {};
            const modelMap = this.getModelMap();
            for (let i = 0; i < requiredTransforms.length; i++) {
                let t = modelMap[requiredTransforms[i]];
                while (t != null) {
                    if (!toInclude.hasOwnProperty(t.name)) {
                        toInclude[t.name] = true;
                        t = t.parent;
                    } else {
                        t = null; //met up with already traversed root
                    }
                }
            }
            if (toInclude[this._hierarchyRoot.name]) {
                copiedHierarchy = copyTree(this._hierarchyRoot, toInclude);
            } else {
                console.log("Warning, none of required dofs (" + (requiredTransforms == null ? "null" : requiredTransforms.toString()) + ")present in hierarchy!");
                copiedHierarchy = null;
            }
        } else {
            copiedHierarchy = this._hierarchyRoot ? this._hierarchyRoot.clone() : null;
        }
        const copiedGroup = this._modelControlGroup ? this._modelControlGroup.getCopy() : null;
        copiedGroup.attachToModelAndPrune(copiedHierarchy);
        //if(requiredTransforms!=null) {
        //	console.log("MADE TREE! for trans " + requiredTransforms.toString());
        //	printTree(copiedHierarchy);
        //}
        return new KinematicGroup(copiedGroup, copiedHierarchy);
    }

    /**
     *
     * @param {Pose} inplacePose
     * @return {Pose}
     */
    getPose(inplacePose) { // eslint-disable-line no-unused-vars
        //TODO
    }

    /**
     *
     * @param {Pose} pose
     */
    setFromPose(pose) {
        if (!this._assumeKGHasSoleHierarcyControl || !this._lastPose.equalsNoChange0Only(pose)) {
            this._modelControlGroup.updateFromPose(pose);
            this._lastPose.setPose(pose);
        }
    }

    /**
     * Update the world coordinate frames of the attached hierarchy.  This function relies on all
     * modifies of the Object3D tree setting the _nodeDirtyToKG flag on the objects.
     */
    updateWorldCoordinateFrames() {
        let i, length;
        const root = this._hierarchyRoot;

        let parentDirty = false;

        if (root._nodeDirtyToKG) {
            root.updateMatrix();
            root._nodeDirtyToKG = false;
            root.matrixWorld.copy(root.matrix);
            parentDirty = true;
        }

        length = root.children.length;
        for (i = 0; i < length; i++) {
            this._updateWorldCoordinateFramesRecurse(root.children[i], parentDirty);
        }
    }

    /**
     * Called by updateWorldCoordinateFrames to recursively update the rest of the tree
     * as necessary.
     *
     * @param {THREE.Object3D} node - node to update (can NOT be the root of the tree)
     * @param {boolean} parentDirty - true if the parents of this node have been updated
     * @private
     */
    _updateWorldCoordinateFramesRecurse(node, parentDirty) {
        let i, length;

        if (node._nodeDirtyToKG) {
            node.updateMatrix();
            node._nodeDirtyToKG = false;
            parentDirty = true;
        }

        if (parentDirty) {
            node.matrixWorld.multiplyMatrices(node.parent.matrixWorld, node.matrix);
        }

        length = node.children.length;
        for (i = 0; i < length; i++) {
            this._updateWorldCoordinateFramesRecurse(node.children[i], parentDirty);
        }
    }

    ///**
    // * Calls the original full-update from THREE
    // */
    //KinematicGroup.prototype.updateWorldCoordinateFramesOriginal = function(){
    //	this._hierarchyRoot.updateMatrixWorld();
    //};
    //
    //
    ///**
    // * Update the world coordinate frames of the attached hierarchy.  A non-recursive
    // * technique.  Seems slightly slower than the recursive version.
    // */
    //KinematicGroup.prototype.updateWorldCoordinateFramesb = function(){
    //	var i = 0, length = 0;
    //
    //	var root = this._hierarchyRoot;
    //	var processNodesCleanParent = [];
    //	var processNodesDirtyParent = [];
    //
    //	//console.log("beginO");
    //
    //	if (root._nodeDirtyToKG){
    //		root.updateMatrix();
    //		root._nodeDirtyToKG = false;
    //		root.matrixWorld.copy(root.matrix);
    //		length = root.children.length;
    //		for(i = 0; i < length; i++){
    //			processNodesDirtyParent.push(root.children[i]);
    //		}
    //		//console.log("processing update of root");
    //	}else{
    //		//console.log("skipping update of root");
    //		length = root.children.length;
    //		for(i = 0; i < length; i++){
    //			processNodesCleanParent.push(root.children[i]);
    //		}
    //	}
    //
    //
    //	/**
    //	 * @type {THREE.Object3D}
    //	 */
    //	var node = processNodesCleanParent.pop();
    //
    //	//unrolled this logic a bit.  track parent dirty status with the different lists instead of setting a field.
    //
    //	while(node !== undefined){
    //		if(node._nodeDirtyToKG){
    //			node.updateMatrix();
    //			node._nodeDirtyToKG = false;
    //
    //			node.matrixWorld.multiplyMatrices(node.parent.matrixWorld, node.matrix);
    //
    //			length = root.children.length;
    //			for(i = 0; i < length; i++){
    //				processNodesDirtyParent.push(node.children[i]);
    //			}
    //		}else{
    //			length = root.children.length;
    //			for(i = 0; i < length; i++){
    //				processNodesCleanParent.push(node.children[i]);
    //			}
    //		}
    //		node = processNodesCleanParent.pop();
    //	}
    //
    //	node = processNodesDirtyParent.pop();
    //
    //	while(node !== undefined){
    //		if(node._nodeDirtyToKG){
    //			node.updateMatrix();
    //			node._nodeDirtyToKG = false;
    //
    //			node.matrixWorld.multiplyMatrices(node.parent.matrixWorld, node.matrix);
    //
    //			length = root.children.length;
    //			for(i = 0; i < length; i++){
    //				processNodesDirtyParent.push(node.children[i]);
    //			}
    //		}else{
    //			node.matrixWorld.multiplyMatrices(node.parent.matrixWorld, node.matrix);
    //
    //			length = root.children.length;
    //			for(i = 0; i < length; i++){
    //				processNodesDirtyParent.push(node.children[i]);
    //			}
    //		}
    //		node = processNodesDirtyParent.pop();
    //	}
    //};

    /**
     * @return {string[]}
     */
    getDOFNames() {
        return this._modelControlGroup.getDOFNames();
    }

    /**
     * @return {ModelControlGroup}
     */
    getModelControlGroup() {
        return this._modelControlGroup;
    }

    /**
     * @return {THREE.Object3D}
     */
    getRoot() {
        return this._hierarchyRoot;
    }

    /**
     * @return {Object<string, THREE.Object3D>}
     */
    getModelMap() {
        if (!this._modelMap) {
            this._modelMap = KinematicGroup.generateTransformMap(this._hierarchyRoot);
        }
        return this._modelMap;
    }

    /**
     * @param {string} transformName
     * @return {THREE.Object3D}
     */
    getTransform(transformName) {
        if (!this._modelMap) {
            this._modelMap = KinematicGroup.generateTransformMap(this._hierarchyRoot);
        }
        return this._modelMap[transformName];
    }

    toString() {
        return "KinematicGroup:\n\tDOFs:" + this.getDOFNames() + "\n\tTree:\n" + treeToString(this._hierarchyRoot, "\t\t") + "\n\tNumControls:" + this._modelControlGroup.getControlList().length;
    }

    /**
     * @param {THREE.Vector3} hierarchyRoot
     * @returns {Object.<string, THREE.Object3D>}
     */
    static generateTransformMap(hierarchyRoot) {
        /** @type {Object.<string, THREE.Object3D>} */
        const modelMap = {};

        // flatten model tree
        /** @type {Array.<THREE.Object3D>} */
        const nodesToVisit = [hierarchyRoot];
        while (nodesToVisit.length > 0) {
            const node = nodesToVisit.shift();
            if (node.name) {
                modelMap[node.name] = node;
            }
            if (node.children) {
                for (let c = 0; c < node.children.length; c++) {
                    nodesToVisit.push(node.children[c]);
                }
            }
        }
        return modelMap;
    }
}

/**
 * Copy tree, but only nodes in map.  Assumes that "node" is in map
 *
 * @param node
 * @param {Object.<string,boolean>} includeNamesMap - map of boolean values, true to include.  assumed to be continuous and touch root.
 */
const copyTree = function (node, includeNamesMap) {
    const n = node.clone(undefined, false);
    for (let i = 0; i < node.children.length; i++) {
        const c = node.children[i];
        if (c.name != null && includeNamesMap[c.name]) {
            n.add(copyTree(c, includeNamesMap));
        }
    }
    return n;
};

const printTree = function (node, tabs) {
    if (tabs == null) {
        tabs = "";
    }
    console.log(tabs + node.name);
    for (let i = 0; i < node.children.length; i++) {
        printTree(node.children[i], tabs + "\t");
    }
};

const treeToString = function (node, tabs) {
    if (tabs == null) {
        tabs = "";
    }
    let s = tabs + node.name;
    for (let i = 0; i < node.children.length; i++) {
        s += "\n" + treeToString(node.children[i], tabs + "\t");
    }
    return s;
};

export default KinematicGroup;