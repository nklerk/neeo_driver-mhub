"use strict";

const neeoapi = require("neeo-sdk");
const hdadrivers = require("./devices/mhub");

let drivers = hdadrivers.devices;
neeoapi
  .startServer({
    brain: "10.2.1.64",
    port: 1337,
    name: "mhub-adapter",
    devices: drivers //Discovered Mhubs, Ucontrol
  })
  .then(() => {
    console.log("# READY!");
    console.log("# use the NEEO app to search for: ");
    console.log('#   "mhub ". For the mhub matrix');
    console.log('#   "uControl ". For individual uControl');
  })
  .catch(err => {
    console.error("ERROR!", err);
    process.exit(1);
  });
