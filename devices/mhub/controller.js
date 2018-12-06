"use strict";
const hda = require("hdamhub");

function host(deviceId) {
  this.deviceId = deviceId;
  this.api = new hda.api(deviceId);
}

host.prototype.onButtonPressed = function onButtonPressed(name, deviceId) {
  this.api.switchOutputInput("a", "1");
  console.log("Button pressed:", deviceId, name);
};

module.exports = {
  host
};
