var request = null;


function initBlacklist() {
	document.documentElement.getButton("accept").disabled = true;

	resetURL();

	var url = getBaseURL() + yacyVersion.getAPIDir() + '/blacklists_p.xml?attrOnly=1';

	request = new XMLHttpRequest();
	var userPwd = loadUserPwd();
	if (request.overrideMimeType) {
		request.overrideMimeType('text/xml');
	}
	request.onreadystatechange = loadBlacklistsHandler;
	request.open("GET", url, true, userPwd["user"], userPwd["pwd"]);
	request.send(null);
	return true;
}

function loadBlacklistsHandler() {
	if (request.readyState == 4) {
		if("status" in request && request.status == 200) {
			var xmlobject = request.responseXML;
			var lists = xmlobject.getElementsByTagName("list");
			// clear list
			var listMenu = document.getElementById("blacklistName").firstChild;
			var item = listMenu.firstChild;
			while(item != null) {
				listMenu.removeChild(item);
				item = listMenu.firstChild;
			}

			for(var i=0; i<lists.length; i++) {
				item = document.createElement("menuitem");
				item.setAttribute("label", lists[i].getAttribute("name"));
				listMenu.appendChild(item);
			}
			document.getElementById("blacklistName").selectedItem = listMenu.firstChild;
			document.getElementById("throbber").setAttribute("src", "chrome://global/skin/throbber/Throbber-small.png");
			document.documentElement.getButton("accept").disabled = false;
		} else {
			var stringBundle = document.getElementById("yacybar-string-bundle");
			alert(stringBundle.getString("yacybar_noblacklist"));
			window.close();
		}
	}
}

function okBlacklist() {
	var gBrowser = document.getElementById("content");
	var url_to_blacklist = document.getElementById("blacklistURL").value;
	var list = document.getElementById("blacklistName").label;

	var request_url = getBaseURL() + "/Blacklist_p.html?addBlacklistEntry=&currentBlacklist="
			+ encodeURI(list) + "&newEntry=" + encodeURI(url_to_blacklist);
	log(request_url);
	var saveRequest = new XMLHttpRequest();
	var userPwd = loadUserPwd();
	request.open("GET", request_url, false, userPwd["user"], userPwd["pwd"]);
	request.send(null);

	return true;
}

function selectDomain() {
	var url_to_blacklist = document.getElementById("blacklistURL").value;

	url_to_blacklist = url_to_blacklist.replace(/(\w+:\/\/)?(.*?\/).*/, '$2.*');

	document.getElementById("blacklistURL").value = url_to_blacklist;
}

function selectSubdomains() {
	var url_to_blacklist = document.getElementById("blacklistURL").value;

	url_to_blacklist = url_to_blacklist.replace(/(\w+:\/\/)?([^\s\.\/]+\.)*([^\s\.\/]+\.\w+)\/.*/, '*.$3/.*');

	document.getElementById("blacklistURL").value = url_to_blacklist;
}

function resetURL() {
	var url_to_blacklist = window.arguments[0];

	url_to_blacklist = url_to_blacklist.replace(/\w+:\/\/(.*)/, '$1');

	document.getElementById("blacklistURL").value = url_to_blacklist;
}

