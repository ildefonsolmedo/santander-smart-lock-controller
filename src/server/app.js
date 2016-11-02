/*jslint unparam: true, node: true */
/*globals Promise: true*/
'use strict';
var config = require('config'),
    catalog = require('xcatalog'),
    Cylon = require('cylon'),
	LCD = require('./lcd.js'),
	lcd = new LCD('/dev/i2c-1', 0x3F),
	os = require('os'),
	noble = require('noble');

const DEFAULT_TITLE = 'Smart Locker',
	SECONDS_TO_LOCK = 3;

console.log('Configuration environment: ' + config.util.getEnv('NODE_ENV'));
console.log('Configuration instance: ' + config.util.getEnv('NODE_APP_INSTANCE'));

//Load catalog config - DI
require('./catalog-config')(catalog);

//When DI module is ready, start the server/s
catalog.ready().then(function (catalog) {

  // DI for serverSetup service
  var serverSetup = catalog('serverSetup');

  //Create API server
  var oServerConfig =  config.server;
      oServerConfig.routers = config.routers;
      oServerConfig.log = config.log;
  var server = serverSetup.createAPIServer(oServerConfig);
  
  startLocker();

}).catch(function (reason) {
    console.error(reason);
});

function startLocker() {
    
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
            
            process.on('SIGINT', function (my) {
                console.log('Shut down.');
                // De-energise lock
                my.lock.turnOff();
                lcd.clear()
                    .setCursor(0,0).print('Bye!');
                process.exit(0);
            });

            my.standbyState(my);
            
            setInterval(function() {
                
                var result = (Math.random() >= 0.5);
                
                console.log('interval -----------------' + result);
                
                //
                if (result) {
                    my.doUnlock(my);
                    my.countdownAndLock(my);
                } else {
                    my.doLock(my);
                }
            }, 1000);
            
            
        },

        standbyState: function (my) {
            oldIp = getWiFiIp(os);
            my.displayDefaultMessage(oldIp);
            every((5).seconds(), function () {
                var newIp = getWiFiIp(os);
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
            lcd.clear().print('Locked.');
            console.log('Locked.');
            my.standbyState(my);
        }
    }).start();    
    
}

function getWiFiIp (os) {
	var interfaces = os.networkInterfaces();
	var ipAddresses = [];
	for (var interfaceI in interfaces.wlan0) {
		var address = interfaces.wlan0[interfaceI];
		if (address.family === 'IPv4' && !address.internal) {
			ipAddresses.push(address.address);
		}
	}

	return ipAddresses[0];
}
