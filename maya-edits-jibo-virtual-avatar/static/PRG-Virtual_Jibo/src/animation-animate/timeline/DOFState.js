/**
 * @param {number[]} value
 * @param {Object.<string, string|number|boolean>} properties
 * @constructor
 */
class DOFState {
    constructor(value, properties) {
        value = (value) ? value : [];
        properties = (properties) ? properties : {};

        /**
         * @return {number[]}
         */
        this.getValue = function() {
            return value;
        };

        /**
         * @return {Object.<string, string|number|boolean>}
         */
        this.getProperties = function() {
            return properties;
        };
    }
}

export default DOFState;