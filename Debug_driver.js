"use strict";

const neeoapi = require("neeo-sdk");
const hdadrivers = require("./devices/mhub");

console.log("#");
console.log("# Use 'Debug_driver.js' for debug and development.");
console.log("# To start the driver use the cli command 'npm start'.");
console.log("#");

let drivers = hdadrivers.devices;
neeoapi
  .startServer({
    brain: "10.2.1.64",
    port: 1337,
    name: "mhub-adapter",
    devices: drivers //Discovered Mhubs, Ucontrol
  })
  .then(() => {
    console.log("# READY! use the NEEO app to search for 'HDA' ");
  })
  .catch(err => {
    console.error("ERROR!", err);
    process.exit(1);
  });
