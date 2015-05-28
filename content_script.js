/**
@version	@date		@author     @purpose
1.0.0		2015/05/02	kusogray	init. project
1.0.1		2015/05/02	kusogray	using firebase
1.0.2		2015/05/17	kusogray	fire on enter key pressed
1.0.2.1		2015/05/17	kusogray	send danmu as a function
1.0.3		2015/05/17	kusogray	send to firebase
1.0.4		2015/05/24	kusogray	send / receive msg from background.js to content_script.js
1.0.5		2015/05/24	kusogray	get json from firebase
1.0.6 		2015/05/28 ismail try DOMSubtreeModified solution
*1.0.7 		2015/05/28 ismail   separate dialog html view

 */

//1.0.1
var myFirebaseRef = new Firebase("https://popchrome.firebaseio.com/");

// 1.0.4
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
	alert("test3");
	console.log(sender.tab ?
		"from a content script:" + sender.tab.url :
		"from the extension");
	// if (request.greeting == "hello")
	sendResponse({
		farewell : "goodbye"
	});
});

/**

1.0.6 2015/05/28 ismail try DOMSubtreeModified solution

 **/
var rect = {};

$("body").bind("DOMSubtreeModified", function () {

	var videoObj = $("video");
	//console.dir(videoObj);
	//videoObj[0].getBoundingClientRect();
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

var htmlTagFlag = false;

$(function () {

	/*jQuery(document).ready(function () {
	jQuery('video').bind('contextmenu', function () {
	return false;
	});
	});*/

	/*$("h2").on('click', 'p.test', function() {
	alert('you clicked a p.test element');
	});*/

	/*$("#container").bind("DOMNodeInserted",function(){
	alert("child is appended");
	});*/

	var htmlTag = " <select  name=\"color\" id=\"danMuUserColor\" > <option value=\"red\">紅色</option>   " +
		"               <option value=\"white\">白色</option> " +
		"               <option value=\"green\">綠色</option>                           " +
		"               <option value=\"blue\">藍色</option>                            " +
		"               <option value=\"yellow\">黃色</option>                          " +
		"               </select>                                                       " +
		"               <select name=\"size\" id=\"danMuUserTextSize\" >                        " +
		"               <option value=\"1\">大文字</option>                             " +
		"               <option value=\"0\">小文字</option>                             " +
		"               </select>                                                       " +
		"               <select name=\"position\" id=\"danMuUserPosition\"   >                   " +
		"               <option value=\"0\">滾動</option>                               " +
		"               <option value=\"1\">頂端</option>                               " +
		"               <option value=\"2\">底端</option>                               " +
		"               </select>                                                       " +
		"           <input type=\"textarea\" id=\"danMuUserText\" max=300 />                     " +
		"            <button type=\"button\" id=\"danMuUserBtn\" >送出</button>       ";

	$("body").prepend("<div id=\"danmu\" </div>");
	$("body").prepend("<div id=\"danmu_dialog\" title=\"彈幕視窗\" >  " + htmlTag);
	//$("#danmu_dialog").dialog();
	$("#danmu_dialog").hide();

	$('video').bind('contextmenu', function () {

		event.preventDefault();
		$("<div class='custom-popchrome-menu'>開啟彈幕視窗</div>")
		.appendTo("body")
		.css({
			top : event.pageY + "px",
			left : event.pageX + "px"
		});
		$(".custom-popchrome-menu").css("z-index", "1000");
		$(".custom-popchrome-menu").css("position", "absolute");
		$(".custom-popchrome-menu").css("position", "absolute");
		$(".custom-popchrome-menu").css("background-color", "#C0C0C0");
		//$(".custom-popchrome-menu").css("background-color","#C0C0C0");
		$(".custom-popchrome-menu").css("border", "1px solid black");
		$(".custom-popchrome-menu").css("padding", "2px");
		$(".custom-popchrome-menu").css("height", "20");

		return false; // video preventDefault


		/* z-index:1000;
		position: absolute;
		background-color:#C0C0C0;
		border: 1px solid black;
		padding: 2px;*/
	});

	$(document).mousedown(function (event) {
		if (event.which == 1) {
			if (event.target.className == "custom-popchrome-menu") {
				if (!htmlTagFlag) {

					htmlTagFlag = true;
				}

				$("#danmu_dialog").dialog();
			}
		}

		$(".custom-popchrome-menu").remove();
	});

	/*$.contextMenu({
	selector: 'video',
	callback: function(key, options) {
	var m = "clicked: " + key;
	window.console && console.log(m) || alert(m);
	},
	items: {
	"edit": {name: "Edit", icon: "edit"},
	"cut": {name: "Cut", icon: "cut"},
	"copy": {name: "Copy", icon: "copy"},
	"paste": {name: "Paste", icon: "paste"},
	"delete": {name: "Delete", icon: "delete"},
	"sep1": "---------",
	"quit": {name: "Quit", icon: "quit"}
	}
	});*/

	var video = $("video");

	$('video').on('click', function (e) {
		console.log('clicked hoho !!!!!!!');
	})

	var rect = {};
	//rect = getVideoPos();
	/*document.body.addEventListener('click', function () {

	//rect = getVideoPos();

	var time = $('#danmu').data("nowtime")
	console.log("clicked!!" + time);


	});*/

	console.log("Danmu Start");

	/* myDataRef.on('child_added', function(snapshot) {
	var message = snapshot.val();
	alert(message);
	}); */

	$("#danMuUserBtn").click(function () {
		sendDanmuFunc(); // v1.0.2.1
	});

	var a_danmu = {
		"text" : "豆喔!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
		"color" : "red",
		"size" : "1",
		"position" : "0",
		"time" : 1,
		"isnew" : " "
	};

	console.log("Danmu init.");
	//console.dir(rect);
	//console.log("top:" + rect.top + " left:" + rect.left);

	$("#danmu").danmu({
		left : rect.left,
		top : rect.top,
		height : rect.height,
		width : rect.width,
		zindex : 1000,
		speed : 30000,
		opacity : 1,
		font_size_small : 16,
		font_size_big : 24,
		top_botton_danmu_time : 6000
	});

	$('#danmu').danmu('danmu_resume');
	$('#danmu').danmu("add_danmu", a_danmu);

	console.log("Danmu Finish");

	// v1.0.2

	$('#danMuUserText').keypress(function (e) {
		if (e.keyCode == 13) {
			sendDanmuFunc();
		}
	});

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

function sendDanmuFunc() {
	var text = document.getElementById('danMuUserText').value;
	var color = document.getElementById('danMuUserColor').value;
	var position = document.getElementById('danMuUserPosition').value;
	var time = $('#danmu').data("nowtime") + 3;
	var size = document.getElementById('danMuUserTextSize').value;
	var text_obj = '{ "text":"' + text + '","color":"' + color + '","size":"' + size + '","position":"' + position + '","time":' + time + '}';
	//$.post("stone.php",{danmu:text_obj});
	var text_obj = '{ "text":"' + text + '","color":"' + color + '","size":"' + size + '","position":"' + position + '","time":' + time + ',"isnew":""}';
	var new_obj = eval('(' + text_obj + ')');

	var a_danmu = {
		"text" : text,
		"color" : color,
		"size" : size,
		"position" : position,
		"time" : time,
		"isnew" : " "
	};

	$('#danmu').danmu("add_danmu", a_danmu);
	document.getElementById('danMuUserText').value = '';
	sendToFireBase(a_danmu);
}

//1.0.3
function sendToFireBase(inputDanmuObj) {

	var tmpUrl = document.URL;
	tmpUrl = tmpUrl.replace(/\./g, "{dot}");
	tmpUrl = tmpUrl.replace(/\#/g, "{sharp}");
	tmpUrl = tmpUrl.replace(/\$/g, "{dollar}");
	tmpUrl = tmpUrl.replace(/\[]/g, "{left}");
	tmpUrl = tmpUrl.replace(/\]/g, "{right}");
	tmpUrl = tmpUrl.replace(/\:/g, "{colon}");
	tmpUrl = tmpUrl.replace(/\//g, "{slash}");
	console.log(tmpUrl);

	var randomSubName = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
			v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	var usersRef = myFirebaseRef.child("popChrome");
	var popChromeRef = usersRef.child(tmpUrl);
	var contentRef = popChromeRef.child(randomSubName);

	/* "text" : text,
	"color" : color,
	"size" : size,
	"position" : position,
	"time" : time,
	"isnew" : " " */

	//[Todo] it might be injected so we need a white list here.
	var content = "text:" + inputDanmuObj.text +
		",color:" + inputDanmuObj.color +
		",size:" + inputDanmuObj.size +
		",position:" + inputDanmuObj.position +
		",time:" + inputDanmuObj.time;

	contentRef.set({
		content
	});
}
