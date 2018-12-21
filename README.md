# HDANYWHERE MHUB driver for NEEO. for PERFORMANCE TESTING ONLY

This driver adds HDANYWHERE MHUB support to NEEO.
the driver includes:

### MHUB system controll

- INPUT and OUTPUT selection
- MHUB system power.

In the NEEO app search for: HDA, HDANYWHERE, MHUB

### uControl

- Exposes the on MHUB installed uControl drivers to NEEO.

In the NEEO app search for: HDA, HDANYWHERE, uControl

### Custom Pronto HEX

- Expose custom build drivers to NEEO. Simply add pronto HEX to build a custom driver.
- Edit customDriver.js to add custom drivers.

In the NEEO app search for: HDA, HDANYWHERE, Custom Pronto HEX

## Running the driver.

The use of this driver requires:

- NodeJs to be installed.
- MDNS resolving. (install bonjour SDK service on windows./ Install avahi on linux.).
- A system where the driver can continuously run.

Download the driver files and extract them,
Use a terminal/command prompt and go to the extracted folder.

Install dependencies with "npm install".

Start the driver with "npm start".

For debugging,
edit Debug_driver.js and adjust IP and port number.
then run it with "node Debug_driver.js"

## Developer.

This code is written by Niels de Klerk. I'm a tech enthousiast and I code intergrations for fun.
Feel free to use my work both private or commercialy for free as in beer.
you can buy me one at https://www.paypal.me/NielsdeKlerk
Are you part of a company and want to sponsor my work? feel free to contact me.

## Version history:

#### Version 0.3.6

- Error handling during discovery.

#### Version 0.3.5

- Fully rewritten uControl to use prontoHex as it should be faster then direct control.

#### Version 0.3.4

- Fixed an issue with duplicate buttons.

#### Version 0.3.2

- added NPM module hdamhub
- test fix.

#### Version 0.3.0

- Code cleaning.
- disabled customDriver.js. To enable it edit devices\mhub\index.js
- Added Reboot.
- Added Power Cycle.
- Added Identify.

#### Version 0.2.4

- Increased performance.

#### Version 0.2.2

- Bugfix.

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
