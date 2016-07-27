# vmlab-aircon-ctrl

One of the variety example of [denhub-device](https://github.com/odentools/denhub-device) based device.

This device allows to control the built-in air-conditioner of our laboratory via the Internet.


## Motivation

* Our labo's air-con doesn't have a remote controller.
* We are also not permitted to modify the internal wiring of that air-con.

Note: I reused a source code of the controller device (Arduino based) from [my old project](https://github.com/mugifly/sprig-magic).


## System devices

* Host Device: Raspberry Pi 2
* Controller: Arduino Uno
	* General Bluetooth 2.x Serial (SPP) Module
	* A solenoid for pushing button on air-con.


## Author

Masanori Ohgita.
