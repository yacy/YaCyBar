var Branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.yacybar.");

var alertsService = Components.classes["@mozilla.org/alerts-service;1"]
		.getService(Components.interfaces.nsIAlertsService);

window.addEventListener("load", checkForChanges, false);

var message_req = false;


function makeXMLRequest(req, url, callbackfunc) {
	var userPwd = loadUserPwd();

	if (req.overrideMimeType) {
		req.overrideMimeType('text/xml');
	}
	req.onreadystatechange = callbackfunc;
	req.open('GET', url, true, userPwd["user"], userPwd["pwd"]);
	req.send(null);
	return true;
}

function checkForChanges() {

	var messageEnabled = Branch.getBoolPref("Notification.Message");
	var refreshRate = 30;
	try {
		refreshRate = Branch.getIntPref("Notification.refreshRate");
	} catch (e) {}
	if (refreshRate < 30) refreshRate = 30;

	if (messageEnabled) {
		message_req = new XMLHttpRequest();
		makeXMLRequest(message_req, getBaseURL() + '/Messages_p.xml', MessageHandler);
	}
	self.setTimeout('checkForChanges()', refreshRate * 1000);
}

var alertListener = {
	observe: function(subject, topic, data) {
		if(topic == "alertclickcallback") {
			gBrowser.selectedTab = gBrowser.addTab(getBaseURL() + data);
		}
	}
}

function MessageHandler() {
	if (message_req.readyState == 4) {
		try {
			if ("status" in message_req && message_req.status == 200) {
				var xml = message_req.responseXML;
				var messages = xml.getElementsByTagName("message");
				if(messages.length > 0) {
					msg = messages[messages.length-1]
					var msg_id = msg.getAttribute("id");
					try {
						last_id = Branch.getCharPref("Message.last_id");
						if(last_id != msg_id) {
							throw "new message";
						}
					} catch (e) {
						// catch no existing branch and new message
						var subject = msg.getElementsByTagName("subject")[0].firstChild.nodeValue;
						var from = msg.getElementsByTagName("from")[0].firstChild.nodeValue;
						var stringBundle = document.getElementById("yacybar-string-bundle");

						alertsService.showAlertNotification("chrome://yacybar/skin/yacy_logo.gif", 
								stringBundle.getString("yacybar_message_title"),
								subject + " " + stringBundle.getString("yacybar_message_from")
								+ " " + from,
								true, "/Messages_p.html?action=view&object="+msg_id,
								alertListener);
						Branch.setCharPref("Message.last_id", msg_id)
					}
				}
			}
		} catch(e) {
			log(e);
		}
	}
			
}
