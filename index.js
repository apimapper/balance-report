var Nightmare = require('nightmare');
var dir = require('node-dir');
var path = require('path');
var fs = require('fs');
var Vo = require('vo');
var fetcher = require('./fetcher.js');
configsArray = [];

function runPluginConfigs() {
	dir.subdirs('configs', function(err, subdirs) {
		if (err) throw err;
		for (var x in subdirs){
			var pluginName = subdirs[x].split(path.sep)[1];
			var pluginUserCreds = fs.readFileSync(subdirs[x]+path.sep+'user.json','utf-8');
			var pluginConfigs = fs.readFileSync(subdirs[x]+path.sep+'config.json','utf-8');
			var object = {
				'name':pluginName,
				'credentials':pluginUserCreds,
				'configs':pluginConfigs
			};
			configsArray.push(object);
			executeFetch(object);
		}
		//console.log(configsArray);
	});
}

var executeFetch = function(pluginData) {
	console.log('starting plugin %s',pluginData.name);
	var nightmareContinues = true;
	var nightmare = Nightmare({ show: true });
	nightmare.on('destroyed',function(){
		console.log('nightmare ended');
		nightmareContinues = false;
	});
	var balance = fetcher.getBalance(nightmare, pluginData.configs, pluginData.credentials);
// vittu en tähän kyllä mitään async kirjastoa ota tätä varten, perkele sitten vaikka pythonilla
//	while(nightmareContinues) {
//		setTimeout(10000);
//	}
	console.log("Balance of %s was --> %s",pluginData.name,balance); 
}

var main = function(){
    runPluginConfigs();
}

if (require.main === module) {
    main();
}