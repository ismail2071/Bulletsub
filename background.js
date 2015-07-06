// Set up context menu at install time.
chrome.runtime.onInstalled.addListener(function() {
  var context = "all";
  var title = "DanMu GO!";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});  
										 
var child1 = chrome.contextMenus.create({"title": "開啟彈幕視窗", "parentId": id, "onclick": openInputBox, "contexts": [context]});
var child2 = chrome.contextMenus.create({"title": "開啟彈幕", "parentId": id, "onclick": onClickHandler, "contexts": [context]});									 
var child3 = chrome.contextMenus.create({"title": "關閉彈幕", "parentId": id, "onclick": onClickHandler, "contexts": [context]});									 
										 
});

// add click event
//chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function openInputBox(info, tab) {
  
 console.dir(info);
  alert("21 "+tab.id);
  chrome.tabs.sendMessage(tab.id, {open: true}, function(response) {
  });
};


function onClickHandler(info, tab) {
  /*var sText = info.selectionText;
  var url = "https://www.google.com/search?q=" + encodeURIComponent(sText);  
  window.open(url, '_blank');*/
 console.dir(info);
  alert("22 "+tab.id);
  chrome.tabs.sendMessage(tab.id, {open: "danmu"}, function(response) {
  });
};


/*chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   if(changeInfo && changeInfo.status == "complete"){
		chrome.tabs.executeScript(tabId, {file: "content_script.js"});
		
   }
   
}); */


