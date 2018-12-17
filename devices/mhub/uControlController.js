"use strict";

const hdaMhub = require("hdamhub");
const neeoapi = require("neeo-sdk");
const mappings = require("./mappings");
const CONSTANTS = require("./constants");
const dns = require("dns");

// DNS caching alternative for Windows hosts.
// Windows host resolves every MDNS queery and result in to much latency.
let cachedMhubaddress = {};

module.exports = class controller {
  constructor() {}
  static build() {
    return new controller();
  }

  onButtonPressed(commandName, deviceId) {
    console.log(`${commandName} Button pressed for ${deviceId}`);
    const [mhub, io] = deviceId.split("_uControl_");
    const api = getAPI(mhub);
    const commandNumber = mappings.neeoButtonToHdaButton()[commandName] || commandName.replace("uControl_", "");
    api.executeUcontrolCommand(io, commandNumber);
  }

  // Device Discovery.
  async discoverDevices(optionalDeviceId, deviceType) {
    let ucDrivers = [];
    let mhubs = [];
    // If no deviceId is provided then do a discovery.
    if (typeof optionalDeviceId == "undefined") {
      mhubs = await hdaMhub.discover();
    } else {
      // deviceId is build as `${mhub.host}_uControl_${io}`;
      const [mhub, io] = optionalDeviceId.split("_uControl_");
      mhubs = [new hdaMhub.api(mhub)];
    }
    for (let mhub of mhubs) {
      const uControlStatus = await mhub.getUControlStatus();
      const uControlPorts = getUcontrolPorts(uControlStatus);
      for (let io of uControlPorts) {
        const uControl = await mhub.getUControlState(io);
        if (typeof uControl != "undefined") {
          const id = `${mhub.host}_uControl_${io}`;
          const deviceName = `${mhub.host.replace(".local", "")}: ${io}, ${uControl.name}`;
          const driver = this.buildDriver(deviceName, uControl, id);
          ucDrivers.push(driver);
        }
      }
    }
    console.log(`Offering drivers to NEEO.`);
    return ucDrivers;
  }

  // function to build dynamic drivers.
  buildDriver(deviceName, uControl, id) {
    console.log(`Building NEEO driver for ${deviceName}`);
    const type = mappings.hdaDevicetypeToNeeoDevicetype()[uControl.type] || "ACCESSOIRE";
    let ucDriver = neeoapi.buildDevice(CONSTANTS.UCONTROL_DEVICE_NAME);
    ucDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
    ucDriver.setSpecificName(deviceName);
    ucDriver.setType(type);
    buildButtons(ucDriver, uControl.irpack);
    ucDriver.addButtonHander(this.onButtonPressed);
    return { id, name: deviceName, device: ucDriver };
  }
};

// function for building buttons.
function buildButtons(mhubDriver, irpack) {
  let uniqueButtons = [];
  for (let ir of irpack) {
    if (uniqueButtons.indexOf(ir.id) == -1) {
      let label = mappings.hdaButtonToNeeoButton()[ir.id];
      if (label) {
        //if a uControl to NEEO mapping exist
        mhubDriver.addButton({ name: label, label });
      } else {
        //if a uControl to NEEO mapping does not exist
        label = ir.label.toUpperCase();
        mhubDriver.addButton({ name: `uControl_${ir.id}`, label: ir.label });
      }
      uniqueButtons.push(ir.id);
    } else {
      //button allready exists.
    }
  }
}

// Getting API with caching.
function getAPI(mhub) {
  let api;
  if (typeof cachedMhubaddress[mhub] === "undefined") {
    api = new hdaMhub.api(mhub);
  } else {
    api = cachedMhubaddress[mhub].api;
  }
  cacheResolve(mhub);
  return api;
}

// Resolve MDNS with caching.
function cacheResolve(mhub) {
  if (typeof cachedMhubaddress[mhub] === "undefined" || cachedMhubaddress[mhub].time + 30000 < Date.now()) {
    dns.lookup(mhub, (err, address, family) => {
      if (!err) {
        const api = new hdaMhub.api(address);
        cachedMhubaddress[mhub] = { ip: address, time: Date.now(), api };
        console.log(`IP for ${mhub} is: ${address}`);
      }
    });
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
