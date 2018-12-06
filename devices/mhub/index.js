"use strict";

const neeoapi = require("neeo-sdk");
const hdaController = require("./controller");
const CONSTANTS = require("./constants");

const controller = hdaController.build();

let mhubDriver = neeoapi.buildDevice(CONSTANTS.MHUB_DEVICE_NAME);
mhubDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
mhubDriver.setType("HDMISWITCH");
mhubDriver.addAdditionalSearchToken("HDA");
mhubDriver.enableDiscovery(
  {
    headerText: CONSTANTS.DISCOVER_HEADER,
    description: CONSTANTS.DISCOVER_DESCRIPTION,
    enableDynamicDeviceBuilder: true
  },
  // this function returns the discovered devices
  optionalDeviceId => controller.discoverDevices(optionalDeviceId)
);

module.exports = {
  devices: [mhubDriver]
};
