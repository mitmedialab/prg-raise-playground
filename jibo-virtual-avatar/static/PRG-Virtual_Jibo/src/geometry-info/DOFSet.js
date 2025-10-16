import FileTools from "../ifr-core/FileTools.js";
import slog from "../ifr-core/SLog.js";

const channel = "MODEL_LOADING";

/**
 * Protected constructor for internal use only.
 *
 * Creates a DOFSet, including the provided DOFs.
 * The dofSetGroup provided looks up other DOFSets by name when
 * sets are identified by name (e.g., in the "plus" function).
 *
 * @param {string[]} includeDOFs - DOFs in this set. If null, 0 DOFs will be in set.
 * @param {Object.<string, jibo.animate.DOFSet>} dofSetGroup - Map to look up other DOFSets by name when requested (e.g., "plus" function).
 * @class DOFSet
 * @intdocs
 * @memberof jibo.animate
 * @protected
 */
const DOFSet = function(includeDOFs, dofSetGroup){

	/** @type {Object.<string, boolean>} */
	/** @private */
	const _dofsSet = {};


	if(includeDOFs != null) { //checks for undefined or null (eqnull)
		for (let i = 0; i < includeDOFs.length; i++) {
			_dofsSet[includeDOFs[i]] = true;
		}
	}



	/**
	 * Creates a new DOFSet containing the all of the DOFs of this
	 * DOFSet plus all the dofs of the set passed in.  Duplicates
	 * are included only once (union of the sets)
	 * @method jibo.animate.DOFSet#plus
	 * @param {jibo.animate.DOFSet|string} otherSet - Set to add, either the name of the set or the actual DOFSet.
	 * @returns {jibo.animate.DOFSet} Union of this and otherSet.
	 */
	this.plus = function(otherSet){
		/** @type {DOFSet} */
		let setToAdd;

		if(typeof(otherSet) === "string"){
			setToAdd = dofSetGroup[otherSet];
		}else{
			setToAdd = otherSet;
		}

		const newList = this.getDOFs();
		const incomingList = setToAdd.getDOFs();

		if(setToAdd != null) { //check for null or undefined (eqnull)
			for (let i = 0; i < incomingList.length; i++) {
				//add all from otherSet that aren't already in
				if (!_dofsSet.hasOwnProperty(incomingList[i])) {
					newList.push(incomingList[i]);
				}
			}
		}

		return new DOFSet(newList, dofSetGroup);
	};

	/**
	 * Creates a new DOFSet containing all the DOFs of this
	 * DOFSet that are not present in otherSet.
	 * @method jibo.animate.DOFSet#minus
	 * @param {jibo.animate.DOFSet|string} otherSet - Set to subtract, either the name of the set or the actual DOFSet.
	 * @returns {jibo.animate.DOFSet} DOFSet containing DOFs of this set that are not in the argument set.
	 */
	this.minus = function(otherSet){
		/** @type {DOFSet} */
		let setToSubtract;

		if(typeof(otherSet) === "string"){
			setToSubtract = dofSetGroup[otherSet];
		}else{
			setToSubtract = otherSet;
		}

		const newList = [];
		const myDOFs = this.getDOFs();

		if(setToSubtract != null) { //check for null or undefined (eqnull)
			for (let i = 0; i < myDOFs.length; i++) {
				if (!setToSubtract.hasDOF(myDOFs[i])) {
					newList.push(myDOFs[i]);
				}
			}
		}else{
			newList.push(...myDOFs); //other is null
		}

		return new DOFSet(newList, dofSetGroup);
	};

	/**
	 * Get the DOFs from this set as an array of strings.
	 * @returns {string[]}
	 */
	this.getDOFs = function(){
		return Object.keys(_dofsSet);
	};


	/**
	 * Check if this DOFSet contains a particular DOF.
	 * @method jibo.animate.DOFSet#hasDOF
	 * @param {string} dofName - DOF name to test for membership in this set.
	 * @returns {boolean} true if this DOFSet has this dof.
	 */
	this.hasDOF = function(dofName){
		return _dofsSet.hasOwnProperty(dofName);
	};

	this.createFromDofs = function(dofs) {
		return new DOFSet(dofs, dofSetGroup);
	};
};


/**
 * @callback jibo.animate.DOFSet~DOFSetLoadCallback
 * @param {Object.<string, DOFSet>} allDOFSets - Set of all DOFSets, or null if load failed.
 * @param {string} errorMessage - Error message if error occurred.
 * @private
 */

/**
 *
 * @param {string} url
 * @param {DOFSetLoadCallback} callback
 * @private
 */
DOFSet.load = function(url, callback){
	FileTools.loadJSON(url, function(error, data){
		if (error === null) {
			const allDOFSets = DOFSet.createDOFSetsFromJSON(data);
			if (callback){
				callback(allDOFSets, null);
			}
		}else{
			if (callback){
				callback(null, error);
			}
		}
	});
};

/**
 * @param {Object} jsonData
 * @return {Object.<string, DOFSet>}
 * @private
 */
DOFSet.createDOFSetsFromJSON = function(jsonData) {
	if (jsonData.header.fileType !== "DOFSets") {
		slog(channel, "DOFSet doesn't know how to parse file with type "+jsonData.header.fileType);
	}

	/** @type {Object.<string, string[]>} */
	const jsonDOFSets = jsonData.content.DOFSets;
	const names = Object.keys(jsonDOFSets);

	/** @type {Object.<string, DOFSet>} */
	const allDOFSets = {};

	for(let i = 0; i < names.length; i++){
		allDOFSets[names[i]] = new DOFSet(jsonDOFSets[names[i]], allDOFSets);
	}

	if(jsonData.content.hasOwnProperty("CompoundSets")){
		//CompoundSets should be a map from DOFSet names (name of set being created)
		//to names of basic DOFSets defined in the DOFSet map above
		// (previously defined CompoundSets are also ok, if they are defined earlier in the file)
		//all names in a single compound will be combined into one set
		const compoundSets = jsonData.content.CompoundSets;
		const compoundNames = Object.keys(compoundSets);

		for(let i = 0; i < compoundNames.length; i++){
			const combineTheseSets = compoundSets[compoundNames[i]];
			let cs = new DOFSet(null, allDOFSets);
			for(let c = 0; c < combineTheseSets.length; c++){
				const basicSet = combineTheseSets[c];
				if(allDOFSets.hasOwnProperty(basicSet)) {
					cs = cs.plus(allDOFSets[basicSet]);
				}else{
					slog(channel, "Error, compound DOFSet "+compoundNames[i]+" requested basic set "+basicSet+" but it is not present in file");
				}
			}
			allDOFSets[compoundNames[i]] = cs;
		}
	}

	return allDOFSets;
};


export default DOFSet;
