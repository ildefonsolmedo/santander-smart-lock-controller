/*jslint unparam: true, node: true */
/*globals Promise: true*/
'use strict';
var config = require('config'),
	catalog = require('xcatalog'),
	Cylon = require('cylon'),
	LCD = require('./util/lcd.js'),
	lcd = new LCD('/dev/i2c-1', 0x3F),
	os = require('os'),
	bleno = require('bleno');

//Hardware-related settings
const DEFAULT_TITLE = 'Smart Locker',
	SECONDS_TO_LOCK = 3,
	INTERNAL_TIMER_HAS_PRIORITY = true;

console.log('Configuration environment: ' + config.util.getEnv('NODE_ENV'));
console.log('Configuration instance: ' + config.util.getEnv('NODE_APP_INSTANCE'));

//Load catalog config - DI
require('./catalog-config')(catalog);

//When DI module is ready, start the server/s
catalog.ready().then(function (catalog) {

	// DI for serverSetup service
	var serverSetup = catalog('serverSetup');

	//Create API server
	var oServerConfig =	config.server;
		oServerConfig.routers = config.routers;
		oServerConfig.log = config.log;
	var server = serverSetup.createAPIServer(oServerConfig);

	startLocker();
}).catch(function (reason) {
		console.error(reason);
});

// Holds the lock's state
let isUnlocked = false;

function startLocker() {
		var locker = catalog('lockerService'),
				config = catalog('config');

						// setInterval(function() {
						//     locker.status(config.eth.contract, config.eth.sender)
						//     .then(function(response){

						//         console.log('status',response);

						//         resolve(response);

						//         if (response) {
						//             my.doUnlock(my);
						//             my.countdownAndLock(my);
						//         } else {
						//             my.doLock(my);
						//         }

						//     },function(err){
						//         reject(err);
						//     })
						//     .catch(function(err){
						//         reject(err);
						//     });

						// }, 1000);

		//     Cylon.robot({
		//     connections: {
		//         raspi: { adaptor: 'raspi' }
		//     },

		//     devices: {
		//         lock: { driver: 'relay', pin: 11, type: 'open', connection: 'raspi' }
		//     },

		//     work: function (my) {
		//         // Due to a bug in Cylon.js, the app crashes the first time it tries to manipulate the GPIO pins. This block triggers a crash and an app restart.
		//         my.lock.turnOn();
		//         after(400, function() {
		//             my.lock.turnOff();
		//         });

		//         process.on('SIGINT', function (my) {
		//             console.log('Shut down.');
		//             // De-energise lock
		//             my.lock.turnOff();
		//             lcd.clear()
		//                 .setCursor(0,0).print('Bye!');
		//             process.exit(0);
		//         });

		//         my.standbyState(my);

		//         setInterval(function() {

		//             var result = (Math.random() >= 0.5);

		//             //
		//             if (result) {
		//                 my.doUnlock(my);
		//                 my.countdownAndLock(my);
		//             } else {
		//                 my.doLock(my);
		//             }
		//         }, 1000);


		//     },

		//     standbyState: function (my) {
		//         oldIp = getWiFiIp(os);
		//         my.displayDefaultMessage(oldIp);
		//         every((5).seconds(), function () {
		//             var newIp = getWiFiIp(os);
		//             if (oldIp != newIp) {
		//                 oldIp = newIp;
		//                 my.displayDefaultMessage(newIp);
		//             }
		//         });
		//     },

		//     displayDefaultMessage: function (ipAddress) {
		//         lcd.clear()
		//             .setCursor(0,0).print(DEFAULT_TITLE)
		//             .setCursor(0,1).print(ipAddress);
		//     },

		//     doUnlock: function (my) {
		//         console.log('Unlocking.');
		//         my.lock.turnOn();
		//         lcd.clear().print('Unlocked.');
		//         console.log('Unlocked.');

		//         var seconds = SECONDS_TO_LOCK;
		//         var lockingInterval = setInterval(function () {
		//             if (seconds < 1) {
		//                 my.doLock(my);
		//                 clearInterval(lockingInterval);
		//             } else {
		//                 console.log(seconds);
		//                 lcd.clear().setCursor(0,0).print('Unlocked.').setCursor(0,1).print(seconds.toString());
		//                 seconds--;
		//             }
		//         }, (1).second());
		//     },

		//     doLock: function (my) {
		//         console.log('Locking.');
		//         my.lock.turnOff();
		//         lcd.clear().print('Locked.');
		//         console.log('Locked.');
		//         my.standbyState(my);
		//     }
		// }).start();

	let oldIp;

	Cylon.robot({
		connections: {
				raspi: { adaptor: 'raspi' }
		},

		devices: {
				lock: { driver: 'relay', pin: 11, type: 'open', connection: 'raspi' }
		},

		work: function (my) {
			// Due to a bug in Cylon.js, the app crashes the first time it tries to manipulate the GPIO pins. This block triggers a crash and an app restart.
			my.lock.turnOn();
			after(400, function() {
				my.lock.turnOff();
			});

			//Shutdown procedure
			process.on('SIGINT', function (my) {
				console.log('Shut down.');
				// De-energise lock
				my.lock.turnOff();
				lcd.clear()
					.setCursor(0,0).print('Bye!');
				process.exit(0);
			});

			setInterval(function() {
				let result = (Math.random() >= 0.95);

				console.log('interval -----------------' + result);

				if (result) {
						my.doUnlock(my);
				} else if (isUnlocked && !INTERNAL_TIMER_HAS_PRIORITY) {
						my.doLock(my);
				}
			}, 1000);

			//Go into standby mode
			my.standbyState(my);

			my.bleAdvertise(my);
		},

		standbyState: function (my) {
			oldIp = getIpAddress(os);
			my.displayDefaultMessage(oldIp);
			every((5).seconds(), function () {
				var newIp = getIpAddress(os);
				if (oldIp != newIp) {
					oldIp = newIp;
					my.displayDefaultMessage(newIp);
				}
			});
		},

		displayDefaultMessage: function (ipAddress) {
			lcd.clear()
				.setCursor(0,0).print(DEFAULT_TITLE)
				.setCursor(0,1).print(ipAddress);
		},

		doUnlock: function (my) {
			console.log('Unlocking.');
			my.lock.turnOn();
			isUnlocked = true;
			lcd.clear().print('Unlocked.');
			console.log('Unlocked.');

			var seconds = SECONDS_TO_LOCK;
			var lockingInterval = setInterval(function () {
				if (seconds < 1) {
					my.doLock(my);
					clearInterval(lockingInterval);
				} else {
					console.log(seconds);
					lcd.clear().setCursor(0,0).print('Unlocked.').setCursor(0,1).print(seconds.toString());
					seconds--;
				}
			}, (1).second());
		},

		doLock: function (my) {
			console.log('Locking.');
			my.lock.turnOff();
			isUnlocked = false;
			lcd.clear().print('Locked.');
			console.log('Locked.');
			my.standbyState(my);
		},

		bleAdvertise: function (my) {
			var Descriptor = bleno.Descriptor;
			var descriptor = new Descriptor({
				uuid: '2901',
				value: 'value' // static value, must be of type Buffer or string if set
			});

			var Characteristic = bleno.Characteristic;
			var receiveEthereumTransactionCharacteristic = new Characteristic({
				uuid: '30e603adfcbf4e9da47b4ca20945ee60', // or 'fff1' for 16-bit
				properties: ['write'], // can be a combination of 'read', 'write', 'writeWithoutResponse', 'notify', 'indicate'
				secure: [], // enable security for properties, can be a combination of 'read', 'write', 'writeWithoutResponse', 'notify', 'indicate'
				value: null, // optional static value, must be of type Buffer - for read only characteristics
				descriptors: [],
				onReadRequest: null,
				onWriteRequest: function (data, offset, withoutResponse, callback) {
					console.log(data.toString());
					console.log(offset.toString());
					console.log(withoutResponse.toString());
					lcd.clear().print(data.toString());
					callback(this.RESULT_SUCCESS);
				}, // optional write request handler, function(data, offset, withoutResponse, callback) { ...}
				onSubscribe: null, // optional notify/indicate subscribe handler, function(maxValueSize, updateValueCallback) { ...}
				onUnsubscribe: null, // optional notify/indicate unsubscribe handler, function() { ...}
				onNotify: null, // optional notify sent handler, function() { ...}
				onIndicate: null // optional indicate confirmation received handler, function() { ...}
			});

			var manufacturerNameStringCharacteristic = new Characteristic({
				uuid: '2A29',
				properties: ['read'],
				secure: [],
				value: new Buffer('Isban UK'),
				descriptors: [],
				onReadRequest: null,
				onWriteRequest: null,
				onSubscribe: null,
				onUnsubscribe: null,
				onNotify: null,
				onIndicate: null
			}),
			modelNumberStringCharacteristic = new Characteristic({
				uuid: '2A24',
				properties: ['read'],
				secure: [],
				value: new Buffer('Smart Locker Mark 1'),
				descriptors: [],
				onReadRequest: null,
				onWriteRequest: null,
				onSubscribe: null,
				onUnsubscribe: null,
				onNotify: null,
				onIndicate: null
			});

			var deviceNameCharacteristic = new Characteristic({
				uuid: '2A00',
				properties: ['read'],
				secure: [],
				value: new Buffer('Smart Locker'),
				descriptors: [],
				onReadRequest: null,
				onWriteRequest: null,
				onSubscribe: null,
				onUnsubscribe: null,
				onNotify: null,
				onIndicate: null
			}),
			appearanceCharacteristic = new Characteristic({
				uuid: '2A01',
				properties: ['read'],
				secure: [],
				value: new Buffer('White metal locker.'),
				descriptors: [],
				onReadRequest: null,
				onWriteRequest: null,
				onSubscribe: null,
				onUnsubscribe: null,
				onNotify: null,
				onIndicate: null
			});

			var PrimaryService = bleno.PrimaryService;
			var receiveEthereumTransactionService = new PrimaryService({
				uuid: '030011ecfcc8412bbfb6e1c34af1ea36',
				characteristics: [receiveEthereumTransactionCharacteristic]
			}),
			deviceInformationService = new PrimaryService({
				uuid: '180A',
				characteristics: [manufacturerNameStringCharacteristic, modelNumberStringCharacteristic]
			}),
			genericAccessService = new PrimaryService({
				uuid: '1800',
				characteristics: [deviceNameCharacteristic, appearanceCharacteristic]
			});

			bleno.on('stateChange', function(state) {
				console.log('on -> stateChange: ' + state);
				if (state === 'poweredOn') {
					bleno.setServices([genericAccessService, deviceInformationService, receiveEthereumTransactionService]);
					bleno.startAdvertising('Smart Locker', ['33d8a428b86b4e33ad426f46300959a5']);
				}
				else {
					bleno.stopAdvertising();
				}
			});

			bleno.on('rssiUpdate', function(rssi) {console.log(rssi)});
		}
	}).start();
}

function getIpAddress (os) {
	var interfaces = os.networkInterfaces();
	var ipAddresses = [];

	if (typeof interfaces.eth0 !== 'undefined') {
		for (var interfaceI in interfaces.eth0) {
			var address = interfaces.eth0[interfaceI];
			if (address.family === 'IPv4' && !address.internal) {
				ipAddresses.push(address.address);
			}
		}
	} else {
		for (var interfaceI in interfaces.wlan0) {
			var address = interfaces.wlan0[interfaceI];
			if (address.family === 'IPv4' && !address.internal) {
				ipAddresses.push(address.address);
			}
		}
	}

	return ipAddresses[0];
}
