export default slog;
export type SlogDelegate = (channel: string, message: string) => any;
/**
 * @param {string} channel
 * @param {string} message
 * @param {string} [priority]
 */
declare function slog(channel: string, message: string, priority?: string): void;
declare namespace slog {
    namespace BaseChannels {
        let INFO: string;
        let WARN: string;
        let ERROR: string;
    }
    /**
     * Enum Values for default channels.
     */
    type BaseChannels = string;
    namespace Levels {
        export let DEBUG: string;
        let INFO_1: string;
        export { INFO_1 as INFO };
        let WARN_1: string;
        export { WARN_1 as WARN };
        let ERROR_1: string;
        export { ERROR_1 as ERROR };
    }
    /**
     * Enum Values for priority levels.
     */
    type Levels = string;
    /**
     * Calls slog(INFO, message).
     *
     * @param {string} message
     */
    function info(message: string): void;
    /**
     * Calls slog(WARN, message).
     *
     * @param {string} message
     */
    function warn(message: string): void;
    /**
     * Calls slog(ERROR, message).
     *
     * @param {string} message
     */
    function error(message: string): void;
    /**
     * Sets the default delegate which will handle all channels not explicitly
     * covered by a channel delegate.  Pass null for a NOP handler that prints nothing
     *
     * @param {SlogDelegate} slogDelegate - default delegate, null for NOP (silent) delegate
     */
    function setDefaultDelegate(slogDelegate: SlogDelegate): void;
    /**
     * Sets the delegate for a particular channel.  Pass null for a NOP handler that prints nothing
     * @param {string} channel
     * @param {SlogDelegate} slogDelegate - channel delegate, null for NOP (silent) delegate
     */
    function setChannelDelegate(channel: string, slogDelegate: SlogDelegate): void;
    /**
     * Clear the delegate from the given channel (channel will be handled by default delegate).
     * Pass null to clear all channel delegates
     *
     * @param {string} channel - channel to clear, null to clear all channels
     */
    function clearChannelDelegate(channel: string): void;
    /**
     * Set the function that will be used for any channel specified to "print" without a custom delegate.
     * E.g., default behavior if setDefaultPrinting is true, setPrintChannels, setPrintAll, etc.
     *
     * This will be the print function used for any channel/default enabled after this point, it will
     * also be applied to any channel that was printing using the previous selected printer.
     *
     * Pass null to switch to basic console style printing
     *
     * @param printer
     */
    function setPrinter(printer: any): void;
    /**
     * Set the "default" behavior (behavior for channels not explicitly specified) to print or not print
     *
     * @param {boolean} print - true to print channels not explicitly specified, false to not print those channels
     */
    function setDefaultPrinting(print: boolean): void;
    /**
     * Convenience function to configure slog to print only the channels listed.  Clears all other
     * initialized state.
     *
     * Equivalent to setting the default delegate to NOP delegate, setting the given channels
     * to simple console printing delegates, and clearing all other channel delegates
     *
     * @param {string[]} channels - channels to print, null same as setPrintNone
     */
    function setPrintChannels(channels: string[]): void;
    /**
     *
     * @param {string[]} channels - channels to add to set that will print
     */
    function addPrintChannels(channels: string[]): void;
    /**
     *
     * @param {string[]} channels - channels to remove to set that will print
     */
    function removePrintChannels(channels: string[]): void;
    /**
     * Convenience function to configure slog to print all channels.  Clears all other
     * initialized state.
     *
     * Equivalent to setting the default delegate to a simple console printing delegate
     * and clearing all channel delegates
     */
    function setPrintAll(): void;
    /**
     * Convenience function to configure slog to print nothing.  Clears all other
     * initialized state.
     *
     * Equivalent to setting the default delegate to a NOP delegate
     * and clearing all channel delegates
     */
    function setPrintNone(): void;
    /**
     *
     * @param {function} debug - send enabled debug channels to this function
     * @param {function} info - send enabled info channels to this function
     * @param {function} warnings - enable warnings and send them to this function (if non-null)
     * @param {function} errors - enable errors and send them to this function (if non-null)
     */
    function wrapLog(debug: Function, info: Function, warnings: Function, errors: Function): void;
}
