var gBrowser = document.getElementById("content");

var cons = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);

var req;
var demoPeers = Array();

window.addEventListener("load", init, false);
window.addEventListener("focus",focusChanged,true);

function init(){
	cons.logStringMessage("Init yacybar");

	/* ================================================================
		Preferences initialization for first run of yacybar 
	   ================================================================ */
	// init quickCrawl settings
	if (!Branch.prefHasUserValue("QuickCrawl.showQuickCrawlDialog")) {
		var crawlJobData = Array();
		initQuickCrawlPrefs(crawlJobData);
		saveQuickCrawlPrefs(crawlJobData);	
	}
	
	//disable demomode
	if(!Branch.prefHasUserValue("demomode")){ /*we misuse this as firststart indicator*/
		showFirststartDialog();
	}
	Branch.setBoolPref("demomode", false);
	
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
	if (!Branch.prefHasUserValue("demoPeersURL")) {
	Branch.setCharPref("demoPeersURL", "http://www.daburna.de/download/demopeers.xml"); 
	// old URL outdated - new one just a placeholder TODO
	}
	
	
	// init proxy control buttion
	if (!Branch.prefHasUserValue("proxyControl")) {
		if(prefManager.getIntPref("network.proxy.type")==2 && prefManager.getCharPref("network.proxy.autoconfig_url")==(getBaseURL()+"/autoconfig.pac")){
			Branch.setBoolPref("proxyControl",true);
		} else {
			Branch.setBoolPref("proxyControl",false);
		}
	}	
	
	// init search settings
	if (!Branch.prefHasUserValue("search.content"))       Branch.setCharPref("search.content","text");
	if (!Branch.prefHasUserValue("search.maxResults"))    Branch.setIntPref("search.maxResults",10);
	if (!Branch.prefHasUserValue("search.resource"))      Branch.setCharPref("search.resource","global");
	if (!Branch.prefHasUserValue("search.maxSearchTime")) Branch.setIntPref("search.maxSearchTime",6);
	if (!Branch.prefHasUserValue("search.urlMaskFilter")) Branch.setCharPref("search.urlMaskFilter",".*");

	// init peer monitoring settings
	if (!Branch.prefHasUserValue("peerMonitoring.enabled")) Branch.setBoolPref("peerMonitoring.enabled",false);
	if (!Branch.prefHasUserValue("peerMonitoring.refreshRate")) Branch.setIntPref("peerMonitoring.refreshRate",30000);
	if (!Branch.prefHasUserValue("peerMonitoring.showQPH")) Branch.setBoolPref("peerMonitoring.showQPH",false);
	if (!Branch.prefHasUserValue("peerMonitoring.showPPM")) Branch.setBoolPref("peerMonitoring.showPPM",false);
	if (!Branch.prefHasUserValue("peerMonitoring.showURL")) Branch.setBoolPref("peerMonitoring.showURL",false);	
	if (!Branch.prefHasUserValue("peerMonitoring.showRWI")) Branch.setBoolPref("peerMonitoring.showRWI",false);
	if (!Branch.prefHasUserValue("peerMonitoring.showPeerType")) Branch.setBoolPref("peerMonitoring.showPeerType",false);
	
	/* ================================================================
		Button initialization 
	   ================================================================ */
	// initialize proxy btn
	setProxyControlBtn(Branch.getBoolPref("proxyControl"));
	
	// initialize indexing btn
	setIndexControlBtn(Branch.getBoolPref("indexControl"));
	
}

function search(samewindow){
	var searchwords=document.getElementById("search").value;
	var url=getSearchURL(searchwords);
	if(samewindow){
		window._content.document.location = url;
		window.content.focus();
	}else{
		gBrowser.addTab(url);
	}
}

function searchSelected() {
	var selText = gContextMenu.searchSelected();
	if (selText != null && selText != "") {
		var searchTextBox=document.getElementById("search");
		searchTextBox.value = selText;
		var url=searchKeyword(selText);
		window._content.document.location = url;
		window.content.focus();
	}
}

function getSearchURL(keyword) {
	// alert(searchwords);
	
	var content = Branch.getCharPref("search.content");
	var maxResults = Branch.getIntPref("search.maxResults");
	var resource = Branch.getCharPref("search.resource");
	var maxSearchTime = Branch.getIntPref("search.maxSearchTime");
	var urlMask = Branch.getCharPref("search.urlMaskFilter");
	var stringBundle = document.getElementById("yacybar-string-bundle");
	if (urlMask == "") urlMask = ".*";
   if (content == stringBundle.getString("yacybar_content_text")) content = "text";	
   if (content == stringBundle.getString("yacybar_content_image")) content = "image";
   if (content == stringBundle.getString("yacybar_content_audio")) content = "audio";
   if (content == stringBundle.getString("yacybar_content_video")) content = "video";
   if (content == stringBundle.getString("yacybar_content_app")) content = "app";		
	
	return getBaseURL() + 
	"/yacysearch.html" + 
	"?search=" + keyword + 
	"&contentdom=" + content +
	"&count=" + maxResults +  
	"&resource=" + resource + 
	"&time=" + maxSearchTime + 
	"&urlmaskfilter=" + urlMask;	
}


function loadYACY(){
	window._content.document.location = getBaseURL()+"/";
	window.content.focus();
}	
function bgLoadYACY(event){
	if(event.button==1){
		gBrowser.addTab(getBaseURL()+"/");
	}
}	
function blacklistpage(){
	var url=window.content.prompt("Blacklist URL:", window._content.location);
	if(url != null && url != ""){
		gBrowser.addTab(getBaseURL() + "/Blacklist_p.html?addBlacklistEntry=&currentBlacklist=default.black&newEntry="+url);
	}
}	

function crawlpage() {
    var url = window._content.location;
    var title = document.title;
	if(!Branch.getBoolPref("demomode")){
		showQuickCrawlDialog(url,title);
	}else{
		loadURL("http://www.yacy-websuche.de/democrawl.php?url="+escape(url)+"&title="+escape(title));
	}
}

function crawllink() {
	var url = gContextMenu.link;
	var title = gContextMenu.linkText();
	showQuickCrawlDialog(url,title); 
}
			
function showAbout() {
	window.openDialog("chrome://yacybar/content/about.xul","yacybarAbout","centerscreen, chrome, modal");
}	

function showCrawlJobs() {
	window.openDialog("chrome://yacybar/content/sidebarOverlay.xul","yacybarCrawlJobs", "chrome,centerscreen,resizable");
}	

function showPrefs() {
	window.openDialog("chrome://yacybar/content/prefs.xul","yacybarPrefs","centerscreen, chrome, modal");
}	

function loadURL(newURL) {
	// gBrowser.addTab(newURL);
	window._content.document.location = newURL;
	window.content.focus();
}
function bgLoadUrl(newURL, event){
	if(event.button==1){
		gBrowser.addTab(newURL);
	}
}

function setIndexControlBtn(checked) {
	// setting the gui elements accordingly
	var tooltipText;
	var stringBundle = document.getElementById("yacybar-string-bundle");
	if (checked) tooltipText = stringBundle.getString("yacybar_indexingon");
	else tooltipText = stringBundle.getString("yacybar_indexingoff");
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
	var stringBundle = document.getElementById("yacybar-string-bundle");
	if (checked) tooltipText = stringBundle.getString("yacybar_proxyon");
	else tooltipText = stringBundle.getString("yacybar_proxyoff");
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
			newJob["date"] = new Date();
			newJob["title"] = response.getElementsByTagName("title")[0].firstChild.data;
			newJob["link"] = response.getElementsByTagName("url")[0].firstChild.data;
			newJob["status"] = response.getElementsByTagName("status")[0].firstChild.data.trim();
			newJob["statusCode"] = response.getElementsByTagName("status")[0].getAttribute("code");

			window.openDialog("chrome://yacybar/content/sidebarOverlay.xul","yacybarCrawlJobs", "chrome,centerscreen,resizable",newJob);         
        } else {
            alert("ERROR: There was a problem retrieving the XML data:\n" + req.status + "\n" + req.statusText);
        }        
	} 
}
function loadSurftips(event){
	if(event.target.id!="SurftipsButton"){return};
	
	if(window.XMLHttpRequest){
		try{
			req=new XMLHttpRequest();
			if(req.overrideMimeType){
				req.overrideMimeType('text/xml');
			}
		}catch(e){
			req=false;
		}
		if(req!=false){
			req.onreadystatechange=loadSurftipsHandler;
			req.open("GET", getBaseURL()+"/Surftips.rss", true);
			req.send(null);
		}
	}
}
function loadTags(event){
	//only in tagsMenu
	if(event.target.id!="BookmarksButton"){
		return;
	}
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
	if(req){
		req.onreadystatechange = loadTagsHandler;
		if(Branch.getBoolPref("demomode")){
			req.open("GET", getBaseURL()+"/xml/bookmarks/tags/get.xml", true);
		}else{
			var userPwd = loadUserPwd();
			req.open("GET", getBaseURL()+"/xml/bookmarks/tags/get.xml", true, userPwd["user"], userPwd["pwd"]);
		}
		req.send(null);
	}
}
function loadSurftipsHandler(){
	if(req.readyState==4 && req.status==200){
		surftipsMenu=document.getElementById("SurftipsMenu");
		item=surftipsMenu.firstChild;
		while(item!=null){
			surftipsMenu.removeChild(item);
			item=surftipsMenu.firstChild;
		}
		var response=req.responseXML;
		items=response.getElementsByTagName("item");
		for(i=0;i<items.length;i++){
			item=document.createElement("menuitem");
			item.setAttribute("label", items[i].getElementsByTagName("title")[0].firstChild.nodeValue);
			item.setAttribute("onclick", "loadURL(\""+items[i].getElementsByTagName("link")[0].firstChild.nodeValue+"\")");
			item.setAttribute("title", items[i].getElementsByTagName("description")[0].firstChild.nodeValue);
			surftipsMenu.appendChild(item);

		}
	}
}
function loadTagsHandler(){
	if (req.readyState == 4) {
        if (req.status == 200) {
			bmMenu=document.getElementById("BookmarksMenu");
			item=bmMenu.firstChild.nextSibling.nextSibling;
			while(item!=null){
				bmMenu.removeChild(item);
				item=bmMenu.firstChild.nextSibling.nextSibling;
			}
			var response = req.responseXML;
			tags=response.getElementsByTagName("tag");
			for(i=0;i<tags.length;i++){
				menu=document.createElement("menu");
				menupopup=document.createElement("menupopup");
				menu.setAttribute("type", "menu");
				menu.setAttribute("label", tags[i].getAttribute("tag"));
				menu.setAttribute("onmouseover", "loadBookmarks(\""+tags[i].getAttribute("tag")+"\", event)");
				menupopup.setAttribute("id", "TagMenu-"+tags[i].getAttribute("tag"));
				menu.appendChild(menupopup);
				bmMenu.appendChild(menu);
			}
		}
	}
}
function loadBookmarks(tag, event){
	if(event.target.firstChild.id!="TagMenu-"+tag){
		return;
	}
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
	if(req){
		req.onreadystatechange = loadBookmarksHandler;
		req.tag=tag
		if(Branch.getBoolPref("demomode")){
			req.open("GET", getBaseURL()+"/xml/bookmarks/posts/all.xml?tag="+tag, true);
		}else{
			var userPwd = loadUserPwd();
			//TODO: Get this working with password. 
			req.open("GET", getBaseURL()+"/xml/bookmarks/posts/all.xml?tag="+tag, true, userPwd["user"], userPwd["pwd"]);
		}
		req.send(null);
	}
}
function loadBookmarksHandler(){
	if (req.readyState == 4) {
        if (req.status == 200) {
			tagMenu=document.getElementById("TagMenu-"+req.tag);
			item=tagMenu.firstChild;
			while(item!=null){
				tagMenu.removeChild(item);
				item=tagMenu.firstChild;
			}

			var response=req.responseXML;
			posts=response.getElementsByTagName("post");
			for(i=0;i<posts.length;i++){
				item=document.createElement("menuitem");
				item.setAttribute("label", posts[i].getAttribute("description"));
				item.setAttribute("onclick", "loadURL(\""+posts[i].getAttribute("href")+"\")");
				item.setAttribute("title", posts[i].getAttribute("extended"));
				tagMenu.appendChild(item);
			}
		}
	}
}
function showAddBookmark(){
	window.openDialog("chrome://yacybar/content/addBookmark.xul","yacybarAddBookmark","centerscreen, chrome, modal", window.content.document.location.href, window.content.document.title);
}

function toggleDemo(){
	demomenu=document.getElementById("menuitem-demo");
	if(demomenu.getAttribute("checked")){
		window.openDialog("chrome://yacybar/content/demopeers.xul", "demopeerDialog", "centerscreen, chrome, modal", document);
	}else{
		document.getElementById("menuitem-addbookmark").setAttribute("disabled", false);
		document.getElementById("cmd_toggleProxy").setAttribute("disabled", false);
		document.getElementById("cmd_toggleIndexing").setAttribute("disabled", false);
		document.getElementById("BlacklistBtn").setAttribute("disabled", false);
		Branch.setBoolPref("demomode", false);
	}
}
function showFirststartDialog(){
	window.openDialog("chrome://yacybar/content/firststart.xul", "firststartDialog", "centerscreen, chrome", this);
}
