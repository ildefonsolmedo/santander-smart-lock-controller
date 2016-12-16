var bleno = require('bleno');

var bleAdvertise = function (my) {
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

module.exports.bleAdvertise = bleAdvertise;
