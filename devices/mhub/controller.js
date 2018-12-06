"use strict";
const hda = require("hdamhub");
const neeoapi = require("neeo-sdk");
const CONSTANTS = require("./constants");

module.exports = class hdaController {
  constructor() {}

  static build() {
    return new hdaController();
  }

  onButtonPressed(commandName, deviceId) {
    let api = new hda.api(deviceId);
    if (commandName == "POWER ON") api.powerOn();
    if (commandName == "POWER OFF") api.powerOff();
    if (commandName.match(/INPUT\_([0-9])\_([a-z])/)) {
      //.length == 3
      const [NULL, input, output] = commandName.match(/INPUT\_([0-9])\_([a-z])/);
      api.switchOutputInput(output, input);
    }
    console.log(`${commandName} Button pressed for ${deviceId}`);
  }

  async discoverDevices(optionalDeviceId) {
    let mhubdrivers = [];
    let mhubs = [];
    if (typeof optionalDeviceId == "undefined") {
      console.log("[CONTROLLER] discovery call");
      mhubs = await hda.discover();
    } else {
      console.log("[CONTROLLER] Requesting HDA MHUB: ", optionalDeviceId);
      mhubs = [new hda.api(optionalDeviceId)];
    }
    for (let driver of mhubs) {
      let mhubsysinfo = await driver.getSystemInfo();
      let id = driver.host;
      let deviceName = `${mhubsysinfo.mhub.mhub_official_name}, ${driver.host}`;
      let mhubDriver = neeoapi.buildDevice(CONSTANTS.MHUB_DEVICE_NAME);
      mhubDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
      mhubDriver.setSpecificName(deviceName);
      mhubDriver.setType("HDMISWITCH");
      mhubDriver.addCapability("dynamicDevice");
      let [inputs, outputs] = hdaGetInputsOutputs(mhubsysinfo);
      hdaBuildInputOutputButtons(mhubDriver, inputs, outputs); //Build input buttons.
      mhubDriver.addButton({ name: "POWER ON", label: "POWER ON" });
      mhubDriver.addButton({ name: "POWER OFF", label: "POWER OFF" });
      mhubDriver.addButtonHander(this.onButtonPressed);
      mhubdrivers.push({ id, name: deviceName, device: mhubDriver });
    }
    return mhubdrivers;
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
