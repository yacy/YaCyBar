
// data structure containing the last changed resources	
var crawlJobList = window.arguments[0];

var crawlJobTreeView = {
    rowCount : 20,
    getCellText : function(row,column)
    {
      if (column.id=="title") {
		return crawlJobList[row]["title"];
      } else if (column.id=="url") {
		return crawlJobList[row]["url"];
      } else if (column.id=="status") {
      	return crawlJobList[row]["status"];
      } else if (column.id=="date") {
		return crawlJobList[row]["date"];
      } else return null;
    },
    setTree: function(treebox){ this.treebox=treebox; },
    isContainer: function(row){ return false; },
    isSeparator: function(row){ return false; },
    isSorted: function(row){ return false; },
    getLevel: function(row){ return 0; },
    getImageSrc: function(row,col) { return null; },
    getRowProperties: function(row,props){},
    getCellProperties: function(row,col,props){
	   if (col.id=="status" && crawlJobList[row]["statusCode"] != "0"){
		    var aserv=Components.classes["@mozilla.org/atom-service;1"].
		              getService(Components.interfaces.nsIAtomService);
		    props.AppendElement(aserv.getAtom("error"));
	  	}
    },
    getColumnProperties: function(colid,col,props){}
};

function setCrawlJobTreeView() {
	crawlJobTreeView.rowCount = crawlJobList.length;
    document.getElementById('crawlJobTree').view=crawlJobTreeView;
}    