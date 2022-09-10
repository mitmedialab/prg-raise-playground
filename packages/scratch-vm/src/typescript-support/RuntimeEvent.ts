const enum RuntimeEvent {
  /**
   * Event name for glowing a script.
   */
  ScriptGlowOn = 'SCRIPT_GLOW_ON',
  /**
   * Event name for unglowing a script.
   */
  ScriptGlowOff = 'SCRIPT_GLOW_OFF',
  /**
   * Event name for glowing a block.
   */
  BlockGlowOn = 'BLOCK_GLOW_ON',
  /**
   * Event name for unglowing a block.
   */
  BlockGlowOff = 'BLOCK_GLOW_OFF',
  /**
   * Event name for a cloud data update to this project.
   */
  HasCloudDataUpdate = 'HAS_CLOUD_DATA_UPDATE',
  /**
   * Event name for turning on turbo mode.
   */
  TurboModeOn = 'TURBO_MODE_ON',
  /**
   * Event name for turning off turbo mode.
   */
  TurboModeOff = 'TURBO_MODE_OFF',
  /**
   * Event name for turning on turbo mode.
   */
  RecordingOn = 'RECORDING_ON',
  /**
   * Event name for turning off turbo mode.
   */
  RecordingOff = 'RECORDING_OFF',
  /**
   * Event name when the project is started (threads may not necessarily be running).
   */
  ProjectStart = 'PROJECT_START',
  /**
   * Event name when threads start running.
   * Used by the UI to indicate running status.
   */
  ProjectRunStart = 'PROJECT_RUN_START',
  /**
   * Event name when threads stop running
   * Used by the UI to indicate not-running status.
   */
  ProjectRunStop = 'PROJECT_RUN_STOP',
  /**
   * Event name for project being stopped or restarted by the user.
   * Used by blocks that need to reset state.
   */
  ProjectStopAll = 'PROJECT_STOP_ALL',
  /**
   * Event name for target being stopped by a stop for target call.
   * Used by blocks that need to stop individual targets.
   */
  StopForTarget = 'STOP_FOR_TARGET',
  /**
   * Event name for visual value report.
   */
  VisualReport = 'VISUAL_REPORT',
  /**
   * Event name for project loaded report.
   */
  ProjectLoaded = 'PROJECT_LOADED',
  /**
   * Event name for report that a change was made that can be saved
   */
  ProjectChanged = 'PROJECT_CHANGED',
  /**
   * Event name for report that a change was made to an extension in the toolbox.
   */
  ToolboxExtensionsNeedUpdate = 'TOOLBOX_EXTENSIONS_NEED_UPDATE',
  /**
   * Event name for targets update report.
   */
  TargetsUpdate = 'TARGETS_UPDATE',
  /**
   * Event name for monitors update.
   */
  MonitorsUpdate = 'MONITORS_UPDATE',
  /**
   * Event name for block drag update.
   */
  BlockDragUpdate = 'BLOCK_DRAG_UPDATE',
  /**
   * Event name for block drag end.
   */
  BlockDragEnd = 'BLOCK_DRAG_END',
  /**
   * Event name for reporting that an extension was added.
   */
  ExtensionAdded = 'EXTENSION_ADDED',
  /**
   * Event name for reporting that an extension as asked for a custom field to be added
   */
  ExtensionFieldAdded = 'EXTENSION_FIELD_ADDED',
  /**
   * Event name for updating the available set of peripheral devices.
   * This causes the peripheral connection modal to update a list of available peripherals.
   */
  PeripheralListUpdate = 'PERIPHERAL_LIST_UPDATE',
  /**
   * Event name for reporting that a peripheral has connected.
   * This causes the status button in the blocks menu to indicate 'connected'.
   */
  PeripheralConnected = 'PERIPHERAL_CONNECTED',
  /**
   * Event name for reporting that a peripheral has been intentionally disconnected.
   * This causes the status button in the blocks menu to indicate 'disconnected'.
   */
  PeripheralDisconnected = 'PERIPHERAL_DISCONNECTED',
  /**
   * Event name for reporting that a peripheral has encountered a request error.
   * This causes the peripheral connection modal to switch to an error state.
   */
  PeripheralRequestError = 'PERIPHERAL_REQUEST_ERROR',
  /**
   * Event name for reporting that a peripheral connection has been lost.
   * This causes a 'peripheral connection lost' error alert to display.
   */
  PeripheralConnectionLostError = 'PERIPHERAL_CONNECTION_LOST_ERROR',
  /**
   * Event name for reporting that a peripheral has not been discovered.
   * This causes the peripheral connection modal to show a timeout state.
   */
  PeripheralScanTimeout = 'PERIPHERAL_SCAN_TIMEOUT',
  /**
   * Event name to indicate that the microphone is being used to stream audio.
   */
  MicListening = 'MIC_LISTENING',
  /**
   * Event name for reporting that blocksInfo was updated.
   */
  BlocksInfoUpdate = 'BLOCKSINFO_UPDATE',
  /**
   * Event name when the runtime tick loop has been started.
   */
  RuntimeStarted = 'RUNTIME_STARTED',
  /**
   * Event name when the runtime dispose has been called.
   */
  RuntimeDisposed = 'RUNTIME_DISPOSED',
  /**
   * Event name for reporting that a block was updated and needs to be rerendered.
   */
  BlocksNeedUpdate = 'BLOCKS_NEED_UPDATE',
}

export default RuntimeEvent;