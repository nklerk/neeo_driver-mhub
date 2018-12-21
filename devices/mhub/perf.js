"use strict";

const performance = require("perf_hooks").performance;
const keypress = require("keypress");
const http = require("http.min");

const intervalTime = 10000;
const neeoKeypressUrl = "http://10.2.1.5";

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on("keypress", function(ch, key) {
  perf.p4();
  if (key && key.ctrl && key.name == "c") {
    process.stdin.pause();
  }
});

let t1 = 0;
let t2 = 0;
let t3 = 0;
let t4 = 0;
let t5 = 0;

function start() {
  console.log(` Performance testing.`);
  console.log(``);
  console.log(`Every ${intervalTime / 1000} seconds a keepress will be sent using the NEEO EUI (APP)`);
  console.log(` T1: Is the moment just before the NEEO key press.`);
  console.log(` T2: Is the moment this driver receives the button event from NEEO.`);
  console.log(` T3: Is the moment this driver has converted the NEEO button press to a HDA API.`);
  console.log(` T4: Is the moment this driver received the keypress from HDA. (received ir signal)`);
  console.log(``);
  console.log(`-========================================================================================-`);
  console.log(``);
  setInterval(neeoKeypress, intervalTime);
}

function result() {
  console.log(` T1:${calcTime(t1 - t1)}\t T2:${calcTime(t2 - t1)} -> T3:${calcTime(t3 - t2)} -> T4:${calcTime(t4 - t3)} => Total:${calcTime(t4 - t1)}`);
}

function calcTime(ta, tb) {
  let tx = tb - ta;
  return Math.round(tx * 100) / 100;
}

function neeoKeypress() {
  p1();
  http.get(neeoKeypressUrl);
}

function p1() {
  t1 = performance.now();
}

function p2() {
  t2 = performance.now();
}

function p3() {
  t3 = performance.now();
}

function p4() {
  t4 = performance.now();
  result();
}

function p5() {
  t5 = performance.now();
}

module.exports = {
  start,
  p1,
  p2,
  p3,
  p4,
  p5
};
