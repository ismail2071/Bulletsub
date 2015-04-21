$(function() {
  
var rect={};
rect = getVideoPos();
document.body.addEventListener('click', function(){  
  console.log("clicked!!");
  rect = getVideoPos();
}); 


$("body").prepend("<div id=\"danmu\" </div>");
  

 console.log("Danmu Start");
 var a_danmu = {
    "text" : "豆喔!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    "color" : "red",
    "size" : "1",
    "position" : "0",
    "time" : 1,
    "isnew" : " "
  };
 
 console.log("Danmu init.");
 console.dir(rect);
 console.log("top:" + rect.top + " left:" + rect.left);

 $("#danmu").danmu({
  left:rect.left,
  top:rect.top,
  height:rect.height,
  width:rect.width+100,
    speed:30000,
    opacity:1,
    font_size_small:16,
    font_size_big:24,
      top_botton_danmu_time:6000
}
  );
  
  $('#danmu').danmu('danmu_resume');
  $('#danmu').danmu("add_danmu",a_danmu); 
  
  console.log("Danmu Finish");
 });


  function getVideoPos(){


/////// youtube
var rect={};
var video = $("video");

if(video.length==1){
  rect.left= video.offset().left;
  rect.top= video.offset().top;
  rect.height=video.height();
  rect.width=video.width();
}

else
  rect=getVideoObjectCase();


chrome.runtime.sendMessage(rect);
return rect;

}


function getVideoObjectCase() {
  console.log("not video element");
  var node_list = $("object");

    var videoNode = [];
 
    for (var i = 0; i < node_list.length; i++) {
        var node = node_list[i];
 
        if (node.getAttribute('type') == 'application/x-shockwave-flash') 
            videoNode.push(node);       
    } 

  var rect = videoNode[0].getBoundingClientRect();
  console.dir(rect);

    return rect;
}  
