var baseURL  = "http://localhost:8080";
var gBrowser = document.getElementById("content");

function search(){
	var searchwords=document.getElementById("search").value;
	// alert(searchwords);
	loadOneOrMoreURIs(baseURL + "/index.html?search="+searchwords);
}

function blacklistpage(){
	var url=window.content.prompt("Blacklist URL:", window._content.location);
	if(url != null && url != ""){
		gBrowser.addTab(baseURL + "/Blacklist_p.html?addbutton=addbutton&filename=default.black&newItem="+url);
	}
}	

function crawlpage() {
    var url = window.content.prompt("Index URL:", window._content.location);
	if(url != null && url != ""){
		window.open(baseURL + '/QuickCrawlLink_p.html?localIndexing=on&crawlingQ=on&xdstopw=on&title='+escape(document.title)+'&url='+url,'_blank','height=150,width=500,resizable=yes,scrollbar=no,directory=no,menubar=no,location=no');
	}
}
	
function showAbout() {
	window.openDialog("chrome://yacybar/content/about.xul","switchProxyAbout","centerscreen, chrome, modal");
}	

function loadURL(newURL) {
	window._content.document.location = newURL;
	window.content.focus();
}
