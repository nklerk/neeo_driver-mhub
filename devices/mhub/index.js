const hda = require("hdamhub");
const neeoapi = require("neeo-sdk");
const hdaController = require("./controller");
const CONSTANTS = require("./constants");

const controller = hdaController.build();

let mhubDriver = neeoapi.buildDevice(CONSTANTS.MHUB_DEVICE_NAME);
mhubDriver.setManufacturer(CONSTANTS.MHUB_MANUFACTURER);
mhubDriver.setType("HDMISWITCH");
mhubDriver.addAdditionalSearchToken("HDA");
mhubDriver.addButton({ name: "POWER ON", label: "POWER ON" });
mhubDriver.addButton({ name: "POWER OFF", label: "POWER OFF" });
mhubDriver.addButtonHander(controller.onButtonPressed);
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
