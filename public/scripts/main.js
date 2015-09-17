/*
 *
 */

phina.globalize();

/*
 * constant.js
 */
var SCREEN_WIDTH    = 640;              // スクリーン幅
var SCREEN_HEIGHT   = 960;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分
var SCREEN_CENTER   = Vector2(SCREEN_CENTER_X, SCREEN_CENTER_Y);
var SCREEN_RECT     = Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

var TARGET = 'release';
var TITLE = "Flick Arrow";
var BACKGROUND_COLOR = 'rgb(248, 248, 248)';
var TIME = 30*1000; // 50flick/20sec はいける!
var PENALTY = 2*1000;
var MAX_RECOVERY = 2*1000; // 回復量のマックス値

var BASE_PATH = window.cordovaFlag ? 'http://junk.tmlife.net/flick-arrow/' : "./";
var HOME_COLOR = "hsl(60, 90%, 50%)";
var MAIN_FONT = "Kaushan Script";
var BOARD_ID = "board_normal";
var FONT_CODE = {
    play: '0xf04b',
    home: '0xf015',
    comment: '0xf075',
    apple: '0xf179',
    android: '0xf17b',
    trophy: '0xf091',
    gamepad: '0xf11b',
    shareAlt: '0xf1e0',
    buysellads: '0xf20d',
    pause: '0xf04c',
    apple: '0xf179',

    arrowRight: '0xf061',
    longArrowRight: '0xf178',
    handORight: '0xf0a4',
    angleRight: '0xf106',
};
var APP_URL = "https://itunes.apple.com/us/app/flick-arrow/id978643804?l=ja&ls=1&mt=8";
var ITUNES_URL = "itms-apps://itunes.apple.com/app/id978643804";
var TITLE_TWEET = "『FlickArrow』超簡単♪ 矢印をフリックするだけのカジュアルゲーム";
var RESULT_URL = TITLE_TWEET + " SCORE: {score} flick";


window.onload = function() {
  var flow = AssetLoader().load({
    script: {
      titlescene: 'scripts/scenes/title.js',
      // mainscene: 'scripts/scenes/main.js',
      // resultscene: 'scripts/scenes/result.js',
      // piece: 'scripts/elements/piece.js',
    },
  });

  flow.then(function() {
    init();
  });
};

var init = function() {
  var app = GameApp({
    query: '#world',
    startLabel: location.search.substr(1).toObject().scene || 'title',
  });

  app.enableStats();

  app.run();
};
