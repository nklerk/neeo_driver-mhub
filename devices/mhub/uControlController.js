"use strict";

const hdaMhub = require("hdamhub");
const neeoapi = require("neeo-sdk");
const mappings = require("./mappings");
const CONSTANTS = require("./constants");
const dns = require("dns");

// DNS caching alternative for Windows hosts.
// Windows host resolves every MDNS queery and result in to much latency.
let cachedMhubaddress = {};

//Mhub driver cashing to improve possible performance.
let cachedMhubIrPronto = {};

module.exports = class controller {
  constructor() {}
  static build() {
    return new controller();
  }

  onButtonPressed(commandName, deviceId) {
    console.log(`${commandName} Button pressed for ${deviceId}`);
    const [host, io] = deviceId.split("_uControl_");
    console.log(`Using mhhub:${host}, io:${io}`);
    const api = getAPI(host);
    let cashedIndex = `${host}-${io}-${commandName}`;
    const prontoHex = cachedMhubIrPronto[cashedIndex].replace(/,/g, "");
    api.sendProntoHex(io, prontoHex);
  }

  // Device Discovery.
  async discoverDevices(optionalDeviceId) {
    let ucDrivers = [];
    let mhubs = [];

    if (typeof optionalDeviceId !== "undefined") {
      // Specific Discovery
      const [host, io] = optionalDeviceId.split("_uControl_");
      let mhub = new hdaMhub.api(host);
      const uControl = await mhub.getUControlState(io);
      if (typeof uControl != "undefined") {
        const driver = this.buildDriver(host, uControl, io);
        ucDrivers.push(driver);
      }
    } else {
      // Discover All..
      mhubs = await hdaMhub.discover();
      for (let mhub of mhubs) {
        const uControlStatus = await mhub.getUControlStatus();
        try {
          const uControlPorts = getUcontrolPorts(uControlStatus);
          for (let io of uControlPorts) {
            const uControl = await mhub.getUControlState(io);
            if (typeof uControl != "undefined") {
              const driver = this.buildDriver(mhub.host, uControl, io);
              ucDrivers.push(driver);
            }
          }
        } catch (error) {
          console.log(`ERROR: ${id} isn't responding as expected.`);
          console.log(`Posible causes could be:`);
          console.log(` - MHUB is not updated to the latest firmware.`);
          console.log(` - Discovered device is not a MHUB device.`);
        }
      }
    }

    console.log(`Offering drivers to NEEO.`);
    return ucDrivers;
  }

  // function to build dynamic drivers.
  buildDriver(host, uControl, io) {
    const id = `${host}_uControl_${io}`;
    const deviceName = `${host.replace(".local", "")}: ${io}, ${uControl.name}`;
    const type = mappings.hdaDevicetypeToNeeoDevicetype()[uControl.type] || "ACCESSOIRE";
    console.log(`Building NEEO driver for ${deviceName}`);
    let ucDriver = neeoapi.buildDevice(CONSTANTS.UCONTROL_DEVICE_NAME);
    ucDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
    ucDriver.setSpecificName(deviceName);
    ucDriver.setType(type);
    buildButtons(ucDriver, uControl.irpack, host, io);
    ucDriver.addButtonHander(this.onButtonPressed);
    return { id, name: deviceName, device: ucDriver };
  }
};

// function for building buttons.
function buildButtons(mhubDriver, irpack, host, io) {
  let uniqueButtons = [];
  for (let ir of irpack) {
    if (uniqueButtons.indexOf(ir.id) == -1) {
      let commandName = mappings.hdaButtonToNeeoButton()[ir.id];
      if (!commandName) {
        commandName = ir.label.toUpperCase();
      }
      let cashedIndex = `${host}-${io}-${commandName}`;
      cachedMhubIrPronto[cashedIndex] = ir.code;
      mhubDriver.addButton({ name: commandName, label: commandName });
      uniqueButtons.push(ir.id);
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
  if (typeof cachedMhubaddress[mhub] === "undefined" || cachedMhubaddress[mhub].time + 300000 < Date.now()) {
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
