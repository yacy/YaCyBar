var gBrowser = document.getElementById("content");

function search(){
	var searchwords=document.getElementById("search").value;
	alert(searchwords);
	loadOneOrMoreURIs("http://localhost:8080/index.html?search="+searchwords);
}

function blacklistpage(){
	var url=window.content.prompt("Blacklist URL:", window._content.location);
	if(url != null && url != ""){
		gBrowser.addTab("http://localhost:8080/Blacklist_p.html?addbutton=addbutton&filename=default.black&newItem="+url);
	}
}	

function crawlpage() {
}
	
function showAbout() {
	window.openDialog("chrome://yacybar/content/about.xul","switchProxyAbout","centerscreen, chrome, modal");
}	

function loadURL(newURL) {
	window._content.document.location = newURL;
	window.content.focus();
}
