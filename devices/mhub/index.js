"use strict";

const neeoapi = require("neeo-sdk");
const mhubController = require("./mhubController").build();
const uControlController = require("./uControlController").build();
//const customController = require("./customController").build();
const CONSTANTS = require("./constants");

let devices = [];

buidDriver(CONSTANTS.MHUB_DEVICE_NAME, mhubController);
buidDriver(CONSTANTS.UCONTROL_DEVICE_NAME, uControlController);
//buidDriver(CONSTANTS.CUSTOM_DEVICE_NAME, customController);  //// removing the first two // characters enables the customDriver.js.

function buidDriver(deviceName, mhubClass) {
  let mhubDriver = neeoapi.buildDevice(deviceName);
  mhubDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
  mhubDriver.addAdditionalSearchToken(CONSTANTS.ADDSEARCHTOKEN);
  mhubDriver.enableDiscovery(
    {
      headerText: CONSTANTS.DISCOVER_HEADER,
      description: CONSTANTS.DISCOVER_DESCRIPTION,
      enableDynamicDeviceBuilder: true
    },
    optionalDeviceId => mhubClass.discoverDevices(optionalDeviceId)
  );
  devices.push(mhubDriver);
}

module.exports = {
  devices
};
