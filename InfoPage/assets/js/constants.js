// Language Constants
// 繁體中文
var znTwHome = "主頁";
var znTwHowToUseText = "使用教學";
var znTwFaqText = "FAQ";
var znTwTeamText = "關於我們";
var znTwDonationText = "贊助";
var znTwShortSentenceText = "在影片中推文吧!";
var znTwLongSentenceText = "支援所有html5影片 (iFrame除外)";

//簡體中文
var znChHome = "主页";
var znChHowToUseText = "使用教学";
var znChFaqText = "FAQ";
var znChTeamText = "关于我们";
var znChDonationText = "贊助";
var znChShortSentenceText = "在影片中发弹幕吧!";
var znChLongSentenceText = "支援所有html5影片 (iFrame除外)";

// 日本語
var jpHome = "ホーム";
var jpHowToUseText = "使い方";
var jpFaqText = "FAQ";
var jpTeamText = "チーム";
var jpDonationText = "寄付する";
var jpShortSentenceText = "動画でコメントする！";
var jpLongSentenceText = "サポート全てhtml5動画  (iFrame以外)";

// English
var enHome = "Main Page";
var enHowToUseText = "How To Use";
var enFaqText = "FAQ";
var enTeamText = "Team";
var enDonationText = "Donation";
var enShortSentenceText = "Comments on Video!";
var enLongSentenceText = "Comments on Video!";

var language = "znTw";
var languagePackage = {};

if (language == "en") {
	languagePackage = {
		homeText : enHome,
		howToUseText : enHowToUseText,
		faqText : enFaqText,
		teamText : enTeamText,
		donationText : enDonationText,
		shortSentenceText : enShortSentenceText,
		longSentenceText : enLongSentenceText,
	};
} else if (language == "jp") {
	languagePackage = {
		homeText : jpHome,
		howToUseText : jpHowToUseText,
		faqText : jpFaqText,
		teamText : jpTeamText,
		donationText : jpDonationText,
		shortSentenceText : jpShortSentenceText,
		longSentenceText : jpLongSentenceText,
	};
}else if (language == "znTw") {
	languagePackage = {
		homeText : znTwHome,
		howToUseText : znTwHowToUseText,
		faqText : znTwFaqText,
		teamText : znTwTeamText,
		donationText : znTwDonationText,
		shortSentenceText : znTwShortSentenceText,
		longSentenceText : znTwLongSentenceText,
	};
}

var htmlSetter = function (id, text) {
	var id = "[id=" + id +"]";
	$(id).html($(id).html().replace("ReplaceText", text));
}

var textSetter = function (id, text) {
	var id = "[id=" + id +"]";
	$(id).text(text);
}

$(document).ready(function () {
	// Handler for .ready() called.
	htmlSetter("homeText", languagePackage.homeText);
	htmlSetter("howToUseText", languagePackage.howToUseText);
	htmlSetter("faqText", languagePackage.faqText);
	htmlSetter("teamText", languagePackage.teamText);
	htmlSetter("donationText", languagePackage.donationText);
	textSetter("howToUseBtn", languagePackage.howToUseText);
	htmlSetter("shortSentenceText", languagePackage.shortSentenceText);
	htmlSetter("longSentenceText", languagePackage.longSentenceText);
	textSetter("faqTextKeep", languagePackage.faqText);
	

});
