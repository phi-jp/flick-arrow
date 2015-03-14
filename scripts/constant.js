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
var TIME = 30*1000;
var PENALTY = 2*1000;

var MAIN_FONT = "Gloria Hallelujah";
var MAIN_FONT = "Kaushan Script";
var SUB_FONT = "Open Sans";

var QUERY = tm.util.QueryString.parse(location.search.substr(1));
QUERY.$safe({
    "scene": "title",
    "level": 0,
});

var ASSETS = {
	"images/arrow0": "images/arrow0.png",
	"images/arrow1": "images/arrow1.png",
	"sounds/bgm": "sounds/bgm.wav",
	"sounds/pinpon": "sounds/pinpon.mp3",
	"sounds/boo": "sounds/boo.mp3",

    // "fonts/fontello": "fonts/fontello/font/share.woff",
};

