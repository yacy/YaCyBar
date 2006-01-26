var gBrowser = document.getElementById("content");
var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var Branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.yacybar.");

var gBrowser = document.getElementById("content");


var crawlingDepth = 0;
window.addEventListener("load", init, false);

function init(){
    var proxyBtn = document.getElementById("ProxyBtn");
    var indexingControllBtn = document.getElementById("IndexingControlBtn");
	if(prefManager.getIntPref("network.proxy.type")==2 && prefManager.getCharPref("network.proxy.autoconfig_url")==(getBaseURL()+"/autoconfig.pac")){
		proxyBtn.setAttribute("checked",true);
	}
	if(!Branch.getBoolPref("indexControl")){
		indexingControllBtn.setAttribute("checked", true);
	}
}
function getBaseURL() {
	var host=Branch.getCharPref("peerAddress");
	if(host==""){
		host="localhost";
	}
	var port=Branch.getIntPref("peerPort");
	if(port==0){
		port=8080;
	}
	var baseURL  = "http://" + host + ":" + port;
	
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

function toggleIndexingControl() {
    var btn = document.getElementById("IndexingControlBtn");
	btn.checked = !btn.checked;
	if (btn.checked) {
		btn.setAttribute("tooltiptext", "Indexing is OFF");
	} else {
		btn.setAttribute("tooltiptext", "Indexing is ON");
	}
	Branch.setBoolPref("indexControl",!btn.checked);
}

function toggleProxy() {
    var btn = document.getElementById("ProxyBtn");
	btn.checked = !btn.checked;
	if (btn.checked) {
		prefManager.setIntPref("network.proxy.type",2);
		prefManager.setCharPref("network.proxy.autoconfig_url",getBaseURL()+"/autoconfig.pac");
		btn.setAttribute("tooltiptext", "Proxy is OFF");
	} else {
		prefManager.setIntPref("network.proxy.type",0);
		btn.setAttribute("tooltiptext", "Proxy is ON");
	}
}
/*function showSettings() {
	window.openDialog("chrome://yacybar/content/prefs.xul","yacySettings","centerscreen, chrome, modal");
}*/
