/*
 * constant.js
 */

var SCREEN_WIDTH    = 640;              // スクリーン幅
var SCREEN_HEIGHT   = 960;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分
var SCREEN_CENTER   = tm.geom.Vector2(SCREEN_CENTER_X, SCREEN_CENTER_Y);
var SCREEN_RECT     = tm.geom.Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

var TITLE = "Arrow Flick";
var TIME = 2*1000;
var PENALTY = 2*1000;

var BASE_PATH = window.cordovaFlag ? 'http://junk.tmlife.net/arrow-flick/' : "./";
var HOME_COLOR = "hsl(60, 100%, 50%)";
var MAIN_FONT = "Gloria Hallelujah";
var MAIN_FONT = "Kaushan Script";
var SUB_FONT = "Open Sans";

var QUERY = tm.util.QueryString.parse(location.search.substr(1));
QUERY.$safe({
    "scene": "title",
    "level": 0,
});

var ASSETS = {
	"images/arrow0": BASE_PATH + "images/arrow0.png",
	"images/arrow1": BASE_PATH + "images/arrow1.png",
	"sounds/bgm": BASE_PATH + "sounds/bgm.wav",
	"sounds/pinpon": BASE_PATH + "sounds/pinpon.mp3",
	"sounds/boo": BASE_PATH + "sounds/boo.mp3",

    // "fonts/fontello": BASE_PATH + "fonts/fontello/font/share.woff",
};


var isNative = function() {
    return window.cordovaFlag === true;
};

var showAd = function() {
    if (window.cordovaFlag) {
        if(window.AdMob) {
            AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:true} );
        }
    }
};

document.addEventListener('onInterstitialLeaveApp', function(){
    // 広告を押した際のコールバック
    // TODO: ライフ回復
    alert('hoge2');
});

document.addEventListener('onInterstitialDismiss', function(){
    // 広告を閉じた際のコールバック
    // alert('onInterstitialDismiss');
    // AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
});


var UserData = {
    init: function(strong) {
        var defaults = {
            life: 5,
            bestScore: 0,
        };

        var data = this.get();

        if (strong) {
            data.$extend(defaults);
        }
        else {
            data.$safe(defaults);
        }

        this.set(data);
    },
    get: function() {
        var key = location.pathname.toCRC32();
        var data = localStorage.getItem(key);
        return (data) ? JSON.parse(data) : {};
    },
    set: function(data) {
        var key = location.pathname.toCRC32();
        var dataString = JSON.stringify(data);
        localStorage.setItem(key, dataString);
        return this;
    },

    hasLife: function() {
        var data = this.get();
        return data.life >= 1;
    },
};

// ユーザーデータ初期化
(function() {
    UserData.init();
})();

