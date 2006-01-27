var gBrowser = document.getElementById("content");
var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var Branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.yacybar.");

var gBrowser = document.getElementById("content");
var crawling = Array();

var req;
var crawlingDepth = 0;
window.addEventListener("load", init, false);

function init(){
    var proxyBtn = document.getElementById("ProxyBtn");
    var proxyToolbarBtn = document.getElementById("ProxyToolbarBtn");
    var indexingControllBtn = document.getElementById("IndexingControlBtn");
	if(prefManager.getIntPref("network.proxy.type")==2 && prefManager.getCharPref("network.proxy.autoconfig_url")==(getBaseURL()+"/autoconfig.pac")){
		proxyBtn.setAttribute("checked",true);
		proxyToolbarBtn.setAttribute("checked",true);
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


function loadYACY(){
	gBrowser.addTab(getBaseURL()+"/");
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

function crawlReceipt() {

	if (req.readyState == 4) {
        if (req.status == 200) {
			// parsing xml here
			var response = req.responseXML;
			
			var newJob = Array();
			newJob["date"] = (new Date()).toLocaleString();
			newJob["title"] = response.getElementsByTagName("title")[0].firstChild.data;
			newJob["url"] = response.getElementsByTagName("url")[0].firstChild.data;
			newJob["status"] = response.getElementsByTagName("status")[0].firstChild.data;
			newJob["statusCode"] = response.getElementsByTagName("status")[0].getAttribute("code");
			crawling.push(newJob); 

			window.openDialog("chrome://yacybar/content/sidebarOverlay.xul","yacybarCrawlJobs", "chrome,centerscreen,resizable",crawling);         
        } else {
        	alert("ERROR");
            alert("There was a problem retrieving the XML data:\n" + req.status + "\n" + req.statusText);
        }        
	} 
}

function crawllink() {
	var url = gContextMenu.link;
	var title = gContextMenu.linkText();
	crawlURL(url,title); 
}
	
function crawlURL(url, title) {
	url = window.content.prompt("Index URL with depth '" + crawlingDepth + "':", url)
	if(url != null && url != ""){
    
		req = false;
	    // branch for native XMLHttpRequest object
	    if(window.XMLHttpRequest) {
	    	try {
				req = new XMLHttpRequest();
	        } catch(e) {
				req = false;
	        }
	    }
	
		if(req) {
			// loading username + pwd
			var userPwd = loadUserPwd();
		
			req.onreadystatechange = crawlReceipt;
			req.open("GET", getBaseURL() + 
						 '/QuickCrawlLink_p.xml?localIndexing=on&crawlingQ=on&crawlingDepth=' + crawlingDepth + '&xdstopw=on&title='+escape(title)+'&url='+ escape(url),
						 true,					 
						 userPwd["user"],
						 userPwd["pwd"]);
			req.send("");
		}    	
	
	
//		window.open(getBaseURL() + '/QuickCrawlLink_p.html?localIndexing=on&crawlingQ=on&crawlingDepth=' + crawlingDepth + '&xdstopw=on&title='+escape(title)+'&url='+ escape(url),'_blank','height=150,width=500,resizable=yes,scrollbar=no,directory=no,menubar=no,location=no');
	}
}	
	
function showAbout() {
	window.openDialog("chrome://yacybar/content/about.xul","yacybarAbout","centerscreen, chrome, modal");
}	

function showPrefs() {
	window.openDialog("chrome://yacybar/content/prefs.xul","yacybarPrefs","centerscreen, chrome, modal");
}	

function showCrawlJobs() {
	window.openDialog("chrome://yacybar/content/sidebarOverlay.xul","yacybarCrawlJobs","centerscreen, chrome, resizable", crawling);
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
	var checked = !btn.checked;
	btn.checked = checked;
	/*toolbarbutton, too*/
    btn = document.getElementById("ProxyToolbarBtn");
	btn.checked = checked;
	if (btn.checked) {
		prefManager.setIntPref("network.proxy.type",2);
		prefManager.setCharPref("network.proxy.autoconfig_url",getBaseURL()+"/autoconfig.pac");
		btn.setAttribute("tooltiptext", "Proxy is ON");
	} else {
		prefManager.setIntPref("network.proxy.type",0);
		btn.setAttribute("tooltiptext", "Proxy is OFF");
	}
}
/*function showSettings() {
	window.openDialog("chrome://yacybar/content/prefs.xul","yacySettings","centerscreen, chrome, modal");
}*/
