var req=new XMLHttpRequest();
var Branch = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.yacybar.");

function getBaseURL() {
	var host=Branch.getCharPref("peerAddress");
	var port=Branch.getIntPref("peerPort");
	var baseURL  = "http://" + host + ":" + port;	
	return baseURL;
}

function init(){
	var url=window.arguments[0];
	var title=window.arguments[1];
	document.getElementById("url").value=url;
	document.getElementById("title").value=title;
	if(url!="" && title!=""){
		document.getElementById("tags").focus();
	}else if(url==""){
		document.getElementById("url").focus();
	}else{
		document.getElementById("title").focus();
	}
}

function add(){
	var url=document.getElementById("url").value;
	var title=document.getElementById("url").value;
	description=document.getElementById("url").value;
	tags=document.getElementById("url").value;
	if(url==""){
		alert("Please enter an URL");
	}else if(title==""){
		alert("Please enter a title");
	}
	//req.open('get', getBaseURL()+"/xml/bookmarks/posts/add_p.xml?");
	//TODO: This needs the not exisiting backend
}
