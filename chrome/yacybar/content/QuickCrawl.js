
function initQuickCrawl() {
	var crawlJobData=window.arguments[0];
	
	var crawlingTitle = crawlJobData["title"];
	if (crawlingTitle.length > 55) {
		document.getElementById('crawlingTitle').setAttribute("tooltiptext", crawlingTitle);
		crawlingTitle = crawlingTitle.substring(0, 54) + " ...";
	}
	document.getElementById('crawlingTitle').value= crawlingTitle;
	document.getElementById('crawlingStart').value=crawlJobData["url"];

	document.getElementById('crawlingFilter').value = crawlJobData["filter"];	
	document.getElementById('crawlingDepth').value = crawlJobData["depth"];
	document.getElementById('crawlingQ').checked = crawlJobData["crawlingQ"];
	document.getElementById('storeHTCache').checked = crawlJobData["storeHTCache"];
	document.getElementById('crawlOrder').checked = crawlJobData["crawlOrder"];	
	document.getElementById('xdstopw').checked = crawlJobData["xdstopw"];
	
	document.getElementById('showQuickCrawlDialog').checked = !crawlJobData["showQuickCrawlDialog"];
}

function startQuickCrawl() {
	storeQuickCrawlSettings(true);
	return true;
}

function cancelQuickCrawl() {
	storeQuickCrawlSettings(false);
	return true;
}

function storeQuickCrawlSettings(crawlIt) {
	var crawlJobData=window.arguments[0];
	crawlJobData["crawlIt"] = crawlIt;
	
	crawlJobData["url"] = document.getElementById('crawlingStart').value;
	crawlJobData["depth"] = document.getElementById('crawlingDepth').value;
	crawlJobData["filter"] = document.getElementById('crawlingFilter').value;
	crawlJobData["crawlingQ"] = document.getElementById('crawlingQ').checked;
	crawlJobData["storeHTCache"] = document.getElementById('storeHTCache').checked;	
	crawlJobData["crawlOrder"] = document.getElementById('crawlOrder').checked;	
	crawlJobData["xdstopw"] = document.getElementById('xdstopw').checked;
	
	crawlJobData["showQuickCrawlDialog"] = !document.getElementById('showQuickCrawlDialog').checked;
}

function crawlingStartChanged() {
	var stringBundle = document.getElementById("yacybar-string-bundle");
	document.getElementById('crawlingTitle').value = stringBundle.getString("yacybar_unknown");
}

