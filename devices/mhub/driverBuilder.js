const hda = require("hdamhub");
const neeoapi = require("neeo-sdk");
const controller = require("./controller");

module.exports = {
  build
};

async function build() {
  let mhubs = await hda.discover();
  let mhubdrivers = [];
  for (driver of mhubs) {
    let mhubsysinfo = await driver.getSystemInfo();
    let deviceName = `${mhubsysinfo.mhub.mhub_name}`;
    let [inputs, outputs] = hdaGetInputsOutputs(mhubsysinfo);

    let mhubDriver = neeoapi.buildDevice(`${deviceName} (IP Driver)`);
    mhubDriver.setManufacturer("HD Anywhere");
    mhubDriver.addAdditionalSearchToken("HDA");
    mhubDriver.addAdditionalSearchToken("Niels de Klerk");
    hdaBuildInputOutputButtons(mhubDriver, inputs, outputs);
    mhubDriver.setType("HDMISWITCH");

    console.log(driver.host);
    mhubDriver.addButtonHander(controller.onButtonPressed);
    mhubdrivers.push(mhubDriver);
  }
  console.log(mhubs);
  console.log(mhubdrivers);
  return mhubdrivers;
}

function hdaGetInputsOutputs(mhubsysinfo) {
  let inputs = [];
  let outputs = [];
  for (i in mhubsysinfo.io_data.input_audio) {
    for (input of mhubsysinfo.io_data.input_audio[i].labels) {
      inputs.push(input);
    }
  }
  for (i in mhubsysinfo.io_data.input_video) {
    for (input of mhubsysinfo.io_data.input_video[i].labels) {
      inputs.push(input);
    }
  }

  for (i in mhubsysinfo.io_data.output_audio) {
    for (input of mhubsysinfo.io_data.output_audio[i].labels) {
      outputs.push(input);
    }
  }
  for (i in mhubsysinfo.io_data.output_video) {
    for (input of mhubsysinfo.io_data.output_video[i].labels) {
      outputs.push(input);
    }
  }
  return [inputs, outputs];
}

function hdaBuildInputOutputButtons(mhubDriver, inputs, outputs) {
  for (input of inputs) {
    for (output of outputs) {
      mhubDriver.addButton({ name: `INPUT_${input.id}_${output.id}`, label: `INPUT ${input.label} to ${output.label}` });
    }
  }
}
