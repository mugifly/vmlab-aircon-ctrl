/**
 * Device Commands Handler for aircon-ctrl
 */

'use strict';

var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

/**
 * Constructor method
 * @param {Object} config         Configuration which read from config.json (Read only)
 * @param {Function} logger       Logger compatible with console object - Usage: logger.log(text)
 * @param {HandlerHelper} helper  Instance of HandlerHelper
 */
var CommandsHandler = function (config, logger, helper) {
	
	logger.log('Initializing...');

	// Device configuration
	this.config = config;

	// Logger
	this.logger = logger;
	
	// Connect to arduino
	this.btRefreshTimer = null;
	btSerial.on('found', function(address, name) {
		
		logger.log('Bluetooth device has been found - ' + address);
		if (address != config.btSerialAddress) return;
		
		logger.log('Connecting to bluetooth device - ' + address);
        	btSerial.findSerialPortChannel(address, function(channel) {
			btSerial.connect(address, channel, function() {
				logger.log('Connected to ' + address);
			}, function () {
				logger.log('Can not connect');
			});
		}, function () {
                	logger.log('found nothing');
		});
		
	});
	
	btSerial.inquire();	
	this._startRescanTimer();

};


module.exports = CommandsHandler;


/**
 * Start the timer for re-scan
 **/
CommandsHandler.prototype._startRescanTimer = function () {
	
	var self = this;
	
	if (self.btRefreshTimer != null) {
		clearInterval(self.btRefreshTimer);
	}
	
	self.btRefreshTimer = setInterval(function () {

		if (btSerial.isOpen()) return;
	
		clearInterval(self.btRefreshTimer);
		
		self.logger.log('Re-Scanning bluetooth devices...');
		btSerial.inquire();
		
		self._startRescanTimer();

	}, 10000);
	

};


/**
* Turn on / off the aircon
* @param  {Object} args         Arguments of the received command
* @param  {Function} cb_runner  Callback runner for response
* @return {Boolean} if returns true, handler indicates won't use the callback 
*/
CommandsHandler.prototype.setPower = function (args, cb_runner) {
	
	this.logger.log(args.power); // BOOLEAN DEFAULT false
	
	// Send to arduino
	btSerial.write(new Buffer('set_power=' + args.power + ';', 'utf-8'), function (err, bytes_written) {
		
		if (err) return cb_runner.send(err, 'Failed');
		
		// Done		
		cb_runner.send(null, 'OKAY');
		
	});
	
};


/**
* Set the temperature
* @param  {Object} args         Arguments of the received command
* @param  {Function} cb_runner  Callback runner for response
* @return {Boolean} if returns true, handler indicates won't use the callback 
*/
CommandsHandler.prototype.setTemp = function (args, cb_runner) {
	
	this.logger.log(args.temp); // INTEGER(18,28) DEFAULT 24
        
	// Send to arduino
        btSerial.write(new Buffer('set_temp=' + args.temp + ';', 'utf-8'), function (err, bytes_written) {

                if (err) return cb_runner.send(err, 'Failed');

                // Done
                cb_runner.send(null, 'OKAY');

        });
	
};


/**
* Get the power state of the aircon
* @param  {Object} args         Arguments of the received command
* @param  {Function} cb_runner  Callback runner for response
* @return {Boolean} if returns true, handler indicates won't use the callback 
*/
CommandsHandler.prototype.getPower = function (args, cb_runner) {
	
	cb_runner.send(null, 'OKAY');
	
};


/**
* Get the temperature
* @param  {Object} args         Arguments of the received command
* @param  {Function} cb_runner  Callback runner for response
* @return {Boolean} if returns true, handler indicates won't use the callback 
*/
CommandsHandler.prototype.getTemp = function (args, cb_runner) {
	
	cb_runner.send(null, 'OKAY');
	
};
