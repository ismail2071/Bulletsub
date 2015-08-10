/**
@version    @date       @author     @purpose
1.0.0       2015/05/02  kusogray    init. project
1.0.1       2015/05/02  kusogray    using firebase
1.0.2       2015/05/17  kusogray    fire on enter key pressed
1.0.2.1     2015/05/17  kusogray    send danmu as a function
1.0.3       2015/05/17  kusogray    send to firebase
1.0.4       2015/05/24  kusogray    send / receive msg from background.js to content_script.js
1.0.5       2015/05/24  kusogray    get json from firebase
1.0.6       2015/05/28  ismail      try DOMSubtreeModified solution
1.0.7       2015/05/28  ismail      separate dialog html view
1.0.8       2015/05/29  ismail      support flash in some cases & onPasue,onResume danmu
1.0.9       2015/05/31  ismail      mouse right key event
1.0.10      2015/05/31  ismail      danmu display event bind to click menu
1.0.11      2015/06/02  kusogray    flash context menu
1.0.12      2015/06/03  ismail      refine
1.0.13      2015/06/04  ismail      calculate object offset from top for scroll websites(e.g. facebook)
1.0.14      2015/06/08  kusogray    listen to html5 player full screen event
1.0.15      2015/06/10  kusogray    danmu as list vo and add a "from" attribute
1.0.16      2015/06/10  kusogray    get js back from danMu.html
1.0.17      2015/06/11  kusogray    change Facebook flash to html5
1.0.18      2015/06/12  ismail      right click flash will attempt convert html5 and refine some danmu window
1.0.19      2015/06/29  kusogray    two dialog issue
1.0.20      2015/06/29  kusogray    fix multi video danmu pos
1.0.21      2015/07/08  kusogray    fix danmu timeline issue
1.0.22      2015/07/08  kusogray    fix change video size update danmu width issue
1.0.23      2015/07/11  kusogray    clear danmu when needed
1.0.24      2015/07/11  ismail      try dynamoDB solution
1.0.25      2015/07/11  kusogray    fix youtube full screen issue
1.0.26      2015/07/14  kusogray    display danmu option
1.0.27      2015/07/15  ismail      Using facebook Identity Federation APIs for AWS
1.0.28      2015/07/18  ismail      change to nodejs and MongoDB on AWS solution
1.0.29      2015/08/09  kusogray    fb and youtube input url function
1.0.30      2015/08/09  kusogray    pause danmu time line if video is paused or ended when open danmu
1.0.31      2015/08/09  kusogray    remove danmu array under current #dunmu function
 */

//1.0.1
//var myFirebaseRef = new Firebase("https://popchrome.firebaseio.com/");

var isFullScreenFlag = false;
var displayFlag = false;

//1.0.25
function ytVidId() {
	var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	return (document.URL.match(p)) ? true : false;
}

//1.0.29
function getInsertUrl(inputUrl){
	if(inputUrl=="" && videoProps.obj.baseURI.indexOf('xx.fbcdn.net')> -1){
		return videoProps.obj.baseURI.substr(videoProps.obj.baseURI,videoProps.obj.baseURI.indexOf("?"));
	}
	if(inputUrl.indexOf('xx.fbcdn.net')> -1){

		return inputUrl.substr(inputUrl,inputUrl.indexOf("?"));

	}else{
		return videoProps.obj.baseURI;
	}
	
}

//1.0.31
function removeDanmuArray() {

	for (var k in $('#danmu').data("danmu_array")) {
		if ($('#danmu').data("danmu_array").hasOwnProperty(k)) {
			$('#danmu').data("danmu_array")[k] = [];
		}
	}

}

function alignTimeLine(clearFlag) {
	tmpTime = Math.round(currentRightClickVideo.currentTime * 10);
	//1.0.23
	if (clearFlag) {
		$('#danmu').danmu("danmu_hideall");
	}

	if (Math.round(tmpTime / 10) != Math.round(tmpVideoUpdateTime / 10)) {
		tmpVideoUpdateTime = tmpTime;
		//console.log("danmu time: " + $('#danmu').data("nowtime") + ", " + "影片: " + tmpTime);
		$('#danmu').danmu("danmu_updateDanmuTimeLine", tmpTime);
		//$('#danmu').data("nowtime",tmpTime);
	}

}

//1.0.19
var danmuWindowExist = false;

// 1.0.4
chrome.runtime.onMessage.addListener(

	function (request, sender, sendResponse) {
	console.log(sender.tab ?
		"from a content script:" + sender.tab.url :
		"from the extension");
	console.dir(request.token);
	sendResponse({
		farewell : "goodbye"
	});
});

var rect = {};
var videoProps = {};
var allDanmu = {};
var currentRightClickVideo;

//////init aws dynamodb

var dynamodb = {};

// 1.0.17 1.0.18
function convertVideos(convertTarget) {
	var embeds = document.getElementsByTagName(convertTarget);

	//var embeds = convertTarget;
	console.log("tagname: " + convertTarget + " converting....");
	//console.dir(embeds);
	for (var i = embeds.length - 1; i >= 0; i--) {

		if (embeds[i].type = "application/x-shockwave-flash") {
			var flashVideo = embeds[i];
			var flashVars = flashVideo.attributes['flashvars'].value;
			console.dir(embeds[i]);
			console.dir(flashVars);
			var decodedVars = decodeURIComponent(flashVars);

			// Hidden in the vars is the URL for HD mp4 video source.
			var n = decodedVars.match(/\"hd_src\":\"([^\"]+)\",/i);
			console.dir(n);
			var hdSrcUrl = n[1].split("\\").join("");

			var video = document.createElement('video');
			video.src = hdSrcUrl;
			video.controls = true;
			video.style.width = "100%";

			// Facebook has a super-deep, crazy DOM Structure.
			// Go up to the same level of play button overlay (hopefully).
			var container = flashVideo.parentNode.parentNode.parentNode.parentNode;

			// Make the HTML5 video the only child node
			while (container.hasChildNodes()) {
				container.removeChild(container.lastChild);
			}
			container.appendChild(video);
		}
	};
}

//1.0.17 current use only in FB
/*
var tmpUrl = document.URL;
if( tmpUrl.indexOf('www.facebook.com')> -1){
setInterval(convertVideos, 3000); // can change a way to trigger it
}
 */

function sendDanmuFunc() {
	var text = document.getElementById('danMuUserText').value;
	var color = document.getElementById('danMuUserColor').value;
	var position = document.getElementById('danMuUserPosition').value;
	var videoUri = getInsertUrl(videoProps.obj.src);//ytVidId(videoProps.obj.baseURI) ? videoProps.obj.baseURI : ;
	var time = Math.round(($('#danmu').data("nowtime")));
	if (isNaN(time)) {
		console.log("time is NaN, retry.");
		time = Math.round(($('#danmu').data("nowtime")));
		alert("Time is NaN! please resend a danmu. time: " + time + ", nowtime" + $('#danmu').data("nowtime"));
	}

	if (!isNaN(time)) {
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
			"time" : time.toString(),
			"isnew" : " ",
			"from" : "self"
		};
		console.log("send danmu: " + text + ", at time: " + time);
		$('#danmu').danmu("add_danmu", a_danmu);
		document.getElementById('danMuUserText').value = '';
		//1.0.24
		//1.0.28
		sendToMongo(a_danmu, videoUri);
	}

}

//1.0.28 (insert danmu to Mongo)

function sendToMongo(inputDanmuObj, videoUri) {

	/////////////////  create
	chrome.runtime.sendMessage({
		doyourjob : "needFuckingSend",
		comment : inputDanmuObj,
		Url : videoUri
	}, function (response) {
		console.log("answer:");
		console.dir(response);
	});

}

//1.0.9
$("body").mousedown(function (e) {

	if (e.button == 2) {

		$(".custom-popchrome-menu").remove();
		var videoObj = e.target;

		console.dir(videoObj);
		if ((videoObj.nodeName.toUpperCase() == "video".toUpperCase()) || (videoObj.getAttribute('type') == 'application/x-shockwave-flash')) {
			currentRightClickVideo = videoObj;
			rect = videoObj.getBoundingClientRect();

			videoProps.obj = videoObj;
			videoProps.type = (videoObj.nodeName.toUpperCase() == "video".toUpperCase()) ? 'html5' : 'flash';
			videoProps.target = (videoProps.type == 'html5') ? $(videoObj) : $(videoObj.nodeName + "[type='application/x-shockwave-flash']");

			if (videoProps.type == "flash")
				convertVideos(videoObj.nodeName);
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

				//1.0.26
				if (isFullScreenFlag) {
					if (ytVidId()) {
						$(".custom-popchrome-menu").detach().appendTo('.html5-video-container');
					}

					if (!displayFlag) {
						$(".custom-popchrome-menu").text('開啟彈幕');
					} else {
						$(".custom-popchrome-menu").text('關閉彈幕');
					}

				}
				$(".custom-popchrome-menu").css("z-index", "2147483647");
				$(".custom-popchrome-menu").css("position", "absolute");
				$(".custom-popchrome-menu").css("background-color", "#C0C0C0");
				//$(".custom-popchrome-menu").css("background-color","#C0C0C0");
				$(".custom-popchrome-menu").css("border", "1px solid black");
				$(".custom-popchrome-menu").css("padding", "2px");
				$(".custom-popchrome-menu").css("height", "20");
				return false;
			});

		}
	}

});

//1.0.15
var g_danmuList = [];

var tmpVideoUpdateTime = 0;

// 1.0.22
var tmpVideoLeft = 0;
var tmpVideoTop = 0;
var tmpVideoWidth = 0;
var tmpVideoHeight = 0;

var updateVideoPosTimerFlag = false;

function updateVideoPosTimeClock() {
	if (currentRightClickVideo) {

		var tmpOffset = parseInt(videoProps.target.offset().top);
		rect = currentRightClickVideo.getBoundingClientRect();

		tmpRectLeft = parseInt(rect.left);
		tmpOffset = parseInt(tmpOffset);
		tmpRectWidth = parseInt(rect.width);
		//tmpRectWidth = 950;
		tmpRectHeight = parseInt(rect.height);

		if (tmpRectLeft != parseInt(tmpVideoLeft) || tmpOffset != parseInt(tmpVideoTop) || parseInt(tmpVideoWidth) != tmpRectWidth || parseInt(tmpVideoHeight) != tmpRectHeight) {
			var videoPosProp = {
				"left" : tmpRectLeft,
				"top" : tmpOffset,
				"width" : tmpRectWidth,
				"height" : tmpRectHeight
			};
			tmpVideoLeft = tmpRectLeft;
			tmpVideoTop = tmpOffset;
			tmpVideoWidth = tmpRectWidth;
			tmpVideoHeight = tmpRectHeight;
			$('#danmu').danmu("danmu_updateVideoProps", videoPosProp);
			console.log("left: " + tmpRectLeft + ", width: " + tmpRectWidth);
		}

	}
	//console.log("arg: " + $(".timer71452").timer.arguments[0]);

	//console.log(new Date());
}

function insertRule(sheet, selectorText, cssText, position) {
	if (sheet.insertRule) {
		sheet.insertRule(selectorText + "{" + cssText + "}", position);
	} else if (sheet.addRule) {
		sheet.addRule(selectorText, cssText, poistion);
	}
}

//1.0.26
function displayDanmu(flag) {
	displayFlag = flag;
	$("#display").prop("checked", flag);
	for (i in document.styleSheets[0].rules) {
		if (document.styleSheets[0].rules[i].selectorText == ".flying") {
			displayText = "block";
			if (!flag) {
				displayText = "none";
			}
			document.styleSheets[0].rules[i].style.display = displayText;
		}
	}
}

$(function () {

	/*var $stylesheet = $('<style type="text/css" media="screen" />');
	$stylesheet.html('.flying{display:none !important;}');
	$('body').append($stylesheet);*/

	/*
	var $stylesheet = $('<style type="text/css" media="screen" />');
	$stylesheet.html('.flying{display:block !important;}');
	$('body').append($stylesheet);*/

	//$.css(".flying", "display: none");


	/*function getStyleBySelector(selector) {
	var sheetList = document.styleSheets;
	var ruleList;
	var i,
	j;


	for (i = sheetList.length - 1; i >= 0; i--) {
	ruleList = sheetList[i].cssRules;
	for (j = 0; j < ruleList.length; j++) {
	if (ruleList[j].type == CSSRule.STYLE_RULE &&
	ruleList[j].selectorText == selector) {
	return ruleList[j].style;
	}
	}
	}
	return null;
	}*/

	//1.0.26
	insertRule(document.styleSheets[0], ".flying", "display: block", 0);

	//alert(getStyleBySelector(".flying"));

	//$('.flying').css({"display": "none"});
	//$('.flying').show();

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

	//$("body").append("<div id='testOver' style=\"z-index:2147483647 ;position:absolute; top: 10px; right: 10px;  border: 1px solid red; display: block; background: #FFF; \"> xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>");

	//$( "video" ).parent().append("<div id='danmu' style=\"z-index:2147483647;position:absolute;\" </div>");
	$("body").append("<div id='danmu' style='z-index:2147483647;position:absolute;' </div>");
	$("body").prepend("<div id='danmu_dialog' style='z-index:2147483647;' title='彈幕視窗''>");

	//$("body").prepend("<div id='winSize' style='z-index:2147483647;' >");

	renderInputBox();

	$(document).mousedown(function (event) {
		if (event.which == 1) {
			if (event.target.className == "custom-popchrome-menu") {

				//1.0.26
				var tmpCustomPopChromeMenuTxt = $(".custom-popchrome-menu").text();
				if (!(tmpCustomPopChromeMenuTxt.indexOf("視窗") > -1)) {
					if (displayFlag) {
						displayDanmu(false);

					} else {
						displayDanmu(true);
					}
					$(".custom-popchrome-menu").remove();
					return;
				} else {
					$("#display").prop("checked", true);
					displayDanmu(true);
				}

				//1.0.21
				if (!updateVideoPosTimerFlag) {
					var int = self.setInterval("updateVideoPosTimeClock()", 700);
					var int = self.setInterval("alignTimeLine(false)", 5000);
					updateVideoPosTimerFlag = true;
				}

				$('#loadingStatusLabel').text("Status: Loading...");
				alignTimeLine(true);
				

				console.log("Danmu Start");
				tmpVideoUpdateTime = 0;
				tmpTime = 0;
				/*currentRightClickVideo.addEventListener('timeupdate', function () {
				tmpTime = parseInt(currentRightClickVideo.currentTime);
				if (tmpTime != tmpVideoUpdateTime) {
				tmpVideoUpdateTime = tmpTime
				console.log("now time: " + $('#danmu').data("nowtime"));
				$('#danmu').danmu("danmu_updateDanmuTimeLine", parseInt(tmpTime));
				}

				}, false);*/

				/* myDataRef.on('child_added', function(snapshot) {
				var message = snapshot.val();
				alert(message);
				}); */

				/*var a_danmu = {
				"text" : "豆喔!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
				"color" : "red",
				"size" : "1",
				"position" : "0",
				"time" : 1,
				"isnew" : " ",
				"from" : "self"
				};
				g_danmuList.push(a_danmu);*/

				//1.0.27
				//1.0.28 (load danmu from Mongo)
				console.log("Danmu is loading from server now...");
				function callback(response) {
					console.log("Danmu is loading done:");
					$('#loadingStatusLabel').text("Status: Loaded " + response.answer.length + " danmus.");
					console.dir(response.answer);
					response.answer.map(function (item) {
						$('#danmu').danmu("add_danmu", item);
					});
				}

				//chrome.runtime.sendMessage({doyourjob: "needFuckingToken",comment:videoProps.obj.baseURI},callback);

				//
				removeDanmuArray(); // remove danmu before load //1.0.31
				var port = chrome.runtime.connect({
						name : "needFuckingToken"
					});
				
				var tmpUrl = getInsertUrl(videoProps.obj.src);
				//ytVidId(videoProps.obj.baseURI) ? videoProps.obj.baseURI : videoProps.obj.src;

				port.postMessage({
					comment : tmpUrl
				});

				port.onMessage.addListener(callback);

				console.log("Danmu init.");
				//console.dir(rect);
				//console.log("top:" + rect.top + " left:" + rect.left);

				//
				//1.0.14
				// rect.top is a dynamic value means the distance from object to current view top
				// #! we don't need to plus it with offset, offset is just sufficient
				var offset = videoProps.target.offset().top;
				//console.log(offset + "+" + rect.top);

				//1.0.20
				if (!danmuWindowExist) {
					$("#danmu").danmu({
						left : rect.left,
						top : (offset),
						height : rect.height,
						width : rect.width,
						zindex : 2147483647,
						speed : 30000,
						opacity : 1,
						font_size_small : 16,
						font_size_big : 24,
						top_botton_danmu_time : 6000
					});
				} else {
					var videoPosProp = {
						"left" : rect.left,
						"top" : offset,
						"width" : rect.width,
						"height" : rect.height
					};
					$('#danmu').danmu("danmu_updateVideoProps", videoPosProp);
					$('#danmu').danmu("danmu_getVideoProps");
					//console.log(offset + "+" + rect.top);
				}

				//console.log("初始left:" + rect.left + ", width: " + currentRightClickVideo.videoWidth);

				/*window.onresize = function (event) {
				var tmpOffset = videoProps.target.offset().top;
				rect = currentRightClickVideo.getBoundingClientRect();
				var videoPosProp = {
				"left" : rect.left,
				"top" : tmpOffset,
				"width" : currentRightClickVideo.videoWidth,
				"height" : currentRightClickVideo.videoHeight
				};
				//$('#winSize').danmu("danmu_updateVideoProps", videoPosProp);
				$('#winSize').text("left:" + rect.left + ", width:" + currentRightClickVideo.videoWidth);
				console.log("resized!");
				};*/

				//1.0.30
				if(videoProps.obj.ended || videoProps.obj.paused){
					$('#danmu').danmu('danmu_pause');
				}else{
					$('#danmu').danmu('danmu_resume');
				}
				

				// add by list
				/*for (var i = 0; i < g_danmuList.length; i++) {
				$('#danmu').danmu("add_danmu", g_danmuList[i]);
				}*/

				console.log("Danmu Finish");

				videoProps.obj.onpause = function () {

					$("#danmu").danmu('danmu_pause');
				};

				videoProps.obj.onplay = function () {

					$('#danmu').danmu('danmu_resume');

				}

				//1.0.21
				currentRightClickVideo.onseeking = function () {
					alignTimeLine(true);
				};

				//1.0.23
				currentRightClickVideo.onended = function () {
					$('#danmu').danmu('danmu_stop');

				};

				currentRightClickVideo.onplay = function () {
					$('#danmu').danmu('danmu_resume');
				};

				//1.0.19
				if (danmuWindowExist) {
					$("#danmu_dialog").dialog('close');
					danmuWindowExist = false;
				}
				$("#danmu_dialog").dialog();
				danmuWindowExist = true;

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

// 1.0.14
// listen to html5 player full screen event

document.addEventListener("fullscreenchange", function (e) {
	//fullscreenState.innerHTML = (document.fullscreen) ? "" : "not ";
	console.log('Event1: ' + document.fullscreen);
}, false);

document.addEventListener("mozfullscreenchange", function (e) {
	//fullscreenState.innerHTML = (document.mozFullScreen) ? "" : "not ";
	console.log('Event2: ' + document.mozFullScreen);
}, false);

document.addEventListener("webkitfullscreenchange", function (e) {
	//fullscreenState.innerHTML = (document.webkitIsFullScreen) ? "" : "not ";
	console.log('Event3: ' + document.webkitIsFullScreen);

	//1.0.25

	if (document.webkitIsFullScreen) {
		if (ytVidId()) {
			$("#danmu").detach().appendTo('.html5-video-container');
		}
		isFullScreenFlag = true;
	} else {

		if (ytVidId()) {
			$("#danmu").detach().appendTo('body');
		}
		isFullScreenFlag = false;
	}

}, false);

document.addEventListener("msfullscreenchange", function (e) {
	//fullscreenState.innerHTML = (document.msFullscreenElement) ? "" : "not ";
	console.log('Event4: ' + document.msFullscreenElement);
}, false);

//1.0.16

//1.0.18
function renderInputBox() {

	$("#danmu_dialog").load(chrome.extension.getURL("danMu.html"), function () {
		$('#danMuUserText').keypress(function (e) {
			if (e.keyCode == 13) {
				sendDanmuFunc();
			}
		});

		$("#danMuUserBtn").click(function () {
			sendDanmuFunc(); // v1.0.2.1
		});

		//1.0.24 check to query db danmu

		$("#display").click(function () {
			console.log("checked");
			if (!$("#display").prop("checked")) {
				console.log("checked 2");
				$('#danmu').hide();
			} else
				$("#danmu").show();
		});

	});

	$("#danmu_dialog").hide();

}
