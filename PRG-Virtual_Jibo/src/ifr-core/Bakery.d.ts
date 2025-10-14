export default Bakery;
declare namespace Bakery {
    /**
     * Initialize the Bakery with a specific Bakery implementation.  This should be called once, the result is cached
     * statically so subsequent calls to getFloat etc. will display their UI via the given implementation.
     *
     * @param {Object} bakeryImplementation
     */
    function init(bakeryImplementation: any): void;
    /**
     * First call will initialize/display a slider with the provided name in the
     * tab listed.  If tabName is an array of strings, there will be set of nested
     * tabs.
     * @param {string} name - name of slider
     * @param {number} min - minimum of slider
     * @param {number} max - maximum of slider
     * @param {number} initial - initial value of slider and produced value
     * @param {string | string[]} [tabName] - the tab name (or path) to display the ui in.  put in "default" tab if omitted
     * @returns {number}
     */
    function getFloat(name: string, min: number, max: number, initial: number, tabName?: string | string[]): number;
    /**
     * First call will initialize/display a checkbox with the provided name in the
     * tab listed.  If tabName is an array of strings, there will be set of nested
     * tabs.
     * @param {string} name - name of checkbox
     * @param {boolean} initial - initial value of checkbox and produced value
     * @param {string | string[]} [tabName] - the tab name (or path) to display the ui in.  put in "default" tab if omitted
     * @returns {boolean}
     */
    function getBoolean(name: string, initial: boolean, tabName?: string | string[]): boolean;
    /**
     * First call will initialize/display a button with the provided name in the
     * tab listed.  If tabName is an array of strings, there will be set of nested
     * tabs.
     * @param {string} name - name of button
     * @param callback - callback called when button pressed
     * @param {string | string[]} [tabName] - the tab name (or path) to display the ui in.  put in "default" tab if omitted
     */
    function makeButton(name: string, callback: any, tabName?: string | string[]): void;
    /**
     * First call will initialize/display a text label with provided text.
     * (label:text).  Subsequent calls change the text.
     *
     * @param {string} name - name of label, will show up in the display
     * @param {string} text - text to show
     * @param {string | string[]} [tabName] - the tab name (or path) to display the ui in.  put in "default" tab if omitted
     */
    function showText(name: string, text: string, tabName?: string | string[]): void;
    /**
     * Get the currently-installed Bakery implementation (may be null).
     *
     * @param {string | string[]} [tabName] - the tab name (or path) of the desired Baker
     * @returns {?} The currently-installed Bakery implementation.
     */
    function getBaker(tabName?: string | string[]): any;
}
