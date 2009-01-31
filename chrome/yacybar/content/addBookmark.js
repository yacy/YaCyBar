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
	log(getBaseURL() + yacyVersion.getAPIDir() + "/util/geturlinfo_p.xml?url="+url+"\n");
	req = new XMLHttpRequest();
	req.open('GET', getBaseURL() + yacyVersion.getAPIDir() + "/util/getpageinfo_p.xml?url="+url, false, userPwd["user"], userPwd["pwd"]);
	req.send(null);
	var xml=req.responseXML;
	var tags=xml.getElementsByTagName("tag");
	var tags_field=document.getElementById("tags");
	for(var i=0; i<tags.length - 1; i++){
		//log(tags[i].value); //DEBUG
		tags_field.value=tags_field.value+tags[i].getAttribute("name")+",";
	}
	tags_field.value=tags_field.value+tags[tags.length -1].getAttribute("name");
}

function addBookmark(){
	var url=document.getElementById("url").value;
	var title=document.getElementById("title").value;
	var description=document.getElementById("description").value;
	var path=document.getElementById("path").value;
	var tags=document.getElementById("tags").value;
	var isPublic=document.getElementById("ispublic").getAttribute("selected");
	var public_str="private";
	var stringBundle = document.getElementById("yacybar-string-bundle");
	if(isPublic){
		public_str="public";
	}
	if(url=="" && title==""){
		alert(stringBundle.getString("yacybar_enterboth"));
	}else if(url==""){
		alert(stringBundle.getString("yacybar_enterurl"));
	}else if(title==""){
		alert(stringBundle.getString("yacybar_entertitle"));
	}
	
	
	rqurl = getBaseURL() + yacyVersion.getAPIDir() + "/bookmarks/posts/add_p.xml?url=" + encodeURIComponent(url)
			+ "&title=" + encodeURIComponent(title)
			+ "&description=" + encodeURIComponent(description)
			+ "&path=" + encodeURIComponent(path)
			+ "&tags=" + encodeURIComponent(tags)
			+ "&public=" + public_str;
	req=new XMLHttpRequest();
	req.open('GET', rqurl, false, userPwd["user"], userPwd["pwd"]);
	req.send(null);
}
