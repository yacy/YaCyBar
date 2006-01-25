window.addEventListener("load", initOverlay, false);

function initOverlay() {
  var menu = document.getElementById("contentAreaContextMenu");
  menu.addEventListener("popupshowing", contextPopupShowing, false);
}

function contextPopupShowing() {
  var crawlLinkItem = document.getElementById("crawlLink");  
  if(crawlLinkItem) {
  	var url = gContextMenu.link;
    crawlLinkItem.hidden = !(url != null && url != "");
  }
  
  var crawlPageItem = document.getElementById("crawlPage");
  if (crawlPageItem) {
    var url = window._content.location;
  	crawlPageItem.hidden = !(url != null && url != "");
  }
  
  var searchSelectedItem = document.getElementById("searchSelected");
  if (searchSelectedItem) {
  	searchSelectedItem.hidden = !gContextMenu.isTextSelected;
  }  
}
