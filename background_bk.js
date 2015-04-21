  $(function() {
  //hljs.initHighlightingOnLoad();
  // $("body").prepend("<img height=\"700\" width=\"700\" src='http://i.imgur.com/SApd3wJ.jpg'  ></img>");
   $("body").prepend("<div id=\"danmu\" </div>");
  
  //console.log($('.t_fsz'));
 /*  $("body").click(function(){
	  //var position = $(".drive-viewer-video-player" ).position();
		console.log($('.drive-viewer-video-player'));
		console.log($('.t_fsz'));
  //alert("left: " + position.left + ", top: " + position.top );
	}	); */
 
 //$("#gc-container").remove();
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
 $("#danmu").danmu({
	// left:$("#danmuarea").offset().left,
	// top:$("#danmuarea").offset().top,
	// height: 445,
 //    width: 800,
	left:100,
	top:0,
	height:"100%",
	width:"100%",
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