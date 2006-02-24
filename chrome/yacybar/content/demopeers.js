var peers;
var index;
var mainWindow
function init(){
		mainWindow=window.arguments[0]
		var demoPeersURL=Branch.getCharPref("demoPeersURL");
		req=new XMLHttpRequest();
		req.open("GET", demoPeersURL, false);
		req.send(null);
		response=req.responseXML;
		peers=response.getElementsByTagName("peer");
		list=document.getElementById("demopeerList");
		for(i=0;i<peers.length;i++){
			item=document.createElement("listitem");
			item.setAttribute("label", peers[i].getAttribute("name"));
			item.setAttribute("value", peers[i].getAttribute(i));
			list.appendChild(item);
		}
		list.selectedIndex=Math.floor(Math.random()*peers.length);
		selectDemopeer();
}
function selectDemopeer(){
	list=document.getElementById("demopeerList");
	index=list.selectedIndex;
}
function accept(){
	if(index>=0){
		Branch.setBoolPref("demomode",true);
		Branch.setCharPref("demoAddress", peers[index].getElementsByTagName("address")[0].getAttribute("host"));
		Branch.setIntPref("demoPort", parseInt(peers[index].getElementsByTagName("address")[0].getAttribute("port")));
	}
	
	mainWindow.getElementById("menuitem-addbookmark").setAttribute("disabled", true);
	mainWindow.getElementById("cmd_toggleProxy").setAttribute("disabled", true);
	mainWindow.getElementById("cmd_toggleIndexing").setAttribute("disabled", true);
	mainWindow.getElementById("BlacklistBtn").setAttribute("disabled", true);
}
function cancel(){
	mainWindow.getElementById("menuitem-demo").setAttribute("checked", false);
}
