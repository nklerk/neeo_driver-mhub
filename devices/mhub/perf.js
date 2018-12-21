"use strict";

const performance = require("perf_hooks").performance;
const keypress = require("keypress");
const http = require("http.min");

const intervalTime = 5000;
const neeoKeypressUrl = "http://10.2.1.64:3000/v1/projects/home/rooms/6367632568841404416/devices/6481951752160542720/macros/6481951752181514240/trigger";

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
process.stdin.setRawMode(true);

// listen for the "keypress" event
process.stdin.on("keypress", function(ch, key) {
  p5();
  if (key && key.ctrl && key.name == "c") {
    process.stdin.pause();
  }
  process.stdin.resume();
});
process.stdin.setRawMode(true);
process.stdin.resume();

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
  console.log(` T4: Is the moment this driver received OK from the mhub API.`);
  console.log(` T5: Is the moment this driver received the keypress from HDA. (received ir signal)`);
  console.log(``);
  console.log(`-========================================================================================-`);
  console.log(``);
  setInterval(neeoKeypress, intervalTime);
}

function result() {
  console.log(` T1: ${calcTime(t1, t1)}\tT2: ${calcTime(t2, t1)}\tT3: ${calcTime(t3, t2)}\tT4: ${calcTime(t4, t3)}\tT5: ${calcTime(t5, t4)}\tTotal: ${calcTime(t5, t1)}`);
}

function calcTime(ta, tb) {
  let tx = ta - tb;
  tx = Math.round(tx * 100);
  tx = tx / 100;
  return tx;
}

function neeoKeypress() {
  //console.log(`Starting new test...`)
  p1();
  http.get(neeoKeypressUrl);
}

function p1() {
  t1 = performance.now();
  //console.log(` T1:${calcTime(t1,t1)}`);
}

function p2() {
  t2 = performance.now();
  // console.log(` T2:${calcTime(t2,t1)}`);
}

function p3() {
  t3 = performance.now();
  //console.log(` T3:${calcTime(t3,t2)}`);
}

function p4() {
  t4 = performance.now();
  //console.log(` T4:${calcTime(t4,t3)}`);
}

function p5() {
  t5 = performance.now();
  result();
}

module.exports = {
  start,
  p1,
  p2,
  p3,
  p4,
  p5
};
