function toggleDemo(){
	win=window.arguments[0]
	alert("On next start of firefox you need to reenable the Demomode. You can find it then in the YaCy-Menu.");
	window.openDialog("chrome://yacybar/content/demopeers.xul", "demopeerDialog", "centerscreen, chrome, modal", win.document);
	window.close();
}
function downloadYacy(){
	window.open('http://www.yacy.net/');
	window.close();
}
function showPref(){
	window.arguments[0].openPreferences('YaCyBarPrefsPane');
	window.close();
}
