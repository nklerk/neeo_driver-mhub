"use strict";

const neeoapi = require("neeo-sdk");
const mhubController = require("./mhubController").build();
const uControlController = require("./uControlController").build();
const CONSTANTS = require("./constants");

//const mController = mhubController.build();
let devices = [];

// Building MHUB System driver
let mhubDriver = neeoapi.buildDevice(CONSTANTS.MHUB_DEVICE_NAME);
mhubDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
mhubDriver.addAdditionalSearchToken("HDA");
mhubDriver.enableDiscovery(
  {
    headerText: CONSTANTS.DISCOVER_HEADER,
    description: CONSTANTS.DISCOVER_DESCRIPTION,
    enableDynamicDeviceBuilder: true
  },
  optionalDeviceId => mhubController.discoverDevices(optionalDeviceId)
);
devices.push(mhubDriver);

// Building uControl driver
let ucDriver = neeoapi.buildDevice(CONSTANTS.UCONTROL_DEVICE_NAME);
ucDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
ucDriver.addAdditionalSearchToken("HDA");
ucDriver.enableDiscovery(
  {
    headerText: CONSTANTS.DISCOVER_HEADER,
    description: CONSTANTS.DISCOVER_DESCRIPTION,
    enableDynamicDeviceBuilder: true
  },
  optionalDeviceId => uControlController.discoverDevices(optionalDeviceId)
);
devices.push(ucDriver);

// Building custom uControl driver
let customDriver = neeoapi.buildDevice(CONSTANTS.CUSTOM_DEVICE_NAME);
customDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
customDriver.addAdditionalSearchToken("HDA");
customDriver.enableDiscovery(
  {
    headerText: CONSTANTS.DISCOVER_HEADER,
    description: CONSTANTS.DISCOVER_DESCRIPTION,
    enableDynamicDeviceBuilder: true
  },
  optionalDeviceId => uControlController.discoverDevices(optionalDeviceId)
);
devices.push(customDriver);

module.exports = {
  devices
};
