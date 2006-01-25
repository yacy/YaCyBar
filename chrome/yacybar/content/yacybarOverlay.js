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
	searchKeyword(searchwords);
}

function searchSelected() {
	var selText = gContextMenu.searchSelected();
	if (selText != null && selText != "") {
		var searchTextBox=document.getElementById("search");
		searchTextBox.value = selText;
		searchKeyword(selText);
	}
}

function searchKeyword(keyword) {
	// alert(searchwords);
	loadOneOrMoreURIs(getBaseURL() + "/index.html?search="+keyword);	
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
    var url = window._content.location;
    var title = document.title;
	crawlURL(url,title);
}

function crawllink() {
	var url = gContextMenu.link;
	var title = gContextMenu.linkText();
	crawlURL(url,title); 
}
	
function crawlURL(url, title) {
	url = window.content.prompt("Index URL with depth '" + crawlingDepth + "':", url)
	if(url != null && url != ""){
		window.open(getBaseURL() + '/QuickCrawlLink_p.html?localIndexing=on&crawlingQ=on&crawlingDepth=' + crawlingDepth + '&xdstopw=on&title='+escape(title)+'&url='+ escape(url),'_blank','height=150,width=500,resizable=yes,scrollbar=no,directory=no,menubar=no,location=no');
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
