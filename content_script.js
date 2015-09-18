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
1.0.32		2015/08/17  ismail    	add danMu UI language option
1.0.33		2015/09/02  kusogray    fix close png on the dialog
1.0.34		2015/09/02  kusogray    add danmu cnt local when user send a valid danmu
1.0.35		2015/09/08  ismail	    comment side bar
 */

/*
background: url(http://manual.mahara.org/en/15.04/_images/close.png);
background-size: 20px 20px;
background-repeat: no-repeat;
margin-right: 5px;
margin-top: -10px;
 */

//1.0.1
//var myFirebaseRef = new Firebase("https://popchrome.firebaseio.com/");

var isFullScreenFlag = false;
var displayFlag = false;

var histogramPlot;
var histogramDrew = false;
var histogramPastColor = "#FF9900"; // orange
var histogramNotPastColor = "#17BDB8"; // light blue
var histogramMouseColor = "#FF0000" // red


function toHHMMSS(input) {
	var sec_num = parseInt(input, 10); // don't forget the second param
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var time = hours + ':' + minutes + ':' + seconds;
	return time;
}

//1.0.25
function ytVidId() {
	var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
	return (document.URL.match(p)) ? true : false;
}

//1.0.29
function getInsertUrl(inputUrl) {
	if (inputUrl == "" && videoProps.obj.baseURI.indexOf('fbcdn') > -1) {
		return videoProps.obj.baseURI.substr(videoProps.obj.baseURI, videoProps.obj.baseURI.indexOf("?"));
	}
	if (inputUrl.indexOf('fbcdn') > -1) {

		return inputUrl.substr(inputUrl, inputUrl.indexOf("?"));

	} else {
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
	tmpTime = Math.floor(currentRightClickVideo.currentTime * 10);
	//1.0.23
	if (clearFlag) {
		$('#danmu').danmu("danmu_hideall");
	}

	//if (Math.floor(tmpTime / 10) != Math.floor(tmpVideoUpdateTime / 10)) {
	//tmpVideoUpdateTime = Math.floor(tmpTime / 10) * 10;
	//console.log("danmu time: " + $('#danmu').data("nowtime") + ", " + "影片: " + tmpTime);
	$('#danmu').danmu("danmu_updateDanmuTimeLine", tmpTime);
	//$('#danmu').data("nowtime",tmpTime);
	//}

}

//1.0.19
var danmuWindowExist = false;

// 1.0.4


var rect = {};
var videoProps = {};
var allDanmu = {};
var currentRightClickVideo;

function sendDanmuFunc() {
	
	var text = document.getElementById('twideoUserCommand').value;
	if (!text || text.length == 0) {
		return;
	}
	
	$('#twideoUserCommand').val("");
	// title bar danmu add 1
	// 1.0.34
	var tmpTitle = $('#danmu_dialog').dialog('option', 'title');
	var danmuCnt = parseInt(tmpTitle.split("-")[1].split(" ")[1], 10) + 1;
	$('#danmu_dialog').dialog('option', 'title', 'Twidéo - ' + danmuCnt + " comments.");

	var color = document.getElementById('twideoUserColor').value;
	var position = document.getElementById('twideoUserPosition').value;
	var videoUri = getInsertUrl(videoProps.obj.src); //ytVidId(videoProps.obj.baseURI) ? videoProps.obj.baseURI : ;
	var time = Math.round(($('#danmu').data("nowtime")));
	if (isNaN(time)) {
		console.log("time is NaN, retry.");
		time = Math.round(($('#danmu').data("nowtime")));
		alert("Time is NaN! please resend a danmu. time: " + time + ", nowtime" + $('#danmu').data("nowtime"));
	}

	if (!isNaN(time)) {
		var size = document.getElementById('twideoUserTextSize').value;
		var text_obj = '{ "text":"' + text + '","color":"' + color + '","size":"' + size + '","position":"' + position + '","time":' + time + '}';
		//$.post("stone.php",{danmu:text_obj});
		var text_obj = '{ "text":"' + text + '","color":"' + color + '","size":"' + size + '","position":"' + position + '","time":' + time + ',"isnew":""}';
		var new_obj = eval('(' + text_obj + ')');
		var language = $("#languageSelect option:selected").val() == null ? window.navigator.language : $("#languageSelect option:selected").val();

		var a_danmu = {
			"text" : text,
			"color" : color,
			"size" : size,
			"position" : position,
			"time" : time.toString(),
			"isnew" : " ",
			"from" : "self",
			"language" : language
		};
		console.log("send danmu: " + text + ", at time: " + time);
		$('#danmu').danmu("add_danmu", a_danmu);
		
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

		$(".ytp-menuitem.custom-twideo-menu").remove();
		$(".custom-twideo-menu").remove();
		var videoObj = e.target;

		//console.dir(videoObj);
		//console.log(window.location.href );

		//		if ((videoObj.nodeName.toUpperCase() == "video".toUpperCase()) || (videoObj.getAttribute('type') == 'application/x-shockwave-flash')) {
		currentRightClickVideo = videoObj;
		rect = videoObj.getBoundingClientRect();

		videoProps.obj = videoObj;
		if (videoObj.nodeName.toUpperCase() == "video".toUpperCase()) {
			videoProps.type = 'html5';
		}
		//videoProps.type = (videoObj.nodeName.toUpperCase() == "video".toUpperCase()) ? 'html5' : 'flash';
		//videoProps.target = (videoProps.type == 'html5') ? $(videoObj) : $(videoObj.nodeName + "[type='application/x-shockwave-flash']");

		if (videoProps.type == 'html5') {
			videoProps.target = videoObj;
		}
		//			if (videoProps.type == "flash")
		//				convertVideos(videoObj.nodeName);
		// 1.0.11


		if ($(".ytp-menu") != undefined && ytVidId()) {
			console.log("test youtube");

			$("<div class='ytp-menuitem custom-twideo-menu' aria-haspopup='false' tabindex='38' role='menuitem'><div class='ytp-menuitem-label custom-twideo-menu'><span><img src=" + chrome.extension.getURL("icon.png") + " height='28' width='28'/></span>Open Twidéo Window !!!!</div><div class='ytp-menuitem-content'></div></div>")
			.appendTo(".ytp-menu");

		} else {

			videoProps.target.bind('contextmenu', function () {
				//event.preventDefault();

				//$("<menu type='context' id='menu' class='custom-popchrome-menu'><menuitem label='開啟彈幕視窗'></menuitem><menu> ").appendTo("body")

				$("<div class='custom-twideo-menu'>Open Twidéo Window</div>")
				.appendTo("body")
				.css({
					top : event.pageY + "px",
					left : event.pageX + "px"
				});

				//1.0.26
				if (isFullScreenFlag) {
					if (ytVidId()) {
						$(".ccustom-twideo-menu").detach().appendTo('.html5-video-container');
					}

					if (!displayFlag) {
						$(".custom-twideo-menu").text('Display Comments');
					} else {
						$(".custom-twideo-menu").text('Close Comments');
					}

				}

				$(".custom-twideo-menu").css("z-index", "2147483647");
				$(".custom-twideo-menu").css("position", "absolute");
				$(".custom-twideo-menu").css("background-color", "#C0C0C0");
				//$(".custom-popchrome-menu").css("background-color","#C0C0C0");
				$(".custom-twideo-menu").css("border", "1px solid black");

				$(".custom-twideo-menu").css("padding", "2px");
				$(".custom-twideo-menu").css("height", "20");
				return false;
			});
		}
	}
	//	}

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

		var tmpOffset = parseInt(videoProps.target.offsetTop);
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
//insertRule(document.styleSheets[0], ".flying", "display: block", 0);
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
	$("#danMuDisplay").prop("checked", flag);
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

	//1.0.26
	insertRule(document.styleSheets[0], ".flying", "display: block", 0);

	$("body").append("<div id='danmu' style='z-index:2147483647;position:absolute;' </div>");
	$("body").prepend("<div id='danmu_dialog' style='z-index:2147483647;' title='Twidéo''>");
	$("body").append("<div id='twideo_Table' style='z-index:2147483647;' title='Twidéo comments'' ></div>");

	renderInputBox();

	$(document).mousedown(function (event) {
		if (event.which == 1) {

			var clickClassName = event.target.className;
			var clickClassPosition = clickClassName.search(/custom-twideo-menu/i);

			var classType = (clickClassPosition == 0) ? ".custom-twideo-menu" : ".ytp-menuitem.custom-twideo-menu";
			if (event.target.className.search(/custom-twideo-menu/i) > -1) {

				removeDanmuArray(); // remove danmu before load //1.0.31
				histogramDrew = false;
				//1.0.26
				var tmpCustomPopChromeMenuTxt = $(classType).text();
				if (!(tmpCustomPopChromeMenuTxt.indexOf("Twidéo") > -1)) {
					if (displayFlag) {
						displayDanmu(false);

					} else {
						displayDanmu(true);
					}
					$(classType).remove();
					return;
				} else {
					$("#danMuDisplay").prop("checked", true);

					displayDanmu(true);
				}

				//1.0.21
				if (!updateVideoPosTimerFlag) {
					var int = self.setInterval("updateVideoPosTimeClock()", 700);
					//var int = self.setInterval("alignTimeLine(false)", 2000);
					updateVideoPosTimerFlag = true;
				}

				//$('#loadingStatusLabel').text("Status: Loading...");
				alignTimeLine(true);

				console.log("Danmu Start");
				tmpVideoUpdateTime = 0;
				tmpTime = 0;

				//1.0.27
				//1.0.28 (load danmu from Mongo)
				console.log("Danmu is loading from server now...");
				function callback(response) {
					console.log("Danmu is loading done:");

					var tmpNumDanmu = 0;
					if (response.answer.length > 0) {
						tmpNumDanmu = response.answer.length;
						console.dir(response.answer);

						var data = response.answer.map(function (item) {

								delete item.isnew;
								if (item.language == null)
									item.language = window.navigator.language;
								$('#danmu').danmu("add_danmu", item);
								return [toHHMMSS(item.time), item.text];

							});
						if (typeof dataTable === 'undefined')
							dataTable = $('#table_id').DataTable({
									searching : false,
									data : data,
									paging : false,
								});

						var languageList = ["zh-CN", "zh-TW", "en", "jp"];

						languageList.map(function (lan) {
							console.log($(".damnulan_" + lan));
							$(".damnulan_" + lan).hide();
							if (lan == window.navigator.language)
								$(".damnulan_" + lan).show();

						});

					}

					//$('#loadingStatusLabel').text("Status: Loaded " + tmpNumDanmu + " danmus.");

					$("#danmu_dialog").dialog({
						height : mainWindowHeight,
						width : mainWindowWidth

					});

					$('#danmu_dialog').dialog('option', 'title', 'Twidéo - ' + tmpNumDanmu + " comments.");
					$('#danmu_dialog').dialog('option', 'dialogClass', 'twideoDialogClass');

					// 1.0.33
					var closePngUrl = 'url(' + chrome.extension.getURL("close.png") + ')';
					var tmpCss = '  background: url(http://manual.mahara.org/en/15.04/_images/close.png);background-size: 20px 20px;background-repeat: no-repeat;margin-right: 5px;margin-top: -10px;';
					$('.twideoDialogClass  .ui-dialog-titlebar ').css({
						'display' : 'none'
					});
					$('#danmu_dialog').dialog({
						draggable : false,
						closeOnEscape: true
					}).parent().draggable();

					$("#histogramImgId").click(function () {
						$('#danmu_dialog').dialog({
							height : histogramWindowHeight,
							width : histogramWindowWidth
						});
						$('#danmuSettingDivId').hide();
						$('#danmuStatisticsDivId').show();
						$('#mainDanMuDivId').hide();



					});

					//1.0.35
					$("#twideo_Table").dialog({
						height : mainWindowHeight * 1.6,
						width : mainWindowWidth * 1.3,
						position : {
							my : "center+100%",
							at : "center",
							of : window
						},
						close : function () {
							$('#twideo_Table').toggle()
						}
					});
					$("#twideo_Table").dialog('close');

					$("#commentSideImgId").click(function () {
						($("#twideo_Table").dialog("isOpen")) ? $("#twideo_Table").dialog('close') : $("#twideo_Table").dialog('open');
					});

				}

				//chrome.runtime.sendMessage({doyourjob: "needFuckingToken",comment:videoProps.obj.baseURI},callback);

				//

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
				var offset = videoProps.target.offsetTop;
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

				//1.0.30
				if (videoProps.obj.ended || videoProps.obj.paused) {
					$('#danmu').danmu('danmu_pause');
				} else {
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

		$(".ytp-popup.ytp-contextmenu").css("display", "none");
		$(classType).remove();
	});

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

	//$("#danmu_dialog").load(chrome.extension.getURL("danMu.html"), function () {

	$("#danmu_dialog").parent().keyup(function (e) {
		// ESC key
		if (e.keyCode === 27) {
			// custom action
			$('#danmu_dialog').dialog('close');
		}
	});

	$("#danmu_dialog").load(chrome.extension.getURL("TwideoMainWindow.html"), function () {
		$('#twideoUserCommand').keypress(function (e) {
			if (e.keyCode == 13) {
				sendDanmuFunc();
			}
		});

		$("#sendUserCommandId").click(function () {
			console.log("test");
			sendDanmuFunc(); // v1.0.2.1
		});


	});

	$("#danmu_dialog").hide();


}
