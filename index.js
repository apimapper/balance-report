var Nightmare = require('nightmare');
var path = require('path');
var fs = require('fs');
var vo = require('vo');
configsArray = [];
resultArray = [];
plugins = ['paypal','paypal','paypal'];

function *runPluginConfigs() {
	for(var index in plugins) {
			var pluginName = plugins[index];
			var pluginUserCreds = fs.readFileSync('configs'+path.sep+pluginName+path.sep+'user.json','utf-8');
			var pluginConfigs = fs.readFileSync('configs'+path.sep+pluginName+path.sep+'config.json','utf-8');
			var pluginData = {
				'name':pluginName,
				'credentials':pluginUserCreds,
				'configs':pluginConfigs
			};
			configsArray.push(pluginData);
			/* begin of the nightmare */
			var nightmare = new Nightmare({show: true});	
			/*go to configs.login.URL*/
			var configs = JSON.parse(pluginData.configs);
			var credentials = JSON.parse(pluginData.credentials);	
			console.log("login starts");
			yield nightmare.goto(configs.login.url)
			.wait(configs.login.userRef)
			.type(configs.login.userRef,"")
			.type(configs.login.userRef, credentials.user)
			.wait(configs.login.passRef)
			.type(configs.login.passRef, "")
			.type(configs.login.passRef, credentials.pass)
			.wait(configs.login.submitRef)
			.click(configs.login.submitRef);
			console.log("navigation starts");
			yield nightmare.wait(configs.login.submitDoneRef);
			/* navigation */
			if(configs.navigation.direct !== undefined && configs.navigation.direct !== ""){
				yield nightmare.goto(configs.navigation.direct);
			}
			else {
				var targets = configs.navigation.clickTargetRefs;
				for (var a in targets) {
					var link = targets[a];
					yield nightmare.click(link);
					if(a < targets.length-1) {
						var nextTarget = targets[a+1];
						yield nightmare.wait(nextTarget);					
					}
				}
			}
			/* read balance with configs.balanceRef */
			var selector = configs.balanceRef;
			yield nightmare.wait(selector);	
			console.log("reading balance");
			var balanceStr = yield nightmare.evaluate(function (selector) {
				return document.querySelector(selector).innerText;
			},selector);
			console.log("logging out");
			yield nightmare.goto(configs.logout)
			.wait()
		    .end();
			var object = {};
			object.name = pluginName;
			object.balance = balanceStr;
			resultArray.push(object);			
	}
	return resultArray;
}

vo(runPluginConfigs)(function(err, result) {
  if (err) return console.log(err);
  console.log(result);
});