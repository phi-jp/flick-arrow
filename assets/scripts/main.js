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


var HOME_COLOR = "hsl(60, 90%, 50%)";
var MAIN_FONT = "KaushanScript";
var QUESTION_TABLE = {
    0: ['blue'],
    8: ['blue', 'blue', 'red'],
    16: ['blue', 'red'],
    24: ['blue', 'blue', 'blue', 'red', 'red', 'green'],
    32: ['blue', 'red', 'green'],
};
var FONT_CODE = {
  play: String.fromCharCode('0xf04b'),
  home: String.fromCharCode('0xf015'),
  comment: String.fromCharCode('0xf075'),
  apple: String.fromCharCode('0xf179'),
  android: String.fromCharCode('0xf17b'),
  trophy: String.fromCharCode('0xf091'),
  gamepad: String.fromCharCode('0xf11b'),
  shareAlt: String.fromCharCode('0xf1e0'),
  buysellads: String.fromCharCode('0xf20d'),
  pause: String.fromCharCode('0xf04c'),
  apple: String.fromCharCode('0xf179'),
  thumbsUp: String.fromCharCode('0xf164'),

  arrowRight: String.fromCharCode('0xf061'),
  longArrowRight: String.fromCharCode('0xf178'),
  handORight: String.fromCharCode('0xf0a4'),
  angleRight: String.fromCharCode('0xf106'),
};

var WEB_SITE    = 'http://flickarrow.phinajs.com/';
var APP_URL     = "https://itunes.apple.com/us/app/flick-arrow/id978643804?mt=8";
var ITUNES_URL  = "itms-apps://itunes.apple.com/app/id978643804";
var TITLE_TWEET = "『FlickArrow』 - 誰よりも速く, そして正確なフリックを...";
var RESULT_URL  = TITLE_TWEET + " SCORE: {score} flick";
var HASH_TAGS   = 'phina_js,FlickArrow';

// for cordova
var BOARD_ID = "flickarrow_score_board";
var NEND_BANNER_API_KEY = '8f4af98e1d2fb9ae6eb704f8182731a9c2bc1c67';
var NEND_BANNER_SPOT_ID = '497147';
var NEND_INTERSTITIAL_API_KEY = 'b41a30d6ce3eb4a1a34ae36c04636792b254bf68';
var NEND_INTERSTITIAL_SPOT_ID = '497174';


var NOW = Date.now();

var ASSETS = {
  script: {
    elements: 'assets/scripts/elements.js?' + NOW,
    titlescene: 'assets/scripts/scenes/title.js?' + NOW,
    mainscene: 'assets/scripts/scenes/main.js?' + NOW,
    pausescene: 'assets/scripts/scenes/pause.js?' + NOW,
    resultscene: 'assets/scripts/scenes/result.js?' + NOW,
  },
  image: {
    arrow: 'assets/images/arrow0.png',
    title: 'assets/images/title.png',
  },
  sound: {
    touch: 'assets/sounds/fm006.m4a',
    pinpon: 'assets/sounds/pinpon.mp3',
    boo: 'assets/sounds/boo.mp3',
    warp: 'assets/sounds/power16.m4a',

    // bgm: 'assets/sounds/bgm.m4a',
    bgm_title: 'assets/sounds/bgm/title.m4a',
    bgm_game: 'assets/sounds/bgm/game.m4a',

  },
  font: {
    FontAwesome: 'http://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/fonts/fontawesome-webfont.ttf',
    // KaushanScript: 'assets/fonts/kaushan-script/KaushanScript-Regular.otf',
  }
};


phina.main(function() {
  init();
});

var init = function() {
  var app = GameApp({
    startLabel: location.search.substr(1).toObject().scene || 'title',
    assets: ASSETS,
  });
  document.body.appendChild( app.domElement );

  app.backgroundColor = BACKGROUND_COLOR;
  // app.enableStats();

  app.run();

  hybrid.on('pause', function() {
    SoundManager.pauseMusic();
  });
  hybrid.on('resume', function() {
    SoundManager.resumeMusic();
  });
};


hybrid.showBanner = function() {
  if (!cordova) return ;

  if (device.platform === 'Android') {
    hybrid.admob.showBanner();
  }
  else {
    hybrid.nend.showBanner();
  }
};


hybrid.showInterstitial = function() {
  if (!cordova) return ;

  if (device.platform === 'Android') {
    hybrid.admob.showInterstitial();
  }
  else {
    hybrid.nend.showInterstitial();
  }
};

hybrid.on('deviceready', function() {
  // setup admob
  hybrid.admob.init({
    ios: {
      banner: 'ca-app-pub-1611962793956940/2978822116',
      interstitial: 'ca-app-pub-1611962793956940/4455555319'
    },
    android: {
      banner: 'ca-app-pub-1611962793956940/2978822116',
      interstitial: 'ca-app-pub-1611962793956940/4455555319'
    },
  })
  // setup nend
  hybrid.nend.createBanner(NEND_BANNER_API_KEY, NEND_BANNER_SPOT_ID);
  hybrid.nend.createInterstitial(NEND_INTERSTITIAL_API_KEY, NEND_INTERSTITIAL_SPOT_ID);

  // show banner
  hybrid.showBanner();
});


