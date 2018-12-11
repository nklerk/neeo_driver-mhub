# HDANYWHERE MHUB driver for NEEO.

This driver adds HDANYWHERE MHUB support to NEEO.
the driver includes:

### MHUB system controll

- INPUT and OUTPUT selection
- MHUB system power.

In the NEEO app search for: HDA, HD Anywhere, MHUB

### uControl

- Exposes the on MHUB installed uControl drivers to NEEO.

In the NEEO app search for: HDA, HD Anywhere, uControl

### Custom Pronto HEX

- Expose custom build drivers to NEEO. Simply add pronto HEX to build a custom driver.
- Edit customDriver.js to add custom drivers.

In the NEEO app search for: HDA, HD Anywhere, Custom Pronto HEX

## Running the driver.

This driver requires NodeJs to be installed.

Download the driver files and extract them,
Use a terminal/command prompt and go to the extracted folder.

Install dependencies with "npm install".

Start the driver with "npm start".

For debugging use "node Debug_driver.js"

## Version history:

#### Version 0.2.1

- Fixed uControl IO id.
- Fixed Pronto Hex.

#### Version 0.2.0

- uControl implemented
- Custom drivers implemented. (Edit. customDriver.js)

#### Version 0.1.2

- Added Ucontrol device discovery

#### Version 0.1.1

- Changed INPUT selection labeling to "INPUT <InputId> TO <OutputId>"
- Changed INPUT selection naming to "INPUT HDMI <InputId><OutputId>" // Complying to SDK Naming convention.
- Started to work on uControl driver.

#### Version 0.1.0

- Discovery is working.
- Dynamic assignments of input(/output) buttons.
- Lets NEEO controll power state and input/output of MHUB devices.
