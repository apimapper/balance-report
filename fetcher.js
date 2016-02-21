var validator = require('validator');

module.exports = {
  getBalance: function (nightmare,confs,creds) {
	/*go to configs.login.URL*/
	var configs = JSON.parse(confs);
	var credentials = JSON.parse(creds);	
	nightmare.goto(configs.login.url);
	/*pass credentials.user to configs.login.userRef */
	nightmare.wait(configs.login.userRef)
	.type(configs.login.userRef, credentials.user);
	/*pass credentials.pass to configs.login.passRef */
	nightmare.wait(configs.login.passRef)
	.type(configs.login.passRef, credentials.pass);
	/*submit login form with configs.login.submitRef */
	nightmare.wait(configs.login.submitRef)
	.click(configs.login.submitRef);
	/*run navigation to balance page iterating array of urls from configs.navigation*/
	var URLs = configs.navigation;
	for (var a in URLs) {
		var aURL = URLs[a];
		if(validator.isURL(aURL)) {
			nightmare.goto(aURL);
			nightmare.wait();
		}
	}
	/*read balance with configs.balanceRef*/
	var selector = configs.balanceRef;
	var balanceStr = nightmare.evaluate(function (selector) {
		return document.querySelector(selector).innerText;
	});
	nightmare.end();
    return balanceStr;
  }
}
