
  // Trollface image must be at 'my_extension/images/trollface.jpg'.
  console.log("start!!");
  var trollface = chrome.extension.getURL("images/trollface.jpg");
  $('.image-hover').each(function(index, image){
    $(image).attr('src', trollface);
  });



/*var video=document.getElementsByTagName("video");
var rect ={};

if(!video)
	rect = video[0].getBoundingClientRect();
else {
	video = getVideoObjectCase();
	//rect = video[0].getBoundingClientRect();
}
*/

getVideoPos();

document.body.addEventListener('click', function(){  
console.log("clicked!!");
getVideoPos();


}); 




function getVideoPos(){


/////// youtube
var rect={};
var video = $("video");

if(video.length==1){
rect.left= video.offset().left;
rect.top= video.offset().top;
}
 
//var video = document.getElementsByTagName("video");

else{

	rect=getVideoObjectCase();

}







chrome.runtime.sendMessage(rect);



}


function getVideoObjectCase() {
	console.log("not video tag");
	var node_list = $("object");

    //var node_list = document.getElementsByTagName('object');
    var videoNode = [];
 
    for (var i = 0; i < node_list.length; i++) {
        var node = node_list[i];
 
        if (node.getAttribute('type') == 'application/x-shockwave-flash') {
            videoNode.push(node);
        }
    } 

 	var rect = videoNode[0].getBoundingClientRect();
	console.dir(rect);

    return rect;
}

