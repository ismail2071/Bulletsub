/**
@version	@date		@author     @purpose
1.0.0		2015/05/02	kusogray	init. project
1.0.1		2015/05/02	kusogray	using firebase
1.0.2		2015/05/17	kusogray	fire on enter key pressed
1.0.2.1		2015/05/17	kusogray	send danmu as a function
1.0.3		2015/05/17	kusogray	send to firebase
1.0.4		2015/05/24	kusogray	send / receive msg from background.js to content_script.js
1.0.5		2015/05/24	kusogray	get json from firebase
1.0.6 		2015/05/28  ismail		try DOMSubtreeModified solution
1.0.7 		2015/05/28  ismail  	separate dialog html view
1.0.8		2015/05/29  ismail 		support flash in some cases & onPasue,onResume danmu
1.0.9		2015/05/31  ismail		mouse right key event
1.0.10		2015/05/31  ismail 		danmu display event bind to click menu
1.0.11		2015/06/02  kusogray 	flash context menu
1.0.12		2015/06/03  ismail		refine
1.0.13		2015/06/04	ismail		calculate object offset from top for scroll websites(e.g. facebook)
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

var rect = {};
var videoProps = {};

//1.0.9
$("body").mousedown(function (e) {

	if (e.button == 2) {

		var videoObj = e.target;


		console.dir(videoObj);
		if ((videoObj.nodeName.toUpperCase() == "video".toUpperCase()) || (videoObj.getAttribute('type') == 'application/x-shockwave-flash')) {

			rect = videoObj.getBoundingClientRect();

			
			videoProps.obj = videoObj;
			videoProps.type = (videoObj.nodeName.toUpperCase() == "video".toUpperCase()) ? 'html5' : 'flash';
			videoProps.target = (videoProps.type=='html5')?$(videoObj):$(videoObj.nodeName+"[type='application/x-shockwave-flash']");
			


				// 1.0.11
				
				videoProps.target.bind('contextmenu', function () {
					event.preventDefault();

					//$("<menu type='context' id='menu' class='custom-popchrome-menu'><menuitem label='開啟彈幕視窗'></menuitem><menu> ").appendTo("body")
					
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
					return false;
				});
			
			
		} else
			return;
	}

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

	$("body").prepend("<div id='danmu' </div>");
	$("body").prepend("<div id='danmu_dialog' title='彈幕視窗''>");

	$("#danmu_dialog").load(chrome.extension.getURL("danMu.html"));

	//$("#danmu_dialog").dialog();
	$("#danmu_dialog").hide();

	$(document).mousedown(function (event) {
		if (event.which == 1) {
			if (event.target.className == "custom-popchrome-menu") {
				if (!htmlTagFlag) {

					htmlTagFlag = true;
				}

								console.log("Danmu Start");

					/* myDataRef.on('child_added', function(snapshot) {
					var message = snapshot.val();
					alert(message);
					}); */

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

					//
					//1.0.13
					var offset = videoProps.target.offset().top;

					$("#danmu").danmu({
						left : rect.left,
						top : (rect.top+offset),
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

					videoProps.obj.onpause = function () {

					$("#danmu").danmu('danmu_pause');
					};

					videoProps.obj.onplay = function () {

					$('#danmu').danmu('danmu_resume');

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




	

});
