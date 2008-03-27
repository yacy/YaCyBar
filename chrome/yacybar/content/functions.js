var Branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.yacybar.");
var passwordManager = Components.classes["@mozilla.org/passwordmanager;1"].createInstance();
var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var cons = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);

function log(string){
	cons.logStringMessage(string+"\n");
}

function getBaseURL() {
	var host;
	var port;
	var protocol;
	if(Branch.getBoolPref("demomode")){
		host=Branch.getCharPref("demoAddress");
		port=Branch.getIntPref("demoPort");
		protocol="http://";
	}else{
		host=Branch.getCharPref("peerAddress");
		port=Branch.getIntPref("peerPort");
		protocol=Branch.getBoolPref("peerSSL") ? "https://" : "http://";
	}
		var baseURL  = protocol + host + ":" + port;	
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

String.prototype.trim =      function() {
  return (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""));
}

