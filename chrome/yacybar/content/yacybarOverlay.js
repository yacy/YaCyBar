var gBrowser = document.getElementById("content");
var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var Branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.yacybar.");

var req;
var crawling = Array();
window.addEventListener("load", init, false);
window.addEventListener("focus",focusChanged,true);

function init(){
	
	/* ================================================================
		Preferences initialization for first run of yacybar 
	   ================================================================ */
	// init quickCrawl settings
	if (!Branch.prefHasUserValue("QuickCrawl.showQuickCrawlDialog")) {
		var crawlJobData = Array();
		initQuickCrawlPrefs(crawlJobData);
		saveQuickCrawlPrefs(crawlJobData);	
	}
	
	// init index control settings
	if (!Branch.prefHasUserValue("indexControl")) {
		Branch.setBoolPref("indexControl",true);
	}
	
	// init proxy settings
	if (!Branch.prefHasUserValue("peerAddress")) {
		Branch.setCharPref("peerAddress","localhost");
	}
	if (!Branch.prefHasUserValue("peerPort")) {
		Branch.setIntPref("peerPort",8080);
	}	
	
	// init proxy control buttion
	if (!Branch.prefHasUserValue("proxyControl")) {
		if(prefManager.getIntPref("network.proxy.type")==2 && prefManager.getCharPref("network.proxy.autoconfig_url")==(getBaseURL()+"/autoconfig.pac")){
			Branch.setBoolPref("proxyControl",true);
		} else {
			Branch.setBoolPref("proxyControl",false);
		}
	}	
	
	/* ================================================================
		Button initialization 
	   ================================================================ */
	// initialize proxy btn
	setProxyControlBtn(Branch.getBoolPref("proxyControl"));
	
	// initialize indexing btn
	setIndexControlBtn(Branch.getBoolPref("indexControl"));
}
function getBaseURL() {
	var host=Branch.getCharPref("peerAddress");
	var port=Branch.getIntPref("peerPort");
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

function crawlpage() {
    var url = window._content.location;
    var title = document.title;
	showQuickCrawlDialog(url,title);
}

function crawllink() {
	var url = gContextMenu.link;
	var title = gContextMenu.linkText();
	showQuickCrawlDialog(url,title); 
}
			
function showAbout() {
	window.openDialog("chrome://yacybar/content/about.xul","yacybarAbout","centerscreen, chrome, modal");
}	

function showPrefs() {
	window.openDialog("chrome://yacybar/content/prefs.xul","yacybarPrefs","centerscreen, chrome, modal");
}	

function loadURL(newURL) {
	gBrowser.addTab(newURL);
	//window._content.document.location = newURL;
	//window.content.focus();
}

function setIndexControlBtn(checked) {
	// setting the gui elements accordingly
	var tooltipText;
	if (checked) tooltipText = "Indexing is ON";
	else tooltipText = "Indexing is OFF";
	document.getElementById('cmd_toggleIndexing').setAttribute('checked',checked);
	document.getElementById('cmd_toggleIndexing').setAttribute("tooltiptext", tooltipText);
}

function toggleIndexing() {
	// getting the current proxy control state	
	var checked = Branch.getBoolPref("indexControl");

	// toggle it
	checked = !checked;
	
	// setting the gui elements accordingly
	setIndexControlBtn(checked);	
	
	// store the settings
	Branch.setBoolPref("indexControl",checked);
}

function setProxyControlBtn(checked) {
	// setting the gui elements accordingly
	var tooltipText;
	if (checked) tooltipText = "Proxy is ON";
	else tooltipText = "Proxy is OFF";
	document.getElementById('cmd_toggleProxy').setAttribute('checked',checked);
	document.getElementById('cmd_toggleProxy').setAttribute("tooltiptext", tooltipText);
}

function toggleProxy() {
	// getting the current proxy control state	
	var checked = Branch.getBoolPref("proxyControl");
	
	// toggle it
	checked = !checked;

	// setting the gui elements accordingly
	setProxyControlBtn(checked);

	// store the settings
	Branch.setBoolPref("proxyControl",checked);	
	if (checked) {
		prefManager.setIntPref("network.proxy.type",2);
		prefManager.setCharPref("network.proxy.autoconfig_url",getBaseURL()+"/autoconfig.pac");
	} else {
		prefManager.setIntPref("network.proxy.type",0);
	}
	
}

function focusChanged() {
	setProxyControlBtn(Branch.getBoolPref("proxyControl"));
	setIndexControlBtn(Branch.getBoolPref("indexControl"));
}

function initQuickCrawlPrefs(crawlJobData) {
	crawlJobData["filter"] = ".*";
	crawlJobData["depth"] =	0;
	crawlJobData["crawlingQ"] = true;
	crawlJobData["storeHTCache"] = true;
	crawlJobData["crawlOrder"] = false;
	crawlJobData["xdstopw"] = true;	
	crawlJobData["showQuickCrawlDialog"] = true;	
}

function loadQuickCrawlPrefs(crawlJobData) {
	crawlJobData["filter"] = Branch.getCharPref("QuickCrawl.last.filter");
	crawlJobData["depth"] =	Branch.getIntPref("QuickCrawl.last.depth");
	crawlJobData["crawlingQ"] = Branch.getBoolPref("QuickCrawl.last.crawlingQ");
	crawlJobData["storeHTCache"] = Branch.getBoolPref("QuickCrawl.last.storeHTCache");
	crawlJobData["crawlOrder"] = Branch.getBoolPref("QuickCrawl.last.crawlOrder");
	crawlJobData["xdstopw"] = Branch.getBoolPref("QuickCrawl.last.xdstopw");	
	crawlJobData["showQuickCrawlDialog"] = Branch.getBoolPref("QuickCrawl.showQuickCrawlDialog");	
	return crawlJobData;
}

function saveQuickCrawlPrefs(crawlJobData) {
	/* Storing settings into preferences for next usage */
	Branch.setCharPref("QuickCrawl.last.filter",crawlJobData["filter"]);
	Branch.setIntPref("QuickCrawl.last.depth",crawlJobData["depth"]);
	Branch.setBoolPref("QuickCrawl.last.crawlingQ",crawlJobData["crawlingQ"]);
	Branch.setBoolPref("QuickCrawl.last.storeHTCache",crawlJobData["storeHTCache"]);
	Branch.setBoolPref("QuickCrawl.last.crawlOrder",crawlJobData["crawlOrder"]);
	Branch.setBoolPref("QuickCrawl.last.xdstopw",crawlJobData["xdstopw"]);
	Branch.setBoolPref("QuickCrawl.showQuickCrawlDialog",crawlJobData["showQuickCrawlDialog"]);
}

function showQuickCrawlDialog(url, title) {
	var crawlJobData = Array();
	crawlJobData["url"] = url;
	crawlJobData["title"] = title;

	/* loading quickCrawl settings from preferences */
	loadQuickCrawlPrefs(crawlJobData);
	
	/* showing the quickCrawl dialog */
	if (crawlJobData["showQuickCrawlDialog"] != null && crawlJobData["showQuickCrawlDialog"]) {
		var theDialog = window.openDialog("chrome://yacybar/content/QuickCrawl.xul","yacybarQuickCrawl","centerscreen, chrome, modal",crawlJobData);
	} else {
		crawlJobData["crawlIt"] = true;
	}

	/* Storing settings into preferences for next usage */
	saveQuickCrawlPrefs(crawlJobData);
	
	if (crawlJobData != null && crawlJobData["crawlIt"] != null && crawlJobData["crawlIt"]) {
		crawlURL(crawlJobData);
	}
}	

function crawlURL(crawlJobData) {
    var title = crawlJobData["title"];
	var url = crawlJobData["url"];
	var crawlingFilter = crawlJobData["filter"];
	var crawlingDepth = crawlJobData["depth"];
	
	var crawlingQ;
	var storeHTCache;
	var crawlOrder;
	var xdstopw;
	if (crawlJobData["crawlingQ"]) crawlingQ = "on"
	else crawlingQ = "off";
	if (crawlJobData["storeHTCache"]) storeHTCache = "on"
	else storeHTCache = "off";
	if (crawlJobData["crawlOrder"]) crawlOrder = "on"
	else crawlOrder = "off";
	if (crawlJobData["xdstopw"]) xdstopw = "on"
	else xdstopw = "off";	
	
	if(url != null && url != ""){
    
		req = false;
	    // branch for native XMLHttpRequest object
	    if(window.XMLHttpRequest) {
	    	try {
				req = new XMLHttpRequest();
	            if (req.overrideMimeType) {
	                req.overrideMimeType('text/xml');
	            }				
	        } catch(e) {
				req = false;
	        }
	    }
	
		if(req) {
			// loading username + pwd
			var userPwd = loadUserPwd();
			var httpURL = getBaseURL() + 
						 '/QuickCrawlLink_p.xml' +
						 '?crawlingFilter=' + escape(crawlJobData["filter"]) +
 						 '&crawlingDepth=' + crawlingDepth + 
						 '&crawlingQ=' + crawlingQ + 
						 '&storeHTCache=' + storeHTCache +
						 '&localIndexing=on' +
						 '&crawlOrder=' + crawlOrder +
						 '&xdstopw=' + xdstopw +
						 '&title='+ escape(title)+
						 '&url='+ escape(url)
		
			req.onreadystatechange = crawlReceipt;
			req.open("GET", httpURL, true, userPwd["user"], userPwd["pwd"]);
			req.send(null);
		} else {
	        alert('Unable to create a XMLHTTP instance.');
		}
	
	
//		window.open(getBaseURL() + '/QuickCrawlLink_p.html?localIndexing=on&crawlingQ=on&crawlingDepth=' + crawlingDepth + '&xdstopw=on&title='+escape(title)+'&url='+ escape(url),'_blank','height=150,width=500,resizable=yes,scrollbar=no,directory=no,menubar=no,location=no');
	}
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
            alert("ERROR: There was a problem retrieving the XML data:\n" + req.status + "\n" + req.statusText);
        }        
	} 
}


