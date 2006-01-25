var gBrowser = document.getElementById("content");
var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

var crawlingDepth = 0;

function getBaseURL() {
	var peerAddress = prefManager.getCharPref("extensions.yacybar.peerAddress");	
	var peerPort = prefManager.getIntPref("extensions.yacybar.peerPort");	
	var baseURL  = "http://" + peerAddress + ":" + peerPort;
	
	return baseURL;
}

function search(){
	var searchwords=document.getElementById("search").value;
	// alert(searchwords);
	loadOneOrMoreURIs(getBaseURL() + "/index.html?search="+searchwords);
}

function blacklistpage(){
	var url=window.content.prompt("Blacklist URL:", window._content.location);
	if(url != null && url != ""){
		gBrowser.addTab(getBaseURL() + "/Blacklist_p.html?addbutton=addbutton&filename=default.black&newItem="+url);
	}
}	

function changeCrawlingDepth(newCrawlingDepth) {
	crawlingDepth = newCrawlingDepth;
}

function crawlpage() {
    var url = window.content.prompt("Index URL with depth '" + crawlingDepth + "':", window._content.location);
	if(url != null && url != ""){
		window.open(getBaseURL() + '/QuickCrawlLink_p.html?localIndexing=on&crawlingQ=on&crawlingDepth=' + crawlingDepth + '&xdstopw=on&title='+escape(document.title)+'&url='+url,'_blank','height=150,width=500,resizable=yes,scrollbar=no,directory=no,menubar=no,location=no');
	}
}
	
function showAbout() {
	window.openDialog("chrome://yacybar/content/about.xul","yacybarAbout","centerscreen, chrome, modal");
}	

function showPrefs() {
	window.openDialog("chrome://yacybar/content/prefs.xul","yacybarPrefs","centerscreen, chrome, modal");
}	

function loadURL(newURL) {
	window._content.document.location = newURL;
	window.content.focus();
}
