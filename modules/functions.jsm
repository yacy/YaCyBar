
var EXPORTED_SYMBOLS = ["yacyFunctions"];


var yacyFunctions = {

	getPrefBranch: function() {
		if(!this._PrefBranch) {
			var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			this._PrefBranch = prefManager.getBranch("extensions.yacybar.");

		}
		return this._PrefBranch;
	},

	getPasswordManager: function() {
		if(!this._PasswordManager) {
			this._PasswordManager = Components.classes["@mozilla.org/login-manager;1"]
					.getService(Components.interfaces.nsILoginManager);

		}
		return this._PasswordManager;
	},

	getConsoleService: function() {
		if(!this._ConsoleService) {
			this._ConsoleService = Components.classes["@mozilla.org/consoleservice;1"]
					.getService(Components.interfaces.nsIConsoleService);
		}
		return this._ConsoleService;
	},

	log: function(string){
		var cons = this.getConsoleService();
		cons.logStringMessage("yacybar: " + string + "\n");
	},

	getBaseURL: function() {
		var Branch = this.getPrefBranch();
		var host;
		var port;
		var protocol;

		if(Branch.getBoolPref("demomode")){
			host=Branch.getCharPref("demoAddress");
			port=Branch.getIntPref("demoPort");
			protocol="http://";
		} else {
			host=Branch.getCharPref("peerAddress");
			port=Branch.getIntPref("peerPort");
			protocol=Branch.getBoolPref("peerSSL") ? "https://" : "http://";
		}
		var baseURL  = protocol + host + ":" + port;	
		return baseURL;
	},

	loadUserPwd: function() {
		// Firefox 3 and above only
		var passwordManager = this.getPasswordManager();
		var logins = passwordManager.findLogins({}, "chrome://yacybar/", null, "chrome://yacybar/");

	
		var returnVal = Array();
		if(logins.length > 0) {
			returnVal["user"] = logins[0].username;
			returnVal["pwd"] = logins[0].password;
		} else {
			return null;
		}
		
		return returnVal;
	},

}

