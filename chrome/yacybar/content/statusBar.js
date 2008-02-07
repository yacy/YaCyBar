var Branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.yacybar.");
window.addEventListener("load", init, false);

function toggle(name) {
	var panel = document.getElementById(name);
	panel.hidden = !panel.hidden;
	if (name == 'yacybar_statusBar_qph') Branch.setBoolPref("peerMonitoring.showQPH",!panel.hidden) ;
	else if (name == 'yacybar_statusBar_ppm') Branch.setBoolPref("peerMonitoring.showPPM",!panel.hidden) ;
	else if (name == 'yacybar_statusBar_url') Branch.setBoolPref("peerMonitoring.showURL",!panel.hidden) ;
	else if (name == 'yacybar_statusBar_rwi') Branch.setBoolPref("peerMonitoring.showRWI",!panel.hidden) ;
	else if (name == 'yacybar_statusBar_peerType') Branch.setBoolPref("peerMonitoring.showPeerType",!panel.hidden) ;
}


function setMonitoring() {
	var enabled = document.getElementById('cmd_MonitoringControl').getAttribute("checked");
	Branch.setBoolPref("peerMonitoring.enabled",(enabled=="true"));
	if (enabled=="true") {
		updateStatus();
	} else {
		 document.getElementById('yacybar_statusBar_qph').label = "QPH: ?";
		 document.getElementById('yacybar_statusBar_ppm').label = "PPM: ?";
		 document.getElementById('yacybar_statusBar_url').label = "#URL: ?";
		 document.getElementById('yacybar_statusBar_rwi').label = "#RWI: ?";
		 document.getElementById('yacybar_statusBar_peerType').label = "virgin";		 	
	}
}

/*
function switchState(event) {
    var LEFT = 0, RIGHT = 2;
    var panel = document.getElementById('yacybar_statusBar_status');
    
    if (event.button==RIGHT){
    	panel.disabled = true;
    	panel.tooltipText = "disabled";
    } else if (event.button==LEFT) {    
	    panel.disabled = false;
       	panel.tooltipText = "enabled";
    }
}
*/

function makeRequest(url, parameters) {
	var stringBundle = document.getElementById("yacybar-string-bundle");
   http_request = false;
   http_request = new XMLHttpRequest();
   if (http_request.overrideMimeType) {
      http_request.overrideMimeType('text/xml');
   }
   if (!http_request) {
      alert(stringBundle.getString("yacybar_xmlhttp"));
      return false;
   }
   http_request.onreadystatechange = alertContents;
   http_request.open('GET', url + parameters, true);
   http_request.send(null);
}

function groupDigits(num) {
	var ret = "";
	while (num.length > 3) {
		ret = "." + num.slice(num.length - 3) + ret;
		num = num.substring(0, num.length - 3);
	}
	ret = num + ret;
	
	return ret;
}

function alertContents() {
   if (http_request.readyState == 4) {
      if (http_request.status == 200) {

         var xmlobject = http_request.responseXML;
         var peers = xmlobject.getElementsByTagName('peers')[0];
         var your = peers.getElementsByTagName("your")[0];
         
         var qph  = your.getElementsByTagName("qph")[0].firstChild.nodeValue;
         var ppm  = your.getElementsByTagName("ppm")[0].firstChild.nodeValue;
         var name = your.getElementsByTagName("name")[0].firstChild.nodeValue;
		 var type = your.getElementsByTagName("type")[0].firstChild.nodeValue;
		 var url = your.getElementsByTagName("links")[0].firstChild.nodeValue;
		 var rwi = your.getElementsByTagName("words")[0].firstChild.nodeValue;
		 var hash = your.getElementsByTagName("hash")[0].firstChild.nodeValue;

		 var qphPanel = document.getElementById('yacybar_statusBar_qph');
		 var ppmPanel = document.getElementById('yacybar_statusBar_ppm');
		 var urlPanel = document.getElementById('yacybar_statusBar_url');
		 var rwiPanel = document.getElementById('yacybar_statusBar_rwi');
		 var peerTypePanel = document.getElementById('yacybar_statusBar_peerType');		 
		 var stringBundle = document.getElementById("yacybar-string-bundle");
			qphPanel.label = "QPH: " + qph;
         ppmPanel.label = "PPM: " + ppm;
         urlPanel.label = "#URL: " + groupDigits(url);
         rwiPanel.label = "#RWI: " + groupDigits(rwi);
			stats = hash;         
         
         peerTypePanel.setAttribute("peerType", type);
         peerTypePanel.tooltipText = stringBundle.getString("yacybar_peertype") + type;


      } else {
         alert(stringBundle.getString("yacybar_request_problem"));
      }
   }
}

function updateStatus() {

	var enabled = Branch.getBoolPref("peerMonitoring.enabled");
	var refresh = Branch.getIntPref("peerMonitoring.refreshRate");
	if (refresh < 1000) refresh = 1000;
	
	if (enabled) {
		var host=Branch.getCharPref("peerAddress");
		var port=Branch.getIntPref("peerPort");
		
		makeRequest('http://' + host + ':' + port + '/Network.xml', '');
	}
	self.setTimeout('updateStatus()', refresh);	
}

function init() {
	var enabled = Branch.getBoolPref("peerMonitoring.enabled");
	if (enabled) {
		document.getElementById('cmd_MonitoringControl').setAttribute("checked","true");
	} else {
		document.getElementById('cmd_MonitoringControl').removeAttribute("checked");
	}
	
	if (Branch.getBoolPref("peerMonitoring.showQPH")) {
		document.getElementById('yacybar_statusBar_qph').hidden = false;
		document.getElementById('cmd_showQPH').setAttribute("checked","true");
	}
	
	if (Branch.getBoolPref("peerMonitoring.showPPM")) {
		document.getElementById('yacybar_statusBar_ppm').hidden = false;
		document.getElementById('cmd_showPPM').setAttribute("checked","true");
	}
	if (Branch.getBoolPref("peerMonitoring.showURL")) {
		document.getElementById('yacybar_statusBar_url').hidden = false;
		document.getElementById('cmd_showURL').setAttribute("checked","true");
	}
	if (Branch.getBoolPref("peerMonitoring.showRWI")) {
		document.getElementById('yacybar_statusBar_rwi').hidden = false;
		document.getElementById('cmd_showRWI').setAttribute("checked","true");
	}
	if (Branch.getBoolPref("peerMonitoring.showPeerType")) {
		document.getElementById('yacybar_statusBar_peerType').hidden = false;
		document.getElementById('cmd_showPeerType').setAttribute("checked","true");	
	}
	updateStatus();
}

function loadURL(newURL) {
	// gBrowser.addTab(newURL);
	window._content.document.location = newURL;
	window.content.focus();
}

function showStats(event) {
		loadURL("http://www.yacystats.de/peer/"+stats); 
}
// TODO show only if loged in
