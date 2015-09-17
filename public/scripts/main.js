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
