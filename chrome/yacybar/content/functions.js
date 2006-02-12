var Branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.yacybar.");
var passwordManager = Components.classes["@mozilla.org/passwordmanager;1"].createInstance();

function getBaseURL() {
	var host=Branch.getCharPref("peerAddress");
	var port=Branch.getIntPref("peerPort");
	var baseURL  = "http://" + host + ":" + port;	
	return baseURL;
}

function loadUserPwd() {
	var passwordManager = Components.classes["@mozilla.org/passwordmanager;1"].createInstance(Components.interfaces.nsIPasswordManagerInternal);
  	var host = {value:""};
  	var user =  {value:""};
  	var password = {value:""}; 

	try {
		passwordManager.findPasswordEntry("chrome://yacybar/", null, null, host, user, password);
	} catch(e){ 
		//alert(e);
		return null;
	}
	
	var returnVal = Array();
	returnVal["user"] = user.value;
	returnVal["pwd"] = password.value;
	
	return returnVal;
}

