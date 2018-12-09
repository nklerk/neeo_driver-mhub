"use strict";

function hdaDevicetypeToNeeoDevicetype() {
  return {
    "Media Player": "MEDIAPLAYER",
    "Games Console": "GAMECONSOLE",
    Projector: "PROJECTOR",
    Projectors: "PROJECTOR",
    AVRs: "AVRECEIVER",
    AVR: "AVRECEIVER",
    "STB/Cable": "DVB",
    "Blu-ray/DVD": "DVD",
    Displays: "TV",
    Display: "TV"
  };
}

function hdaButtonToNeeoButton() {
  return {
    "0": "DIGIT 0",
    "1": "DIGIT 1",
    "2": "DIGIT 2",
    "3": "DIGIT 3",
    "4": "DIGIT 4",
    "5": "DIGIT 5",
    "6": "DIGIT 6",
    "7": "DIGIT 7",
    "8": "DIGIT 8",
    "9": "DIGIT 9",
    "10": "CHANNEL UP",
    "11": "CHANNEL DOWN",
    "12": "PLAY",
    "13": "PAUSE",
    "14": "PLAY PAUSE",
    "15": "STOP",
    "16": "FORWARD",
    "17": "NEXT",
    "18": "REVERSE",
    "19": "PREVIOUS",
    "20": "RECORD",
    "21": "CURSOR UP",
    "22": "CURSOR DOWN",
    "23": "CURSOR LEFT",
    "24": "CURSOR RIGHT",
    "25": "CURSOR ENTER",
    "26": "BACK",
    "27": "MENU",
    "28": "HOME",
    "29": "GUIDE",
    "30": "FUNCTION RED",
    "31": "FUNCTION GREEN",
    "32": "FUNCTION YELLOW",
    "33": "FUNCTION BLUE",
    "34": "VOLUME UP",
    "35": "VOLUME DOWN",
    "36": "MUTE TOGGLE",
    "37": "INFO",
    "38": "POWER TOGGLE",
    "39": "POWER OFF",
    "40": "SUBTITLE",
    "41": "INPUT TOGGLE",
    "42": "EJECT",
    "43": "LANGUAGE",
    "44": "3D",
    "45": "TOP MENU",
    "46": "POP-UP MENU",
    "47": "ASPECT RATIO",
    "48": "HELP",
    "49": "POWER ON",
    "50": "No / Thumbs Down",
    "51": "Yes / Thumbs Up",
    "52": "PAGE UP",
    "53": "PAGE DOWN",
    "54": "SEARCH",
    "55": "EXIT",
    "56": "Catch Up",
    "57": "Playlist",
    "58": "Box Office",
    "59": "DSTV"
  };
}

function neeoButtonToHdaButton() {
  let response = {};
  const buttons = hdaButtonToNeeoButton();
  for (let key in buttons) {
    response[buttons[key]] = key;
  }
  return response;
}

module.exports = {
  hdaDevicetypeToNeeoDevicetype,
  hdaButtonToNeeoButton,
  neeoButtonToHdaButton
};
