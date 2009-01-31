/*
 * Detect version for YaCy
 *
 * The YaCyBar should be compatible with the current stable *and* the current version from SVN.
 * Compatiblity hacks for older version should be removed, when the next release of YaCy is out.
 *
 * (c) 2009 by Florian Richter
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 * */

var Cc = Components.classes;
var Ci = Components.interfaces;
var cons = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);

var yacyVersion = {
	/**
	 * Detects Revision number,
	 * call when settings are changed
	 */
	detectVersion : function() {
		//cons.logStringMessage("detect ");
		var url = getBaseURL() + '/xml/version.xml';

		this.request = new XMLHttpRequest();
		if (this.request.overrideMimeType) {
			this.request.overrideMimeType('text/xml');
		}
		this.request.onreadystatechange = this.loadVersionHandler;
		this.request.open("GET", url, true);
		this.request.send(null);
	},

	loadVersionHandler : function() {
		if (yacyVersion.request.readyState == 4) {
			if("status" in yacyVersion.request && yacyVersion.request.status == 200) {
				var xmlobject = yacyVersion.request.responseXML;
				var element = xmlobject.getElementsByTagName("svnRevision")[0];
				Branch.setIntPref("svnRevision", element.firstChild.data);
			} else {
				Branch.setIntPref("svnRevision", 0);
			}
		}
	},


	/**
	 * returns yacy revision number 
	 */
	getYacyVersion : function() {
		return Branch.getIntPref("svnRevision", 0);
	},

	/**
	 * detect API directory
	 */
	getAPIDir : function() {
		var revision = this.getYacyVersion();
		//cons.logStringMessage("return version " + revision);
		if(revision != 0 && revision >= 5497) {
			return "/api";
		} else {
			return "/xml";
		}
	}

};
