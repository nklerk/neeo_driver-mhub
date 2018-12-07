"use strict";

const neeoapi = require("neeo-sdk");
const hdaController = require("./hdacontroller");
const CONSTANTS = require("./constants");

const controller = hdaController.build();
let devices = [];

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
  optionalDeviceId => controller.discoverDevices(optionalDeviceId)
);
devices.push(mhubDriver);

for (let deviceType of CONSTANTS.UCONTROL_DEVICETYPES) {
  let ucDriver = neeoapi.buildDevice(`${CONSTANTS.UCONTROL_DEVICE_NAME} ${deviceType}`);
  ucDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
  ucDriver.setType(deviceType);
  ucDriver.addAdditionalSearchToken("HDA");
  ucDriver.enableDiscovery(
    {
      headerText: CONSTANTS.DISCOVER_HEADER,
      description: CONSTANTS.DISCOVER_DESCRIPTION,
      enableDynamicDeviceBuilder: true
    },
    optionalDeviceId => controller.discoverUCDevices(optionalDeviceId, deviceType)
  );
  devices.push(ucDriver);
}

module.exports = {
  devices
};
