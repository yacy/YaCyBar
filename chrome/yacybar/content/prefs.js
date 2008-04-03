function setUserPwd() {
	var username=document.getElementById('yacybar_peerUserField').value;
	var password=document.getElementById('yacybar_peerPwdField').value;	
	

	var oldUserPwd = loadUserPwd();
	if (oldUserPwd != null && oldUserPwd["user"] != null && oldUserPwd["user"] != "") {
		removeUser(oldUserPwd["user"]);
	}
	if(password != "") {
		addUser(username, password);
	}
}

function onLoad() {
	window.sizeToContent();

	var userPwd = loadUserPwd();
	if (userPwd != null && userPwd["user"] != null && userPwd["user"] != "") {
		document.getElementById('yacybar_peerUserField').value = userPwd["user"];
		document.getElementById('yacybar_peerPwdField').value = userPwd["pwd"];
	}
}

function addUser(username, password) {
	if ("@mozilla.org/passwordmanager;1" in Components.classes) {
		// Password Manager exists so this is not Firefox 3 (could be Firefox 2, Netscape, SeaMonkey, etc).
		// Password Manager code

		var passwordManager = Components.classes["@mozilla.org/passwordmanager;1"].createInstance();
		if (passwordManager) {
			passwordManager = passwordManager.QueryInterface(Components.interfaces.nsIPasswordManager);
				
			try{
				passwordManager.addUser("chrome://yacybar/", username, password);
			} catch (e) {
				alert(e);
			}
		}
	} else if ("@mozilla.org/login-manager;1" in Components.classes) {
		// Login Manager exists so this is Firefox 3
		// Login Manager code
		var passwordManager = Components.classes["@mozilla.org/login-manager;1"]
				.getService(Components.interfaces.nsILoginManager);
		var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",
				Components.interfaces.nsILoginInfo, "init");

		var authLoginInfo = new nsLoginInfo('chrome://yacybar/',
				null, 'chrome://yacybar/',
				username, password, "", "");
		passwordManager.addLogin(authLoginInfo);
	}
}

function removeUser(username) {
	if ("@mozilla.org/passwordmanager;1" in Components.classes) {
		// Password Manager exists so this is not Firefox 3 (could be Firefox 2, Netscape, SeaMonkey, etc).
		// Password Manager code
		var passwordManager = Components.classes["@mozilla.org/passwordmanager;1"].createInstance();
		if (passwordManager) {
			passwordManager = passwordManager.QueryInterface(Components.interfaces.nsIPasswordManager);
			
			try {
				passwordManager.removeUser("chrome://yacybar/", username);
			} catch (e) {
				alert(e);
			}
		}
	} else if ("@mozilla.org/login-manager;1" in Components.classes) {
		// Login Manager exists so this is Firefox 3
		// Login Manager code
		var passwordManager = Components.classes["@mozilla.org/login-manager;1"]
				.getService(Components.interfaces.nsILoginManager);
		 
		// Find users for this extension 
		var logins = passwordManager.findLogins({}, "chrome://yacybar/", null, "chrome://yacybar/");

		for (var i = 0; i < logins.length; i++) {
			if (logins[i].username == username) {
				passwordManager.removeLogin(logins[i]);
				break;
			}
		}

	}
}

function changeProxySettings() {
	var Branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.yacybar.");
	
	if(Branch.getBoolPref("proxyControl")){
		var host = document.getElementById('yacybar_peerAddressField').value;
		var port = document.getElementById('yacybar_peerPortField').value;
		var protocol = document.getElementById('yacybar_peerSSLField').value ? "https://" : "http://";
		prefManager.setCharPref("network.proxy.autoconfig_url", protocol + host + ":" + port + "/autoconfig.pac");
	}
}
function setStartPage(){
	prefManager.setCharPref("browser.startup.homepage", getBaseURL());
}
