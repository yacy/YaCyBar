var req;
var userPwd;

function init(){
	log("init bookmarks dialog");
	userPwd=loadUserPwd();
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
	log(getBaseURL()+"/xml/util/geturlinfo_p.xml?url="+url+"\n");
	req = new XMLHttpRequest();
	req.open('GET', getBaseURL()+"/xml/util/getpageinfo_p.xml?url="+url, false, userPwd["user"], userPwd["pwd"]);
	req.send(null);
	xml=req.responseXML;
	tags=xml.getElementsByTagName("tag");
	tags_field=document.getElementById("tags");
	for(i=0;i<tags.length - 1;i++){
		//log(tags[i].value); //DEBUG
		tags_field.value=tags_field.value+tags[i].getAttribute("name")+",";
	}
	tags_field.value=tags_field.value+tags[tags.length -1].getAttribute("name");
}

function addBookmark(){
	var url=document.getElementById("url").value;
	var title=document.getElementById("title").value;
	var description=document.getElementById("description").value;
	var tags=document.getElementById("tags").value;
	var isPublic=document.getElementById("ispublic").getAttribute("selected");
	var public="private"
	var stringBundle = document.getElementById("yacybar-string-bundle");
	if(isPublic){
		public="public";
	}
	if(url=="" && title==""){
		alert(stringBundle.getString("yacybar_enterboth"));
	}else if(url==""){
		alert(stringBundle.getString("yacybar_enterurl"));
	}else if(title==""){
		alert(stringBundle.getString("yacybar_entertitle"));
	}
	
	
	//TODO: This needs the not exisiting backend
	//TODO: Do not Change it, till a stable Release with the Backend!
	//req.open('get', getBaseURL()+"/xml/bookmarks/posts/add_p.xml?");
	rqurl=getBaseURL()+"/Bookmarks.html?url="+encodeURIComponent(url)+"&title="+encodeURIComponent(title)
	+"&description="+encodeURIComponent(description)+"&tags="+encodeURIComponent(tags)+"&public="+public+"&add=true";
	req=new XMLHttpRequest();
	req.open('GET', rqurl, false, userPwd["user"], userPwd["pwd"]);
	req.send(null);
	//log(req.readyState+"\n");
}
