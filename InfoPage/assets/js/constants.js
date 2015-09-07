// Language Constants
// 繁體中文
var znTwHome = "主頁";
var znTwHowToUseText = "使用教學";
var znTwFaqText = "FAQ";
var znTwTeamText = "關於我們";
var znTwDonationText = "贊助";
var znTwShortSentenceText = "在影片中推文吧!";
var znTwLongSentenceText = "支援所有html5影片 (iFrame除外)";
var znTwStep1Text = "在html5影片中按右鍵";
var znTwStep2Text = "在Twidéo的主視窗發送評論吧!";
var znTwStep1img = "en_1.jpg";
var znTwStep2img = "ch_2.jpg";
var znTwFaqQ1Text = "Q: 為什麼按了右鍵沒有出現選單?";
var znTwFaqA1Text = "A: 如果影片是Flash的話，很可惜他已經不被支援了。如果是html5，那麼他一定是用了iFrame嵌入影片，如果是youtube的話，請連結到原本的youtube頁面發表評論。";
var znTwFaqQ2Text = "Q: 為什麼統計數據沒有更新?";
var znTwFaqA2Text = "A: 請關掉Twidéo主視窗並重新開啟一次。";
var znTwWhyNeedDonate = "為什麼我們需要贊助?";
var znTwWhyNeedDonateContent = "我們使用amazon的服務來儲存影片的評論，只要超過了使用流量限制，amazon就會開始收費。所以我們需要你的幫忙，幫助我們可以維護這套服務，感謝您!";

//簡體中文
var znChHome = "主页";
var znChHowToUseText = "使用教学";
var znChFaqText = "FAQ";
var znChTeamText = "关于我们";
var znChDonationText = "贊助";
var znChShortSentenceText = "在影片中发弹幕吧!";
var znChLongSentenceText = "支援所有html5影片 (iFrame除外)";
var znChStep1Text = "在html5影片中按右键";
var znChStep2Text = "在Twidéo的主视窗发弹幕吧!";
var znChStep1img = "ch_1.jpg";
var znChStep2img = "ch_2.jpg";
var znChFaqQ1Text = "Q: 为什麽按了右键没有出现选单?";
var znChFaqA1Text = "A: 如果影片是Flash的话，很可惜他已经不被支援了。如果是html5，那麽他一定是用了iFrame嵌入影片，如果是youtube的话，请连结到原本的youtube页面发表评论。";
var znChFaqQ2Text = "Q: 为什麽统计数据没有更新?";
var znChFaqA2Text = "A: 请关掉Twidéo主视窗并重新开启一次。";
var znChWhyNeedDonate = "为什麽我们需要贊助?";
var znChWhyNeedDonateContent = "我们使用amazon的服务来储存影片的弹幕，只要超过了使用流量限制，amazon就会开始收费。所以我们需要你的帮忙，帮助我们可以维护这套服务，感谢您!";



// 日本語
var jpHome = "ホーム";
var jpHowToUseText = "使い方";
var jpFaqText = "FAQ";
var jpTeamText = "チーム";
var jpDonationText = "寄付する";
var jpShortSentenceText = "動画でコメントする！";
var jpLongSentenceText = "サポート全てhtml5動画  (iFrame以外)";
var jpStep1Text = "html5動画で右クリック";
var jpStep2Text = "Twidéoのウィンドウを開ける";
var jpStep1img = "en_1.jpg";
var jpStep2img = "en_2.jpg";
var jpFaqQ1Text = "Q: なぜ右クリックして後、メニューが表示されない？";
var jpFaqA1Text = "A: Flashの動画はサポートではない、html5の場合は、このページはiFrame使います";
var jpFaqQ2Text = "Q: どうして統計情報がアップデートしない？";
var jpFaqA2Text = "A: Twidéoのウィンドウ再起動してください。";
var jpWhyNeedDonate = "どうして私達は寄付を求めるですか?";
var jpWhyNeedDonateContent = "私達はamazonのサービスが使います、ただしネットワーク流量は限界があり、超えてしまったら料金を取られるから、君のサポートが私達のサービスを維持するのことができる、まことにありがとうございます";

// English
var enHome = "Main Page";
var enHowToUseText = "How To Use";
var enFaqText = "FAQ";
var enTeamText = "Team";
var enDonationText = "Donation";
var enShortSentenceText = "Comments on Video!";
var enLongSentenceText = "Support html5 videos (except iFrame)";
var enStep1Text = "Right Click on html5 videos";
var enStep2Text = "Play with Twidéo main window";
var enStep1img = "en_1.jpg";
var enStep2img = "en_2.jpg";
var enFaqQ1Text = "Q: Why there's no context menu shown after I right-click on the video?";
var enFaqA1Text = "A: If the video is Flash, unfortunately it is not supported any more. If the video is html5, then the web-site must used iFrame to display the video which is not supported.";
var enFaqQ2Text = "Q: Why the comment statistic are not updated?";
var enFaqA2Text = "A: Please try to re-open the Twidéo main window.";
var enWhyNeedDonate = "Why we need donation?";
var enWhyNeedDonateContent = "We using amazon’s service which cost us money when data access exceeds it’s limit, so your donation is a great help us to maintain these services.";

var language = "znTw";
//var language = "jp";
//var language = "en";
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
		step1Text : enStep1Text,
		step2Text : enStep2Text,
		step1Jpg : enStep1img,
		step2Jpg : enStep2img,
		faqQ1Text : enFaqQ1Text,
		faqA1Text : enFaqA1Text,
		faqQ2Text : enFaqQ2Text,
		faqA2Text : enFaqA2Text,
		whyNeedDonation : enWhyNeedDonate,
		whyNeedDonationContent : enWhyNeedDonateContent,
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
		step1Text : jpStep1Text,
		step2Text : jpStep2Text,
		step1Jpg : jpStep1img,
		step2Jpg : jpStep2img,
		faqQ1Text : jpFaqQ1Text,
		faqA1Text : jpFaqA1Text,
		faqQ2Text : jpFaqQ2Text,
		faqA2Text : jpFaqA2Text,
		whyNeedDonation : jpWhyNeedDonate,
		whyNeedDonationContent : jpWhyNeedDonateContent,
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
		step1Text : znTwStep1Text,
		step2Text : znTwStep2Text,
		step1Jpg : znTwStep1img,
		step2Jpg : znTwStep2img,
		faqQ1Text : znTwFaqQ1Text,
		faqA1Text : znTwFaqA1Text,
		faqQ2Text : znTwFaqQ2Text,
		faqA2Text : znTwFaqA2Text,
		whyNeedDonation : znTwWhyNeedDonate,
		whyNeedDonationContent : znTwWhyNeedDonateContent,
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
	
	// change paypal donate icon
	var paypalDonateIconPath = chrome.extension.getURL("btn_donateCC_LG.gif")
	$("#paypalDonateIcon").attr("src",paypalDonateIconPath);
	
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
	htmlSetter("step1Text", languagePackage.step1Text);
	htmlSetter("step2Text", languagePackage.step2Text);
	$("#step1Text").css("font-color", "blue");
	$("#tutoral1").attr("src","image/tutorial/"+languagePackage.step1Jpg);
	$("#tutoral2").attr("src","image/tutorial/"+languagePackage.step2Jpg);
	
	htmlSetter("faqQ1Text", languagePackage.faqQ1Text);
	htmlSetter("faqA1Text", languagePackage.faqA1Text);
	$("#faqA1Text").css("font-size", "16px");
	
	htmlSetter("faqQ2Text", languagePackage.faqQ2Text);
	htmlSetter("faqA2Text", languagePackage.faqA2Text);
	$("#faqA2Text").css("font-size", "16px");
	
	htmlSetter("whyNeedDonate", languagePackage.whyNeedDonation);
	htmlSetter("whyNeedDonateContent", languagePackage.whyNeedDonationContent);
	$("#whyNeedDonateContent").css("font-size", "16px");

});
