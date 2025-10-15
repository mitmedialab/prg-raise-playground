/**
 * @param {Array.<string>} dofNames - array of DOF names that this pose will store values for
 * @constructor
 */
class PropertiesPose {
    constructor(dofNames) {
        dofNames = (dofNames !== undefined) ? dofNames : [];
        /** @type {Object.<string, Object.<string, string|number|boolean>>} */
        this.dofVals = {};
        for (let i = 0; i < dofNames.length; i++) {
            this.dofVals[dofNames[i]] = {};
        }
    }

    /**
     * Set the entry for the specified DOF name to the specified value.  If the specified DOF name
     * is not an element of this pose, this call has no effect.
     *
     * @param {string} dofName - name of the DOF entry to set
     * @param {Object.<string, string|number|boolean>} dofProperties - properties for the specified DOF
     */
    set(dofName, dofProperties) {
        if (this.dofVals.hasOwnProperty(dofName)) {
            this.dofVals[dofName] = {};
            const props = (dofProperties) ? dofProperties : {};
            const keys = Object.keys(props);
            for (let i = 0; i < keys.length; i++) {
                this.dofVals[dofName][keys[i]] = props[keys[i]];
            }
        }
    }

    /**
     * Adds the specified properties to the current set of properties for the specified DOF.  If the specified DOF name
     * is not an element of this pose, this call has no effect.
     *
     * @param {string} dofName - name of the DOF entry to add to
     * @param {Object.<string, string|number|boolean>} dofProperties - properties for the specified DOF
     */
    add(dofName, dofProperties) {
        if (this.dofVals.hasOwnProperty(dofName)) {
            const props = (dofProperties) ? dofProperties : {};
            const keys = Object.keys(props);
            for (let i = 0; i < keys.length; i++) {
                this.dofVals[dofName][keys[i]] = props[keys[i]];
            }
        }
    }

    /**
     * Get the properties for the specified DOF.  If the specified DOF is not an
     * element of this pose, null is returned.
     *
     * If propertyName is specified, this call will return the specified element of the DOF's
     * property set, or null if no such element exists.
     *
     * @param {string} dofName name of the DOF value to get
     * @param {string} [propertyName] property name to get
     * @return {*} the requested DOF value, or null if not present
     */
    get(dofName, propertyName) {
        if (this.dofVals.hasOwnProperty(dofName)) {
            let val;
            if (propertyName !== undefined) {
                val = this.dofVals[dofName][propertyName];
            } else {
                val = this.dofVals[dofName];
            }
            return (val !== undefined) ? val : null;
        } else {
            return null;
        }
    }

    /**
     * @return {Array.<string>} the array of DOF names that this pose stores values for
     */
    getDOFNames() {
        return Object.keys(this.dofVals);
    }

    /**
     * Get a copy of this pose that does not share any reps.
     *
     * @return {PropertiesPose}
     */
    getCopy() {
        const dofNames = this.getDOFNames();
        const p = new PropertiesPose(dofNames);
        for (let i = 0; i < dofNames.length; i++) {
            p.add(dofNames[i], this.get(dofNames[i]));
        }
        return p;
    }
}

export default PropertiesPose;