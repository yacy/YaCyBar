var Branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.yacybar.");
window.addEventListener("load", init, false);

function toggle(name) {
	var panel = document.getElementById(name);
	panel.hidden = !panel.hidden;
}


function setMonitoring() {
	var enabled = document.getElementById('cmd_MonitoringControl').getAttribute("checked");
	Branch.setBoolPref("peerMonitoring.enabled",(enabled=="true"));
	if (enabled=="true") {
		updateStatus();
	} else {
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
   http_request = false;
   http_request = new XMLHttpRequest();
   if (http_request.overrideMimeType) {
      http_request.overrideMimeType('text/xml');
   }
   if (!http_request) {
      alert('Cannot create XMLHTTP instance');
      return false;
   }
   http_request.onreadystatechange = alertContents;
   http_request.open('GET', url + parameters, true);
   http_request.send(null);
}

function alertContents() {
   if (http_request.readyState == 4) {
      if (http_request.status == 200) {

         var xmlobject = http_request.responseXML;
         var peers = xmlobject.getElementsByTagName('peers')[0];
         var your = peers.getElementsByTagName("your")[0];
         
         var ppm  = your.getElementsByTagName("ppm")[0].firstChild.nodeValue;
         var name = your.getElementsByTagName("name")[0].firstChild.nodeValue;
		 var type = your.getElementsByTagName("type")[0].firstChild.nodeValue;
		 var url = your.getElementsByTagName("links")[0].firstChild.nodeValue;
		 var rwi = your.getElementsByTagName("words")[0].firstChild.nodeValue;

		 var ppmPanel = document.getElementById('yacybar_statusBar_ppm');
		 var urlPanel = document.getElementById('yacybar_statusBar_url');
		 var rwiPanel = document.getElementById('yacybar_statusBar_rwi');
		 var peerTypePanel = document.getElementById('yacybar_statusBar_peerType');		 

         ppmPanel.label = "PPM: " + ppm;		 
         urlPanel.label = "#URL: " + url;                                    
         rwiPanel.label = "#RWI: " + rwi;
         
         peerTypePanel.setAttribute("peerType", type);
         peerTypePanel.tooltipText = "PeerType: " + type;         


      } else {
         alert('There was a problem with the request.');
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
	updateStatus();
}
