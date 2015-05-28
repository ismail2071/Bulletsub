/**
    @version  @date   @author     @purpose
  1.0.0   2015/05/02  kusogray  init. project
  1.0.1   2015/05/02  kusogray  using firebase
  
  
 */





/**

1.0.2 2015/05/28 ismail try DOMSubtreeModified solution
1.0.3 2015/05/28 ismail   separate dialog html view
**/
var rect = {};

$("body").bind("DOMSubtreeModified", function() {

    var videoObj = $("video");
    //console.dir(videoObj);
    videoObj[0].getBoundingClientRect();
    //console.log("changed" + videoObj[0]);
    if (videoObj != undefined) {
        /*rect.left= video.offset().left;
        rect.top= video.offset().top;
        rect.height=video.height();
        rect.width=video.width();*/
        rect = videoObj[0].getBoundingClientRect();
        //console.dir(rect);
    } else
        return;

});




$(function() {


    //rect = getVideoPos();

    /*
    document.body.addEventListener('click', function(){  
      
      //rect = getVideoPos();
      
      var time = $('#danmu').data("nowtime")
      console.log("clicked!!" + time);
        var a_danmu = {
        "text" : "豆222喔!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
        "color" : "red",
        "size" : "1",
        "position" : "0",
        "time" : time + 3,
        "isnew" : " "
      };
      
       //$('#danmu').danmu("add_danmu",a_danmu); 

    }); 
    */


    $("body").prepend("<div id='danmu' </div>");
    $("body").prepend("<div id='danmu_dialog' title='彈幕視窗'>");

    //load from html document ismail 2015/05/28
    $("#danmu_dialog").load(chrome.extension.getURL("danMu.html"));  

   
    $("#danmu_dialog").dialog();
    console.log("Danmu Start");

    //1.0.1
    var myFirebaseRef = new Firebase("https://popchrome.firebaseio.com/");

    /* myDataRef.on('child_added', function(snapshot) {
      var message = snapshot.val();
      alert(message);
      }); */

    $("#danMuUserBtn").click(function() {
        //alert("test");
        var text = document.getElementById('danMuUserText').value;
        var color = document.getElementById('danMuUserColor').value;
        var position = document.getElementById('danMuUserPosition').value;
        var time = $('#danmu').data("nowtime") + 3;
        var size = document.getElementById('danMuUserTextSize').value;
        var text_obj = '{ "text":"' + text + '","color":"' + color + '","size":"' + size + '","position":"' + position + '","time":' + time + '}';
        $.post("stone.php", {
            danmu: text_obj
        });
        var text_obj = '{ "text":"' + text + '","color":"' + color + '","size":"' + size + '","position":"' + position + '","time":' + time + ',"isnew":""}';
        var new_obj = eval('(' + text_obj + ')');

        var a_danmu = {
            "text": text,
            "color": color,
            "size": size,
            "position": position,
            "time": time,
            "isnew": " "
        };

        $('#danmu').danmu("add_danmu", a_danmu);
        document.getElementById('danMuUserText').value = '';
    });


    var a_danmu = {
        "text": "豆喔!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
        "color": "red",
        "size": "1",
        "position": "0",
        "time": 1,
        "isnew": " "
    };

    console.log("Danmu init.");
    //console.dir(rect);
    //console.log("top:" + rect.top + " left:" + rect.left);

    $("#danmu").danmu({
        left: rect.left,
        top: rect.top,
        height: rect.height,
        width: rect.width,
        zindex: 1000,
        speed: 30000,
        opacity: 1,
        font_size_small: 16,
        font_size_big: 24,
        top_botton_danmu_time: 6000
    });

    $('#danmu').danmu('danmu_resume');
    $('#danmu').danmu("add_danmu", a_danmu);

    console.log("Danmu Finish");
});












function getVideoPos() {


    /////// youtube
    var rect = {};
    var video = $("video");

    if (video.length == 1) {
        rect.left = video.offset().left;
        rect.top = video.offset().top;
        rect.height = video.height();
        rect.width = video.width();
    } else
        rect = getVideoObjectCase();


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

    if (rect) {
        var rect = videoNode[0].getBoundingClientRect();
        console.dir(rect);
    }


    return rect;
}
