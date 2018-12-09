"# neeo_driver-mhub"

This is a HDA MHUB driver for NEEO.

!! Work in progress. !!

This code requires NEEO Firmware 52.x or later and SDK version 52.x or later.
Both versions are not yet available.

## Version history:

Version 0.2.0

- uControl implemented
- Custom drivers implementer. (Edit. customDriver.js)

Version 0.1.2

- Added Ucontrol device discovery

Version 0.1.1

- Changed INPUT selection labeling to "INPUT <InputId> TO <OutputId>"
- Changed INPUT selection naming to "INPUT HDMI <InputId><OutputId>" // Complying to SDK Naming convention.
- Started to work on uControl driver.

Version 0.1.0

- Discovery is working.
- Dynamic assignments of input(/output) buttons.
- Lets NEEO controll power state and input/output of MHUB devices.
