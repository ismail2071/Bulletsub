$(document).ready(function() {
  // Trollface image must be at 'my_extension/images/trollface.jpg'.
  console.log("start!!");
  var trollface = chrome.extension.getURL("images/trollface.jpg");
  $('.image-hover').each(function(index, image){
    $(image).attr('src', trollface);
  });
});