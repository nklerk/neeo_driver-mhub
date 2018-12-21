"use strict";

const hdaMhub = require("hdamhub");
const neeoapi = require("neeo-sdk");
const CONSTANTS = require("./constants");

module.exports = class controller {
  constructor() {}

  static build() {
    return new controller();
  }

  onButtonPressed(commandName, deviceId) {
    console.log(`${commandName} Button pressed for ${deviceId}`);
    const api = new hdaMhub.api(deviceId);

    if (commandName == "POWER ON") api.powerOn();
    if (commandName == "POWER OFF") api.powerOff();
    if (commandName == "REBOOT") api.reboot();
    if (commandName == "POWER CYCLE") api.powerCycle();
    if (commandName == "IDENTIFY") api.identify();
    if (commandName.match(/INPUT HDMI ([0-9])([a-z])/)) {
      const [NULL, input, output] = commandName.match(/INPUT HDMI ([0-9])([a-z])/);
      api.switchOutputInput(output, input);
    }
  }

  async discoverDevices(optionalDeviceId) {
    let mhubdrivers = [];
    let mhubs = [];

    // If no deviceId is provided then do a discovery.
    if (typeof optionalDeviceId == "undefined") {
      // returns all discovered mhub devices and their API functions.
      mhubs = await hdaMhub.discover();
    } else {
      // returns the provided deviceId's API functions.
      mhubs = [new hdaMhub.api(optionalDeviceId)];
    }
    // For any discovered of requested mhub.
    for (let driver of mhubs) {
      console.log(`Found ${driver.host}`);
      const id = driver.host;
      const deviceName = id.replace(".local", "");
      try {
        const mhubsysinfo = await driver.getSystemInfo();
        const [inputs, outputs] = mhubGetInputsOutputs(mhubsysinfo);

        //build a driver.
        let mhubDriver = neeoapi.buildDevice(CONSTANTS.MHUB_DEVICE_NAME);
        mhubDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
        mhubDriver.setSpecificName(deviceName);
        mhubDriver.setType(CONSTANTS.HDMISWITCH);
        mhubDriver.addCapability("dynamicDevice");
        mhubBuildInputOutputButtons(mhubDriver, inputs, outputs);
        mhubDriver.addButton({ name: "POWER ON", label: "POWER ON" });
        mhubDriver.addButton({ name: "POWER OFF", label: "POWER OFF" });
        mhubDriver.addButton({ name: "REBOOT", label: "REBOOT" });
        mhubDriver.addButton({ name: "POWER CYCLE", label: "POWER CYCLE" });
        mhubDriver.addButton({ name: "IDENTIFY", label: "IDENTIFY" });
        mhubDriver.addButtonHander(this.onButtonPressed);
        mhubdrivers.push({ id, name: deviceName, device: mhubDriver });
      } catch (error) {
        console.log(`ERROR: ${id} isn't responding as expected.`);
        console.log(`Posible causes could be:`);
        console.log(` - MHUB is not updated to the latest firmware.`);
        console.log(` - Discovered device is not a MHUB device.`);
      }
    }
    return mhubdrivers;
  }
};

// Provide systeminfo API data and returns all inputs and outputs.
function mhubGetInputsOutputs(mhubsysinfo) {
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

//Building buttons for all input/output posibilities.
function mhubBuildInputOutputButtons(mhubDriver, inputs, outputs) {
  for (let input of inputs) {
    for (let output of outputs) {
      mhubDriver.addButton({ name: `INPUT HDMI ${input.id}${output.id}`, label: `INPUT ${input.id} to ${output.id}` });
    }
  }
}
