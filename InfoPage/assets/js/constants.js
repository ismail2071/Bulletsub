// Language Constants
// 繁體中文
var znTwHome = "主頁";

//簡體中文
var znChHome = "主页";

// 日本語
var jpHome = "ホーム";

// English
var enHome = "Main Page";

var language = "jp";
var languagePackage = {};

if (language == "en") {
	languagePackage = {
		homeText : enHome
	};
} else if (language == "jp") {
	languagePackage = {
		homeText : jpHome
	};
}

var textSetter = function (id, text) {
	var id = "#" + id;
	$(id).html($(id).html().replace("ReplaceText", text));
}

$(document).ready(function () {
	// Handler for .ready() called.
	textSetter("homeText", languagePackage.homeText);

});
