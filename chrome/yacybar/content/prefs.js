function setUserPwd() {
	var username=document.getElementById('yacybar_peerUserField').value;
	var password=document.getElementById('yacybar_peerPwdField').value;	
	

	var oldUserPwd = loadUserPwd();
	if (oldUserPwd != null && oldUserPwd["user"] != null && oldUserPwd["user"] != "") {
		removeUser(oldUserPwd["user"]);
	}
	addUser(username, password);
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
	var passwordManager = Components.classes["@mozilla.org/passwordmanager;1"].createInstance();
	if (passwordManager) {
		passwordManager = passwordManager.QueryInterface(Components.interfaces.nsIPasswordManager);
			
		try{
		  passwordManager.addUser("chrome://yacybar/", username, password);
		} catch (e) { 
			alert(e);
		}
	}
}

function removeUser(username) {
	var passwordManager = Components.classes["@mozilla.org/passwordmanager;1"].createInstance();
	if (passwordManager) {
		passwordManager = passwordManager.QueryInterface(Components.interfaces.nsIPasswordManager);
		
		try {
			passwordManager.removeUser("chrome://yacybar/", username);
		} catch (e) {
			alert(e);
		}
	}
}

function loadUserPwd() {
	var passwordManager = Components.classes["@mozilla.org/passwordmanager;1"].createInstance(Components.interfaces.nsIPasswordManagerInternal);
  	var host = {value:""};
  	var user =  {value:""};
  	var password = {value:""}; 

	try {
		passwordManager.findPasswordEntry("chrome://yacybar/", null, null, host, user, password);
	} catch(e){ 
		alert(e);
		return null;
	}
	
	var returnVal = Array();
	returnVal["user"] = user.value;
	returnVal["pwd"] = password.value;
	
	return returnVal;
}