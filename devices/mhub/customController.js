"use strict";

const hdaMhub = require("hdamhub");
const neeoapi = require("neeo-sdk");
const customDrivers = require("./customDriver").drivers();
const CONSTANTS = require("./constants");

module.exports = class controller {
  constructor() {}

  static build() {
    return new controller();
  }

  onButtonPressed(commandName, deviceId) {
    for (let driver of customDrivers) {
      if (driver.uniqueId === deviceId) {
        let hex = driver.buttons[commandName];
        let io = driver.mhubIoPort;
        let api = new hdaMhub.api(driver.mhubHostname);
        api.sendProntoHex(io, hex);
      }
    }
    console.log(`${commandName} Button pressed for ${deviceId}`);
  }

  async discoverDevices(optionalDeviceId, deviceType) {
    console.log(`Discovery Ucontrol: ${optionalDeviceId}, ${deviceType}`);
    let custDrivers = [];

    for (let driver of customDrivers) {
      if (!optionalDeviceId || driver.uniqueId === optionalDeviceId) {
        let customDriver = neeoapi.buildDevice(CONSTANTS.CUSTOM_DEVICE_NAME);
        customDriver.setManufacturer(driver.manufacturer);
        customDriver.setSpecificName(driver.deviceName);
        customDriver.setType(driver.deviceType);
        buildButtons(customDriver, driver.buttons);
        customDriver.addButtonHander(this.onButtonPressed);
        custDrivers.push({ id: driver.uniqueId, name: driver.deviceName, device: customDriver });
      }
    }

    return custDrivers;
  }
};

function buildButtons(customDriver, buttons) {
  for (let name in buttons) {
    customDriver.addButton({ name, label: name });
  }
}
