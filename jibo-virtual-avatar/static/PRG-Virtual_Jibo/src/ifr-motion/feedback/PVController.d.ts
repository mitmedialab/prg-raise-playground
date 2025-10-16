export default PVController;
declare class PVController {
    /**
     * @param {Time} time
     * @override
     */
    override calculateForTime(time: Time): void;
    _commandVelocityPVC: any;
    /**
     * @override
     * @returns {number}
     */
    override getCommandVelocity(): number;
}
