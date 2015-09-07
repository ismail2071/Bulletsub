
/**
* 1.0.27
* open tab for auth facebook 
* reference https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/v2.4#token
*/
//console.dir(localStorage.accessToken);
//if(!localStorage.accessToken){

// new tab id
//var authTabId; 
 // facebook app url
//var url = 'https://www.facebook.com/dialog/oauth?client_id=496825830382069&response_type=token&scope=email&redirect_uri=http://www.facebook.com/connect/login_success.html';

// create new tab for fb auth
//chrome.tabs.create({url: url, selected: true}, function(tab){
//authTabId = tab.id;
//});

// monitoring tab
//chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
// if status == complete, get the return url token
/*
if (tabId == authTabId && changeInfo.status == 'complete' && tab.url.indexOf(url)) {

  var params = tab.url.split('#')[1];
  access = params.split('&')[0]
  console.log("access:"+access);
  localStorage.accessToken = access;

// close login tab
  chrome.tabs.remove(authTabId);
  return;

}
});


}
*/
// Set up context menu at install time.
/*
chrome.runtime.onInstalled.addListener(function() {
    var context = "all";
    var title = "Twideo";
    var id = chrome.contextMenus.create({
        "type": normal,
        "title": title,
        "contexts": [context],
        "id": "context" + context
    },function () {
    console.log('contextMenus are create.');
  });

    var child1 = chrome.contextMenus.create({
        "title": "Open Twideo Window",
        "parentId": id,
        "onclick": openInputBox,
        "contexts": [context]
    });


});*/


// The onClicked callback function.
function openInputBox(info, tab) {

  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});  
});
};


// Create one test item for each context type.

var contexts = ["page"];

  var context = contexts[0];
  var title = "Test '" + context + "' menu item";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                       "onclick": openInputBox});
  console.log("'" + context + "' item:" + id);

// add click event
//chrome.contextMenus.onClicked.addListener(onClickHandler);





/*1.0.28*/


chrome.runtime.onConnect.addListener(function(port) {
console.log(port.name);

  if (port.name == "needFuckingToken"){
    port.onMessage.addListener(function(request) {
          console.log("get db danmu start");
          console.log(request.comment);

        $.getJSON( "http://ec2-52-26-184-134.us-west-2.compute.amazonaws.com:3000/getDanmu", {"Url":request.comment} )
        .done(
        function( data ) {
            console.log("data:");
            console.dir(data);
            port.postMessage({answer:data});
        })
        .fail(function( jqxhr, textStatus, error ) {
          var err = textStatus + ", " + error;
          console.log( "Request Failed: " + err );
        });
    


    });
  }


});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.doyourjob == "needFuckingSend"){

      var postdata = {'Url':request.Url,comment:request.comment,'service':'BulletSub'};
      console.dir(postdata);
      $.post( "http://ec2-52-26-184-134.us-west-2.compute.amazonaws.com:3000/putDanmu",postdata, "json");

    }

      /**
      Google Chrome extension onMessage Document

      Function to call (at most once) when you have a response. The argument should be any JSON-ifiable object. 
      !! If you have more than one onMessage listener in the same document, then only one may send a response. 
      This function becomes invalid when the event listener returns, 
      unless you ***return true*** from the event listener to indicate you wish to send a response asynchronously 
      (this will keep the message channel open to the other end until sendResponse is called).
    
      **/
     return true; //Important
  });

