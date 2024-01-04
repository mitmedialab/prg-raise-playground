import { ArgumentType, BlockType, Environment, ExtensionMenuDisplayDetails, extension, block, buttonBlock } from "$common";
import BlockUtility from "$scratch-vm/engine/block-utility";
import { Anim, anims } from "./enums";
import Doodlebot, { Services } from "./Doodlebot";
import UartService from "./communication/UartService";
import EventEmitter from "events";

const details: ExtensionMenuDisplayDetails = {
  name: "Doodlebot",
  description: "Program a doodlebot robot",
  iconURL: "Replace with the name of your icon image file (which should be placed in the same directory as this file)",
  insetIconURL: "Replace with the name of your inset icon image file (which should be placed in the same directory as this file)"
};

export default class ExtensionNameGoesHere extends extension(details, "indicators") {

  private robot: BluetoothDevice;
  private uart: UartService;
  private motorEvent = new EventEmitter();
  private dataEvent = new EventEmitter();

  init(env: Environment) {
  }

  async onDeviceConnected(robot: BluetoothDevice, { uartService }: Services) {
    this.robot = robot;
    this.uart = uartService;
    console.log("Connected to bluetooth device: ", robot);

    // update peripheral indicator
    this._robotStatus = 2;

    await this.indicateFor({ position: "category", msg: "Connected to robot" }, 1000);

    // set listener for device disconnected
    console.log("Listen for device disconnect");
    this.robot.addEventListener("gattserverdisconnected", this.onDeviceDisconnected.bind(this));

    this.uart.addEventListener("receiveText", this.updateSensors.bind(this));

    // set up the text
    await this.sendCommandToRobot("(d,x,2,1,65535)", command_pause);
    // start with face neutral
    this.playAnimation({ ANIM: "neutral" });
  }

  async onDeviceDisconnected() {
    console.log("Lost connection to robot");

    // stop blinking
    this.stopBlink();

    // TODO stop pixel animation interval

    await this.indicateFor({ position: "category", msg: "Disconnecting from robot" }, 1000);

    // update peripheral indicator

    this._robotStatus = 1;

    // remove event listeners
    if (this.uart && this.uart.removeEventListener)
      this.uart.removeEventListener(
        "receiveText",
        this.updateSensors.bind(this)
      );
    this._robotDevice.removeEventListener(
      "gattserverdisconnected",
      this.onDeviceDisconnected.bind(this)
    );

    // reset robot variables
    this._robotDevice = null;
    this._robotUart = null;
  }

  async connectToBLE() {
    console.log("Getting BLE device");
    const { bluetooth } = window.navigator;
    if (bluetooth) {
      try {
        // for development
        const deviceNamePrefix = "Bluefruit52"; // "Saira" "BBC micro:bit";
        const robot = await Doodlebot.requestRobot(bluetooth, deviceNamePrefix);
        const services = await Doodlebot.getServices(robot);
        if (services.uartService) this.onDeviceConnected(robot, services);
      } catch (err) {
        console.error(err);
        if (err.message == "Bluetooth adapter not available.") alert("Your device does not support BLE connections.");
        else if (err.message !== "User cancelled the requestDevice() chooser.")
          alert("There was a problem connecting your device, please try again or request assistance.");
      }
    }
  }

  updateSensors(event: CustomEvent<string>) {
    const dataLine = event.detail.split("(");
    console.log("Received message: ", dataLine); // for debugging

    for (let i = 0; i < dataLine.length; i++) {
      let data = dataLine[i];
      if (data) {
        if (data == "ms)") {
          console.log("Stop the motor");
          this.motorEvent.emit("stop");
        } else if (data != "") {
          let ds = data.split(",");
          const sensor = ds[0];
          switch (sensor) {
            case "b":
              const front = Number.parseInt(ds[1]);
              const back = Number.parseInt(ds[2]);
              this.dataEvent.emit("bumper.front", front);
              this.dataEvent.emit("bumper.back", back);
              this.sensorValues["bumper.front"] = front;
              this.sensorValues["bumper.back"] = back;
              break;
            case "l":
              this.dataEvent.emit(
                "color.red",
                Number.parseFloat(ds[1])
              );
              this.dataEvent.emit(
                "color.green",
                Number.parseFloat(ds[2])
              );
              this.dataEvent.emit(
                "color.blue",
                Number.parseFloat(ds[3])
              );
              this.sensorValues["color.red"] = Number.parseFloat(
                ds[1]
              );
              this.sensorValues["color.green"] =
                Number.parseFloat(ds[2]);
              this.sensorValues["color.blue"] = Number.parseFloat(
                ds[3]
              );
              break;
            case "d":
              this.dataEvent.emit(
                "distance",
                Number.parseInt(ds[1])
              );
              this.sensorValues["distance"] = Number.parseInt(
                ds[1]
              );
              break;
            case "h":
              this.dataEvent.emit(
                "humidity",
                Number.parseFloat(ds[1])
              );
              this.sensorValues["humidity"] = Number.parseFloat(
                ds[1]
              );
              break;
            case "t":
              this.dataEvent.emit(
                "temperature",
                Number.parseFloat(ds[1])
              );
              this.sensorValues["temperature"] =
                Number.parseFloat(ds[1]);
              break;
            case "p":
              this.dataEvent.emit(
                "pressure",
                Number.parseFloat(ds[1])
              );
              this.sensorValues["pressure"] = Number.parseFloat(
                ds[1]
              );
              break;
            case "o":
              this.dataEvent.emit(
                "magnetometer.roll",
                Number.parseFloat(ds[1])
              );
              this.dataEvent.emit(
                "magnetometer.pitch",
                Number.parseFloat(ds[2])
              );
              this.dataEvent.emit(
                "magnetometer.yaw",
                Number.parseFloat(ds[3])
              );
              this.sensorValues["magnetometer.roll"] =
                Number.parseFloat(ds[1]);
              this.sensorValues["magnetometer.pitch"] =
                Number.parseFloat(ds[2]);
              this.sensorValues["magnetometer.yaw"] =
                Number.parseFloat(ds[3]);
              break;
            case "g":
              this.dataEvent.emit(
                "gyroscope.x",
                Number.parseFloat(ds[1])
              );
              this.dataEvent.emit(
                "gyroscope.y",
                Number.parseFloat(ds[2])
              );
              this.dataEvent.emit(
                "gyroscope.z",
                Number.parseFloat(ds[3])
              );
              this.sensorValues["gyroscope.x"] =
                Number.parseFloat(ds[1]);
              this.sensorValues["gyroscope.y"] =
                Number.parseFloat(ds[2]);
              this.sensorValues["gyroscope.z"] =
                Number.parseFloat(ds[3]);
              break;
            case "u":
              this.dataEvent.emit(
                "altitude",
                Number.parseFloat(ds[1])
              );
              this.sensorValues["altitude"] = Number.parseFloat(
                ds[1]
              );
              break;
            case "x":
              this.dataEvent.emit(
                "accelerometer.x",
                Number.parseFloat(ds[1])
              );
              this.dataEvent.emit(
                "accelerometer.y",
                Number.parseFloat(ds[2])
              );
              this.dataEvent.emit(
                "accelerometer.z",
                Number.parseFloat(ds[3])
              );
              this.sensorValues["accelerometer.x"] =
                Number.parseFloat(ds[1]);
              this.sensorValues["accelerometer.y"] =
                Number.parseFloat(ds[2]);
              this.sensorValues["accelerometer.z"] =
                Number.parseFloat(ds[3]);
              break;
            case "f":
              this.dataEvent.emit(
                "battery",
                Number.parseFloat(ds[1])
              );
              this.sensorValues["battery"] = Number.parseFloat(
                ds[1]
              ); // TODO constantly monitor battery
              break;
            case "c":
              this.dataEvent.emit(
                "ipAddress",
                ds[1].substring(7).replace(")", "")
              );
              break;
            default:
              console.log("Received unrecognized data:", data);
          }
        }
      }
    }
  }



  @buttonBlock("Test Robot")
  test() {

  }

  @buttonBlock("Connect Robot")
  connect() {

  }

  @block({
    type: "command",
    text: (anim) => `play ${anim} animation`,
    arg: {
      type: "string",
      options: anims,
      defaultValue: "happy"
    }
  })
  playAnimation(anim: Anim) {

  }

  @block({
    type: "command",
    text: (text) => `display text ${text}`,
    arg: {
      type: "string",
      defaultValue: "Hello!"
    }
  })
  displayText(text: string) {

  }

  @block({
    type: "command",
    text: "clear display"
  })
  clearDisplay() {

  }
}