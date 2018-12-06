"use strict";
const hda = require("hdamhub");
const neeoapi = require("neeo-sdk");
const CONSTANTS = require("./constants");

/* let sliderValue = 0;
let switchValue = true; */

module.exports = class hdaController {
  constructor() {
    /*
     * Getters and setters:
     * - The getters are used to send the current Values through the SDK (read)
     * - The setter allow changing values on the Brain and handling the changes here (write)
     */
    /*     this.sliderHandlers = {
      getter: deviceId => this.sliderGet(deviceId),
      setter: (deviceId, params) => this.sliderSet(deviceId, params)
    };
    this.switchHandlers = {
      getter: deviceId => this.switchSet(deviceId),
      setter: (deviceId, params) => this.switchSet(deviceId, params)
    }; */
  }

  static build() {
    return new hdaController();
  }

  onButtonPressed(name, deviceId) {
    console.log(`${name} Button pressed for ${deviceId}`);
  }

  buildProDevice() {
    //NOTE the device name must match the "root" name of the driver!
    return (
      neeoapi
        .buildDevice(CONSTANTS.MHUB_DEVICE_NAME)
        .setSpecificName("PRO LIGHT")
        .setManufacturer("NEEO")
        .setType("light")
        .addCapability("dynamicDevice")
        // Here we add the power switch like the lite device
        .addSwitch(CONSTANTS.POWER_SWITCH, this.switchHandlers)
        // And the slider a feature not available on the lite device
        .addSlider(CONSTANTS.DIMMER, this.sliderHandlers)
    );
  }

  async discoverDevices(optionalDeviceId) {
    console.log("[CONTROLLER] discovery call", optionalDeviceId);
    let mhubdrivers = [];

    if (typeof optionalDeviceId == "undefined") {
      let mhubs = await hda.discover();
      for (let driver of mhubs) {
        let mhubsysinfo = await driver.getSystemInfo();
        let id = driver.host;
        let deviceName = `${mhubsysinfo.mhub.mhub_official_name}, ${driver.host}`;
        let [inputs, outputs] = hdaGetInputsOutputs(mhubsysinfo);

        let mhubDriver = neeoapi.buildDevice(CONSTANTS.MHUB_DEVICE_NAME);
        //mhubDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
        mhubDriver.setSpecificName(deviceName);
        mhubDriver.setType("HDMISWITCH");
        mhubDriver.addCapability("dynamicDevice");
        hdaBuildInputOutputButtons(mhubDriver, inputs, outputs);
        //mhubDriver.addButton({ name: "POWER ON", label: "POWER ON" });
        //mhubDriver.addButton({ name: "POWER OFF", label: "POWER OFF" });
        //mhubDriver.addButtonHander(controller.onButtonPressed);
        mhubdrivers.push({ id, name: deviceName, device: mhubDriver });
      }
      return mhubdrivers;
    } else {
      console.log("FIND ME!!!!!");
    }
  }
};

function hdaGetInputsOutputs(mhubsysinfo) {
  let inputs = [];
  let outputs = [];
  for (let i in mhubsysinfo.io_data.input_audio) {
    for (let input of mhubsysinfo.io_data.input_audio[i].labels) {
      inputs.push(input);
    }
  }
  for (let i in mhubsysinfo.io_data.input_video) {
    for (let input of mhubsysinfo.io_data.input_video[i].labels) {
      inputs.push(input);
    }
  }

  for (let i in mhubsysinfo.io_data.output_audio) {
    for (let input of mhubsysinfo.io_data.output_audio[i].labels) {
      outputs.push(input);
    }
  }
  for (let i in mhubsysinfo.io_data.output_video) {
    for (let input of mhubsysinfo.io_data.output_video[i].labels) {
      outputs.push(input);
    }
  }
  return [inputs, outputs];
}

function hdaBuildInputOutputButtons(mhubDriver, inputs, outputs) {
  for (let input of inputs) {
    for (let output of outputs) {
      mhubDriver.addButton({ name: `INPUT_${input.id}_${output.id}`, label: `INPUT ${input.label} to ${output.label}` });
    }
  }
}
