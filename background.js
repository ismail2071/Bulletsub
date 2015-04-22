function loadjscssfile(filename, filetype) {
	if (filetype == "js") { //if filename is a external JavaScript file
		var fileref = document.createElement('script')
			fileref.setAttribute("type", "text/javascript")
			fileref.setAttribute("src", filename)
	} else if (filetype == "css") { //if filename is an external CSS file
		var fileref = document.createElement("link")
			fileref.setAttribute("rel", "stylesheet")
			fileref.setAttribute("type", "text/css")
			fileref.setAttribute("href", filename)
	}
	if (typeof fileref != "undefined")
		document.getElementsByTagName("head")[0].appendChild(fileref)
}

$(function () {
	//hljs.initHighlightingOnLoad();
	// $("body").prepend("<img height=\"700\" width=\"700\" src='http://i.imgur.com/SApd3wJ.jpg'  ></img>");

	//loadjscssfile("css/jquery-ui.css", "css") ////dynamically load and add this .css file
	//loadjscssfile("js/jquery-ui.js", "js") //dynamically load "javascript.php" as a JavaScript file

	$("body").prepend("<div id=\"danmu\" </div>");

	$("body").prepend("<div id=\"danmu_dialog\" title=\"彈幕視窗\">  <input type=\"value\" id=\"danmuTextId\" value=\"豆豆豆鬥喔!!!!!\"> </input> </div>");

	$("#danmu_dialog").dialog();
	var tmpTxt = $("#danmuTextId").val();
	$("#danmuTextId").keypress(function (e) {
		if (e.which == 13) {
			var tmpText = $("#danmuTextId").val();
			var a_danmu2 = {
				"text" : "豆喔!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
				"color" : "red",
				"size" : "1",
				"position" : "0",
				"time" : 1,
				"isnew" : " "
			};
			console.log(tmpText);
			$('#danmu').danmu('danmu_resume');
			$('#danmu').danmu("add_danmu", a_danmu2);
		}
	});

	//console.log($('.t_fsz'));
	/*  $("body").click(function(){
	//var position = $(".drive-viewer-video-player" ).position();
	console.log($('.drive-viewer-video-player'));
	console.log($('.t_fsz'));
	//alert("left: " + position.left + ", top: " + position.top );
	}	); */

	//$("#gc-container").remove();

	//window.open("popup.html");
	console.log("Danmu Start");
	var a_danmu = {
		"text" : "豆喔!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
		"color" : "red",
		"size" : "1",
		"position" : "0",
		"time" : 1,
		"isnew" : " "
	};
	
	var a_danmu2 = {
		"text" : "豆豆豆鬥喔!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
		"color" : "red",
		"size" : "1",
		"position" : "0",
		"time" : 1,
		"isnew" : " "
	};

	console.log("Danmu init.");
	$("#danmu").danmu({
		// left:$("#danmuarea").offset().left,
		// top:$("#danmuarea").offset().top,
		// height: 445,
		//    width: 800,
		left : 0,
		top : 0,
		height : "100%",
		width : "100%",
		speed : 30000,
		zindex : 1000,
		opacity : 1,
		font_size_small : 16,
		font_size_big : 24,
		top_botton_danmu_time : 6000
	});

	$('#danmu').danmu('danmu_resume');
	$('#danmu').danmu("add_danmu", a_danmu);
	$('#danmu').danmu("add_danmu", a_danmu2);

	console.log("Danmu Finish");
});
