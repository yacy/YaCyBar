var request = null;


function initBlacklist() {
	document.documentElement.getButton("accept").disabled = true;
	if(window.arguments[0]) {
		var url = window.arguments[0];
		url = url.replace(/\w+:\/\/(.*)/, '$1');
		document.getElementById("blacklistURL")
			.setAttribute("value", url);
	}
	var url = getBaseURL() + '/xml/blacklists_p.xml';

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
			alert("Could not determine available blacklists");
			window.close();
		}
	}
}

function okBlacklist() {
	var gBrowser = document.getElementById("content");
	var url_to_blacklist = document.getElementById("blacklistURL").getAttribute("value");
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

function cancelBlacklist() {
	return true;
}


