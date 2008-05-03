/* Some useful docs, this is based on:
 * http://developer.mozilla.org/en/docs/How_to_Build_an_XPCOM_Component_in_Javascript 
 * http://developer.mozilla.org/en/docs/nsIDynamicContainer
 * http://mxr.mozilla.org/mozilla/source/toolkit/components/places/tests/unit/test_dynamic_containers.js
 * http://mxr.mozilla.org/mozilla/source/toolkit/components/places/tests/unit/nsDynamicContainerServiceSample.js
 * */


const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

function YaCyBookmarkService() {
}

YaCyBookmarkService.prototype = {

	get bms() {
		if (!this._bms)
			this._bms = Cc[BMS_CONTRACTID].getService(Ci.nsINavBookmarksService);
		return this._bms;
	},

	get history() {
		if (!this._history)
			this._history = Cc[NH_CONTRACTID].getService(Ci.nsINavHistoryService);
		return this._history;
	},

	// IO Service
	get ios() {
		if (!this._ios)
			this._ios = Cc["@mozilla.org/network/io-service;1"].
					getService(Ci.nsIIOService);
		return this._ios;
	},

	// nsIDynamicContainer
	onContainerRemoving: function(container) {
	},

	onContainerMoved: function() {
	},

	onContainerNodeOpening: function(aContainer, aOptions) {
		// import here, because resource is not yet available when loading this component
		Cu.import("resource://yacybar/functions.jsm");

		if(aContainer.childCount == 0) {
			try {
				var req = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
				var url = yacyFunctions.getBaseURL() + "/xml/bookmarks/xbel/xbel.xml?login=true";
				var userPwd = yacyFunctions.loadUserPwd();
				req.open('GET', url, false, userPwd["user"], userPwd["pwd"]);
				req.send(null);
				var xml = req.responseXML;
				var bookmarks = xml.getElementsByTagName("bookmark");
				for(var i=0; i<bookmarks.length; i++) {
					var bookmark = bookmarks[i];
					var url = bookmark.getAttribute("href");
					var title = bookmark.getElementsByTagName("title")[0].firstChild.nodeValue;
					aContainer.appendURINode(url, title, 0, 0, null);
				}
			} catch(e) {
				yacyFunctions.log(e);
			}
		}
	},

	onContainerNodeClosed: function() {
	},

	createInstance: function LS_createInstance(outer, iid) {
		if (outer != null)
			throw Cr.NS_ERROR_NO_AGGREGATION;
		return this.QueryInterface(iid);
	},

	classDescription: "YaCyBar Bookmark Service",
	contractID: "@yacy.net/YaCyBookmarkService;1",
	classID: Components.ID("{802acce1-83cc-48b0-8e1b-2d861def417f}"),
	QueryInterface: XPCOMUtils.generateQI([Ci.nsIDynamicContainer]),
};

function NSGetModule(compMgr, fileSpec) {
	return XPCOMUtils.generateModule([YaCyBookmarkService]);
}
