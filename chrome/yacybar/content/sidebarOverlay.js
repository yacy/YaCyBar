var Cc = Components.classes;
var Ci = Components.interfaces;
var cons = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);

function CrawlingData() {
  this.init();
}

CrawlingData.prototype = {
  config_file : "yacybar_crawljobs.rdf",
  datasource : null,
  predicates : new Array("date","title","link","status","statusCode"),	  
  
  getFileHandler : function(fileName) {	
  	var fdir, file;	
	with (window) {
	  fdir = Cc["@mozilla.org/file/directory_service;1"];
	  fdir = fdir.getService(Ci.nsIProperties);
	}
	
	file = fdir.get("ProfD", Ci.nsIFile);
	//cons.logStringMessage("Profile directory is here: " + file.path );
	file.append(this.config_file);
	
	return file;	
  },
  init : function (otherfile) {
  
    cons.logStringMessage("Init crawlingdata object");
	var conv, rdf, file, url;

	if (otherfile) this.config_file = otherfile;

	with (window) {
	  conv = Cc["@mozilla.org/network/protocol;1?name=file"];
	  conv = conv.createInstance(Ci.nsIFileProtocolHandler);

	  rdf  = Cc["@mozilla.org/rdf/rdf-service;1"];
	  rdf  = rdf.getService(Ci.nsIRDFService);
	}

	file = this.getFileHandler(this.config_file);
	cons.logStringMessage("Profile directory is here: " + file.path );

	if (!file.exists()) {
		// creating a new file
		file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420);

		// initializing rdf structure
		this.initFile(conv.newFileURI(file));
	}

	if (!file.isFile() || !file.isWritable() || !file.isReadable())
	  throw this.config_file + " has type or permission problems";

	url  = conv.newFileURI(file);
	this.datasource = rdf.GetDataSourceBlocking(url.spec);
  },
  initFile : function(url) {
	cons.logStringMessage("Initializing file " + url);
  
  	// trying to create a new file		
	var RDF = Components.classes['@mozilla.org/rdf/rdf-service;1'].getService();
		RDF = RDF.QueryInterface(Components.interfaces.nsIRDFService);

	var RDFC = Components.classes['@mozilla.org/rdf/container;1'].getService();
		RDFC = RDFC.QueryInterface(Components.interfaces.nsIRDFContainer);

	var RDFCUtils = Components.classes['@mozilla.org/rdf/container-utils;1'].getService();
		RDFCUtils =  RDFCUtils.QueryInterface(Components.interfaces.nsIRDFContainerUtils);  	
  	
  	cons.logStringMessage("Opening file " + url + " as datasource");
	var ds = RDF.GetDataSourceBlocking(url.spec);
  		ds = ds.QueryInterface(Components.interfaces.nsIRDFDataSource);

	// create our root nodes
	cons.logStringMessage("Init root node");
	var rootNode =  RDF.GetResource("urn:yacybar:quickCrawl:root");
	cons.logStringMessage("Init seq node");
	var seqNode =  RDF.GetResource("urn:yacybar:quickCrawl:jobs");
	
	// insert the "top" of the tree, a Seq container
	cons.logStringMessage("Adding root node");
	ds.Assert(rootNode,
		 RDF.GetResource("http://www.yacy-websuche.de/yacybar-quickCrawl-rdf#CrawlJobs"),
		 seqNode, true);	
		 
	cons.logStringMessage("Generate sequence");
	RDFCUtils.MakeSeq(ds, seqNode);
	RDFC.Init(ds, seqNode);
	
	cons.logStringMessage("Flush");
	ds.QueryInterface(Ci.nsIRDFRemoteDataSource).Flush();
  },
  deleteData: function() {    	
  
  		cons.logStringMessage("DELETE: create rdf service");
		var RDF = Components.classes['@mozilla.org/rdf/rdf-service;1'].getService();
			RDF = RDF.QueryInterface(Components.interfaces.nsIRDFService);  
	  
		cons.logStringMessage("DELETE: create rdf container");
	  	var RDFC = Components.classes['@mozilla.org/rdf/container;1'].getService();
			RDFC = RDFC.QueryInterface(Components.interfaces.nsIRDFContainer);
	  
	  	cons.logStringMessage("DELETE: opening datasource");
		var ds = this.datasource.QueryInterface(Components.interfaces.nsIRDFDataSource);
  		
  		cons.logStringMessage("DELETE: getting job sequence");
  		var seqNode =  RDF.GetResource("urn:yacybar:quickCrawl:jobs");
  		
  		cons.logStringMessage("DELETE: init container");
  		RDFC.Init(ds, seqNode);
  		
  		var ns = "http://www.yacy-websuche.de/yacybar-quickCrawl-rdf#";
		var children = RDFC.GetElements();
		while (children.hasMoreElements()){
			var child = children.getNext();			
			if (child instanceof Components.interfaces.nsIRDFResource){			
				for (var i = 0; i < this.predicates.length; i++) {
					var predicate = RDF.GetResource(ns + this.predicates[i]);
					var object = ds.GetTarget(child,predicate, true);
					if (object != null) ds.Unassert(child,predicate,object);
				}
				RDFC.RemoveElement( child , false)
			}
			// use this to count number of times this runs.
		}
		
		cons.logStringMessage("DELETE: flush datasource");
		this.datasource.QueryInterface(Ci.nsIRDFRemoteDataSource).Flush();
  },
  addData : function(crawlJobData) {
  	if (this.datasource == null) throw "Datasource not initialized";
  	
  	var ns = "http://www.yacy-websuche.de/yacybar-quickCrawl-rdf#";
  	
  	cons.logStringMessage("Getting rdf service");
	var RDF = Components.classes['@mozilla.org/rdf/rdf-service;1'].getService();
		RDF = RDF.QueryInterface(Components.interfaces.nsIRDFService);

  	cons.logStringMessage("Getting rdf container");
	var RDFC = Components.classes['@mozilla.org/rdf/container;1'].getService();
		RDFC = RDFC.QueryInterface(Components.interfaces.nsIRDFContainer);

	cons.logStringMessage("Getting rdf container utils");
	var RDFCUtils = Components.classes['@mozilla.org/rdf/container-utils;1'].getService();
		RDFCUtils =  RDFCUtils.QueryInterface(Components.interfaces.nsIRDFContainerUtils);  	
  	
  	cons.logStringMessage("Getting datasource");
  	var ds = this.datasource.QueryInterface(Components.interfaces.nsIRDFDataSource);
  	
  	cons.logStringMessage("Getting seq node");
	var seqNode =  RDF.GetResource("urn:yacybar:quickCrawl:jobs");
	if (!RDFCUtils.IsContainer(ds,seqNode)) {
		throw "Missing <Seq> 'urn:yacybar:quickCrawl:jobs' in " + this.config_file;
		return;
	}
	
	cons.logStringMessage("Container init");
	RDFC.Init(ds, seqNode);
	
	cons.logStringMessage("Appending new element for url " + crawlJobData["url"]);
	
	var date = crawlJobData["date"];
	var newURI = "urn:yacybar:quickCrawl:job:" + date.getTime();
	RDFC.AppendElement(RDF.GetResource(newURI));
	
	cons.logStringMessage("Adding data");
	for (var i = 0; i < this.predicates.length; i++) {
		var value = crawlJobData[this.predicates[i]];
		if (value == null) throw "Missing value for property " + this.predicates[i];
		
		var predicate = RDF.GetResource(ns + this.predicates[i]);
		ds.Assert(RDF.GetResource(newURI),predicate,RDF.GetLiteral(value), true);
	}		
	/*
	ds.Assert(RDF.GetResource(newURI),RDF.GetResource(ns + "title"),RDF.GetLiteral(crawlJobData["title"]), true);
	ds.Assert(RDF.GetResource(newURI),RDF.GetResource(ns + "link"),RDF.GetLiteral(crawlJobData["url"]), true);	
	ds.Assert(RDF.GetResource(newURI),RDF.GetResource(ns + "status"),RDF.GetLiteral(crawlJobData["status"]), true);		
	ds.Assert(RDF.GetResource(newURI),RDF.GetResource(ns + "statusCode"),RDF.GetLiteral(crawlJobData["statusCode"]), true);	
	*/
	
	this.datasource.QueryInterface(Ci.nsIRDFRemoteDataSource).Flush();
  }
  
};

/* Updated on 1/12/04. */
function cleanup() {
	cons.logStringMessage("Cleanup");
	var elem = window.document.getElementById('crawlJobView');
	
	theCrawlingData.deleteData();
	
	elem.builder.rebuild();
}
	
var theCrawlingData = new CrawlingData();

window.addEventListener("load", init_handler, true);

function init_handler() {
	cons.logStringMessage("Init handler");
	var tree = window.document.getElementById('crawlJobView');
	tree.database.AddDataSource(theCrawlingData.datasource);
	tree.ref = 'urn:yacybar:quickCrawl:root';	
	
	if (window.arguments.length==1) {
		theCrawlingData.addData(window.arguments[0]);
	}
}
	
	
	