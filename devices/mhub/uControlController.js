"use strict";

const hdaMhub = require("hdamhub");
const neeoapi = require("neeo-sdk");
const mappings = require("./mappings");
const CONSTANTS = require("./constants");

module.exports = class controller {
  constructor() {}

  static build() {
    return new controller();
  }

  onButtonPressed(commandName, deviceId) {
    let [mhub, io] = deviceId.split("_uControl_");
    let api = new hdaMhub.api(mhub);
    let commandNumber = mappings.neeoButtonToHdaButton()[commandName] || commandName.replace("uControl_", "");
    api.executeUcontrolCommand(io, commandNumber);
    console.log(`${commandName} Button pressed for ${deviceId}`);
  }

  async discoverDevices(optionalDeviceId, deviceType) {
    console.log(`Discovery Ucontrol: ${optionalDeviceId}, ${deviceType}`);
    let ucDrivers = [];
    let mhubs = [];
    if (typeof optionalDeviceId == "undefined") {
      console.log("[CONTROLLER] discovery call");
      mhubs = await hdaMhub.discover();
    } else {
      console.log("[CONTROLLER] Requesting uControll driver: ", optionalDeviceId);
      let [mhub, io] = optionalDeviceId.split("_uControl_");
      mhubs = [new hdaMhub.api(mhub)];
    }
    for (let mhub of mhubs) {
      console.log(`Found host: ${mhub.host}`);
      let uControlStatus = await mhub.getUControlStatus();
      let uControlPorts = getUcontrolPorts(uControlStatus);
      for (let io of uControlPorts) {
        const uControl = await mhub.getUControlState(io);
        if (typeof uControl != "undefined") {
          let id = `${mhub.host}_uControl_${io}`;
          let deviceName = `${mhub.host.replace(".local", "")}: ${io}, ${uControl.name}`;
          console.log(`Building NEEO driver for ${deviceName}`);
          let ucDriver = neeoapi.buildDevice(CONSTANTS.UCONTROL_DEVICE_NAME);
          ucDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
          ucDriver.setSpecificName(deviceName);
          let type = mappings.hdaDevicetypeToNeeoDevicetype()[uControl.type] || "ACCESSOIRE";
          ucDriver.setType(type);
          buildButtons(ucDriver, uControl.irpack);
          ucDriver.addButtonHander(this.onButtonPressed);
          ucDrivers.push({ id, name: deviceName, device: ucDriver });
        }
      }
    }
    console.log(`Offering drivers to NEEO.`);
    return ucDrivers;
  }
};

function buildButtons(mhubDriver, irpack) {
  for (let ir of irpack) {
    let label = mappings.hdaButtonToNeeoButton()[ir.id];
    if (label) {
      //if a uControl to NEEO mapping exist
      mhubDriver.addButton({ name: label, label });
    } else {
      //if a uControl to NEEO mapping does not exist
      label = ir.label.toUpperCase();
      mhubDriver.addButton({ name: `uControl_${ir.id}`, label: ir.label });
    }
  }
}

function getUcontrolPorts(uControlStatus) {
  let uControlPorts = [];
  let io = 1;
  if (uControlStatus && uControlStatus.input && typeof uControlStatus.input == "object") {
    for (let i of uControlStatus.input) {
      if (i.irpack) uControlPorts.push(`${io}`);
      io = io + 1;
    }
  }
  if (uControlStatus && uControlStatus.output && typeof uControlStatus.output == "object") {
    for (let i of uControlStatus.output) {
      if (i.irpack) uControlPorts.push(`${io}`);
      io = io + 1;
    }
  }
  return uControlPorts;
}
