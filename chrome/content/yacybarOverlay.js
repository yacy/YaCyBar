var gBrowser = document.getElementById("content");
function search(){
	var searchwords=document.getElementById("search").value;
	alert(searchwords);
	loadOneOrMoreURIs("http://brain:18090/index.html?search="+searchwords);
}
function blacklistpage(){
	var url=window.content.prompt("Blacklist URL:", window._content.location);
	if(url != null && url != ""){
		gBrowser.addTab("http://localhost:8080/Blacklist_p.html?addbutton=addbutton&filename=default.black&newItem="+url);
	}
}
