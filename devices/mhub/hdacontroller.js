"use strict";

const hdaMhub = require("hdamhub");
const neeoapi = require("neeo-sdk");
const CONSTANTS = require("./constants");

module.exports = class hdaController {
  constructor() {}

  static build() {
    return new hdaController();
  }

  onButtonPressed(commandName, deviceId) {
    let api = new hdaMhub.api(deviceId);

    if (commandName == "POWER ON") api.powerOn();
    if (commandName == "POWER OFF") api.powerOff();
    if (commandName.match(/INPUT HDMI ([0-9])([a-z])/)) {
      //.length == 3
      const [NULL, input, output] = commandName.match(/INPUT HDMI ([0-9])([a-z])/);
      api.switchOutputInput(output, input);
    }
    console.log(`${commandName} Button pressed for ${deviceId}`);
  }

  async discoverDevices(optionalDeviceId) {
    let mhubdrivers = [];
    let mhubs = [];
    if (typeof optionalDeviceId == "undefined") {
      console.log("[CONTROLLER] discovery call");
      mhubs = await hdaMhub.discover();
    } else {
      console.log("[CONTROLLER] Requesting HDA MHUB: ", optionalDeviceId);
      mhubs = [new hdaMhub.api(optionalDeviceId)];
    }
    for (let driver of mhubs) {
      let mhubsysinfo = await driver.getSystemInfo();
      let id = driver.host;
      let deviceName = id.replace(".local", "");
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

  async discoverUCDevices(optionalDeviceId, deviceType) {
    console.log(`Discovery Ucontrol: ${optionalDeviceId}, ${deviceType}`);
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
      mhubDriver.addButton({ name: `INPUT HDMI ${input.id}${output.id}`, label: `INPUT ${input.id} to ${output.id}` });
    }
  }
}

function neeoToUcontrolMapping() {
  return {
    "DIGIT 0": "0",
    "DIGIT 1": "1",
    "DIGIT 2": "2",
    "DIGIT 3": "3",
    "DIGIT 4": "4",
    "DIGIT 5": "5",
    "DIGIT 6": "6",
    "DIGIT 7": "7",
    "DIGIT 8": "8",
    "DIGIT 9": "9",
    "CHANNEL UP": "10",
    "CHANNEL DOWN": "11",
    PLAY: "12",
    PAUSE: "13",
    "PLAY PAUSE TOGGLE": "14",
    STOP: "15",
    FORWARD: "16",
    NEXT: "17",
    REVERSE: "18",
    PREVIOUS: "19",
    RECORD: "20",
    "CURSOR UP": "21",
    "CURSOR DOWN": "22",
    "CURSOR LEFT": "23",
    "CURSOR RIGHT": "24",
    "CURSOR ENTER": "25",
    BACK: "26",
    MENU: "27",
    HOME: "28",
    GUIDE: "29",
    "FUNCTION RED": "30",
    "FUNCTION GREEN": "31",
    "FUNCTION YELLOW": "32",
    "FUNCTION BLUE": "33",
    "VOLUME UP": "34",
    "VOLUME DOWN": "35",
    "MUTE TOGGLE": "36",
    INFO: "37",
    "POWER TOGGLE": "38",
    "POWER OFF": "39",
    SUBTITLE: "40",
    "INPUT TOGGLE": "41",
    EJECT: "42",
    LANGUAGE: "43",
    "3D": "44",
    "Top Menu": "45",
    "Pop-up Menu": "46",
    "Aspect Ratio": "47",
    Help: "48",
    "POWER ON": "49",
    "No / Thumbs Down": "50",
    "Yes / Thumbs Up": "51",
    "Page Up": "52",
    "Page Down": "53",
    Search: "54",
    EXIT: "55",
    "Catch Up": "56",
    Playlist: "57",
    "MY RECORDINGS": "57",
    "Box Office": "58",
    DSTV: "59"
  };
}
