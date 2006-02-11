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

function addBookmark(){
	var url=document.getElementById("url").value;
	var title=document.getElementById("title").value;
	var description=document.getElementById("description").value;
	var tags=document.getElementById("tags").value;
	var isPublic=document.getElementById("ispublic").getAttribute("selected");
	var public="private"
	if(isPublic){
		public="public";
	}
	if(url==""){
		alert("Please enter an URL");
	}else if(title==""){
		alert("Please enter a title");
	}
	
	//TODO: This needs the not exisiting backend
	//req.open('get', getBaseURL()+"/xml/bookmarks/posts/add_p.xml?");
	rqurl=getBaseURL()+"/Bookmarks_p.html?url="+encodeURIComponent(url)+"&title="+encodeURIComponent(title)
	+"&description="+encodeURIComponent(description)+"&tags="+encodeURIComponent(tags)+"&public="+public+"&add=true";
	//dump(rqurl);
	req.open('get', rqurl);
	req.onreadystatechange=addBookmarkHandler;
	req.send(null);
}
function addBookmarkHandler(){
	//this does nothing, yet.
	//waiting for the XML Backend
	dump(req.readyState);
	if(req.readyState==4){
		dump("bookmark added?\n");
	}
}
