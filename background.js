
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
chrome.runtime.onInstalled.addListener(function() {
    var context = "all";
    var title = "DanMu GO!";
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": [context],
        "id": "context" + context
    });

    var child1 = chrome.contextMenus.create({
        "title": "Open DanMu Window",
        "parentId": id,
        "onclick": openInputBox,
        "contexts": [context]
    });
    var child2 = chrome.contextMenus.create({
        "title": "Open DanMu",
        "parentId": id,
        "onclick": onClickHandler,
        "contexts": [context]
    });
    var child3 = chrome.contextMenus.create({
        "title": "Close DanMu",
        "parentId": id,
        "onclick": onClickHandler,
        "contexts": [context]
    });

});

// add click event
//chrome.contextMenus.onClicked.addListener(onClickHandler);

// The onClicked callback function.
function openInputBox(info, tab) {
    chrome.tabs.sendMessage(tab.id, "fuck", {}, function(response) {
        console.log(response)
    });
};


function onClickHandler(info, tab) {
    /*var sText = info.selectionText;
    var url = "https://www.google.com/search?q=" + encodeURIComponent(sText);  
    window.open(url, '_blank');*/
    console.dir(info);
    alert("22 " + tab.id);
    chrome.tabs.sendMessage(tab.id, {
        open: "danmu"
    }, function(response) {});
};


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

