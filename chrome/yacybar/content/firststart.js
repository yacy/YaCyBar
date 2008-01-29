function toggleDemo(){
	win=window.arguments[0]
	var stringBundle = document.getElementById("yacybar-string-bundle");
	alert(stringBundle.getString("yacybar_nextstart"));
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
