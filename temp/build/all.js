/*
 * sound
 */

;(function() {

    if (tm.sound.NullAudio) {
        // すでに定義済みだったら無視
        return ;
    }

    /**
     *
     */
    tm.sound.WebAudio.isSupport = function() {
        return tm.sound.WebAudio.context != null;
    };

    if (tm.sound.WebAudio.isSupport() == true) {
        return ;
    }

    tm.define("tm.sound.NullAudio", {
        
        superClass: "tm.event.EventDispatcher",
        
        src: "",
        loaded: false,
        loopFlag: false,
        volume: 1.0,
        
        init: function(src) {
            this.superInit();
            
            this.loaded = true;
        },
        
        play: function() {
            return this;
        },
        
        stop: function() {
            return this;
        },
        
        setLoop: function(flag) {
            return this;
        },
        
        setVolume: function(volume) {
            return this;
        },
        
        clone: function() {
            var audio = tm.sound.NullAudio(this.src);
            
            return audio;
        },
    });

    tm.asset.Loader.register("m4a", function(path) {
        return tm.sound.NullAudio(path);
    });
    tm.asset.Loader.register("mp3", function(path) {
        return tm.sound.NullAudio(path);
    });
    tm.asset.Loader.register("wav", function(path) {
        return tm.sound.NullAudio(path);
    });
    tm.asset.Loader.register("ogg", function(path) {
        return tm.sound.NullAudio(path);
    });

})();











/*
 * constant.js
 */

var SCREEN_WIDTH    = 640;              // スクリーン幅
var SCREEN_HEIGHT   = 960;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分
var SCREEN_CENTER   = tm.geom.Vector2(SCREEN_CENTER_X, SCREEN_CENTER_Y);
var SCREEN_RECT     = tm.geom.Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

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




var QUESTION_TABLE = {
    0: ['blue'],
    8: ['blue', 'blue', 'red'],
    16: ['blue', 'red'],
    24: ['blue', 'blue', 'blue', 'red', 'red', 'green'],
    32: ['blue', 'red', 'green'],
};

var QUERY = tm.util.QueryString.parse(location.search.substr(1));
QUERY.$safe({
    "scene": "title",
    "level": 0,
});

var ASSETS = {
	"images/arrow0": BASE_PATH + "images/arrow0.png",
	"images/arrow1": BASE_PATH + "images/arrow1.png",
	"sounds/bgm": BASE_PATH + "sounds/bgm.m4a",
	"sounds/pinpon": BASE_PATH + "sounds/pinpon.mp3",
	"sounds/boo": BASE_PATH + "sounds/boo.mp3",

    "sounds/touch": BASE_PATH + "sounds/cursor21.m4a",
    "sounds/touch": BASE_PATH + "sounds/cursor34.m4a",
    "sounds/touch": BASE_PATH + "sounds/fm006.m4a",
    "sounds/warp": BASE_PATH + "sounds/power16.m4a",

    "sounds/bgm/title": BASE_PATH + "sounds/bgm/title.m4a",
    "sounds/bgm/game": BASE_PATH + "sounds/bgm/game.m4a",
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

var clickAdCallback = function() {
    alert('onInterstitialLeaveApp');
};

document.addEventListener('onInterstitialLeaveApp', function(){
    clickAdCallback && clickAdCallback();
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




tm.define("CircleButton", {
    superClass: "tm.display.CanvasElement",

    init: function(param) {
        this.superInit();

        param = param || {};

        param.$safe({
            size: 150,
            text: 'A',
            fontFamily: 'FontAwesome',
            fontColor: "white",
            bgColor: "hsl(180, 60%, 50%)",
            strokeColor: "transparent",
            lineWidth: 4,
        });

        this.fromJSON({
            children: {
                bg: {
                    type: "tm.display.Shape",
                    init: {
                        width: param.size,
                        height: param.size,
                    }
                },
                label: {
                    type: "tm.display.Label",
                    init: param.text,
                    fillStyle: param.fontColor,
                    fontFamily: param.fontFamily,
                    fontSize: param.size/2,
                }
            }
        });

        this.setInteractive(true, "circle");
        this.on("pointingend", function() {
            this.flare('push');
        });

        this.fillFlag = param.fillFlag;

        this.lineWidth = param.lineWidth;
        this.strokeColor = param.strokeColor;
        this.bgColor = param.bgColor;
        this.radius = param.size/2;
        this._render();
    },
    _render: function() {
        var c = this.bg.canvas;
        c.setTransformCenter();
        c.fillStyle = this.bgColor;
        c.fillCircle(0, 0, this.radius);

        c.lineWidth = this.lineWidth;
        c.strokeStyle = this.strokeColor;
        c.strokeCircle(0, 0, this.radius-this.lineWidth/2-1);
    },

    fill: function() {
        this.parent.children.each(function(elm) {
            elm.tweener.clear().fadeOut(200)
        });

        var c = this.bg.canvas;
        this.bg.width = SCREEN_WIDTH;
        this.bg.height= SCREEN_HEIGHT;
        this._render();

        this.setInteractive(false);

        this.label.tweener
            .clear()
            .fadeOut(200)
            ;

        this.tweener
            .clear()
            .wait(300)
            .to({
                x: SCREEN_CENTER_X,
                y: SCREEN_CENTER_Y,
            }, 300, 'easeOutQuint')
            .call(function() {
                tm.asset.Manager.get("sounds/warp").clone().play();
            })
            .to({
                radius: 600,
            }, 500, 'easeOutQuint')
            .call(function() {
                this.flare('filled');
            }, this)
            ;

        this.update = function() {
            this._render();
        };
    },

    blink: function() {
        this.tweener
            .clear()
            .set({alpha:0})
            .wait(100)
            .set({alpha:1})
            .wait(100)
            .set({alpha:0})
            .wait(100)
            .set({alpha:1})
            .wait(100)
            .set({alpha:0})
            .wait(100)
            .set({alpha:1})
            .wait(100)
            .set({alpha:0})
            .wait(100)
            .set({alpha:1})
            .wait(100);
    }
});




tm.define("RankingButton", {
    superClass: "CircleButton",

    init: function(param) {
        this.superInit({
            text: String.fromCharCode(FONT_CODE.trophy),
            bgColor: "hsl(200, 100%, 50%)",
        }.$extend(param));

        this.on('push', function() {
            if (window.gamecenter) {
                var data = {
                    leaderboardId: BOARD_ID
                };
                gamecenter.showLeaderboard(null, null, data);
            }
            else {
                console.log('show gamecenter');
            }
        });
    },
});


tm.define("AdButton", {
    superClass: "CircleButton",

    init: function(param) {
        this.superInit({
            text: String.fromCharCode(FONT_CODE.buysellads),
            bgColor: "hsl(0, 100%, 64%)",
        }.$extend(param));

        this.on('push', this._showAd);
    },

    _showAd: function() {
        clickAdCallback = function() {
            this.flare('aded');
        }.bind(this);

        showAd();
    },
});

tm.define("AppleButton", {
    superClass: "CircleButton",

    init: function(param) {
        this.superInit({
            text: String.fromCharCode(FONT_CODE.apple),
            bgColor: "hsl(0, 100%, 64%)",
        }.$extend(param));

        this.on('click', this._open);
    },

    _open: function() {
        window.open(ITUNES_URL);
    },
});

tm.define("ShareButton", {
    superClass: "CircleButton",

    init: function(param) {
        this.superInit({
            text: String.fromCharCode(FONT_CODE.comment),
            bgColor: "hsl(240, 100%, 64%)",
        }.$extend(param));

        this.message = param.message;
        this.url = param.url || "http://twitter.com/phi_jp";
        this.on('push', this._share);
    },

    _share: function() {
        var text = this.message;

        if (isNative()) {
            var message = {
                text: text + " #FlickArrow #tmlib",
                activityTypes: ['PostToFacebook'],
                // activityTypes: ["PostToFacebook", "PostToTwitter", "PostToWeibo", "Message", "Mail", "Print", "CopyToPasteboard", "AssignToContact", "SaveToCameraRoll", "AddToReadingList", "PostToFlickr", "PostToVimeo", "TencentWeibo", "AirDrop"];
                activityTypes: ["Message", "Mail", "PostToFacebook", "PostToTwitter"],
                url: this.url,
            };
            window.socialmessage.send(message);
            this.flare('shared');
        }
        else {
            var twitterURL = tm.social.Twitter.createURL({
                type    : "tweet",
                text    : text,
                hashtags: "FlickArrow,tmlib",
                url     : this.url,
            });
            var win = window.open(twitterURL, 'share window', 'width=400, height=300');
            var timer = setInterval(function() {   
                if(win.closed) {
                    this.flare('shared');
                    clearInterval(timer);  
                }
            }.bind(this), 100);
        }

    },
});

tm.define("PauseButton", {
    superClass: "CircleButton",

    init: function(param) {
        this.superInit({
            text: String.fromCharCode(FONT_CODE.pause),
            bgColor: "hsl(0, 0%, 50%)",
        }.$extend(param));
    },
});

tm.define("PlayButton", {
    superClass: "CircleButton",

    init: function(param) {
        this.superInit({
            text: String.fromCharCode(FONT_CODE.play),
        }.$extend(param));
    },
});

tm.define("HomeButton", {
    superClass: "CircleButton",

    init: function(param) {
        this.superInit({
            text: String.fromCharCode(FONT_CODE.home),
            bgColor: HOME_COLOR,
        }.$extend(param));
    },
});



tm.define("Life", {
    superClass: "tm.display.CanvasElement",

    init: function() {
        this.superInit();

        var data = UserData.get();

        this.backGroup = tm.display.CanvasElement().addChildTo(this);
        this.frontGroup = tm.display.CanvasElement().addChildTo(this);
        (5).times(function(i) {
            var h = tm.display.HeartShape({
                width: 40,
                height: 40,
                fillStyle: "gray",
            }).addChildTo(this.backGroup);
            h.x = i*70;
            h.y = 0;
        }, this);
        (5).times(function(i) {
            var h = tm.display.HeartShape({
                width: 40,
                height: 40,
            }).addChildTo(this.frontGroup);
            h.x = i*70;
            h.y = 0;

            h.hide();

            if (data.life>i) {
                h.show();
            }
        }, this);
    },
    decriment: function() {
        var data = UserData.get();
        data.life--;
        UserData.set(data);

        var hearts = this.frontGroup.children;
        hearts[data.life].tweener
            .clear()
            .by({
                y: -100,
                alpha: -1,
            }, 200)
            .call(function() {
                this.flare('decrimented');
            }, this)
            ;
    },

    recovery: function() {
        var data = UserData.get();
        var fronts = this.frontGroup.children;

        (5-data.life).times(function(i) {
            var h = fronts[data.life+i];

            h.show();
            h.alpha = 0;
            h.scale.set(2, 2);

            h.tweener
                .clear()
                .wait(i*250)
                .to({
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1,
                }, 500)
                ;
        }, this);

        data.life = 5;
        UserData.set(data);
    },

});

tm.define("WaveEffect", {
    superClass: "tm.display.CircleShape",

    init: function() {
        this.superInit({
            fillStyle: "white",
            strokeStyle: "transparent",
        });

        this.tweener.to({
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
        }, 250).call(function() {
            this.remove();
        }, this);

        tm.asset.Manager.get("sounds/touch").clone().play();
    }
});






tm.define("TitleScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        // grid
        this.width = SCREEN_WIDTH;
        this.height = SCREEN_HEIGHT;
        this.col = 12; // x
        this.row = 12; // y

        this.fromJSON({
            children: {
                bg: {
                    type: "tm.display.Shape",
                    init: {
                        width: SCREEN_WIDTH,
                        height: SCREEN_HEIGHT,
                        bgColor: BACKGROUND_COLOR,
                    },
                    originX: 0,
                    originY: 0,
                },
                titleLabel: {
                    type: "tm.display.Label",
                    text: TITLE,
                    fillStyle: "#222",
                    fontFamily: MAIN_FONT,
                    fontSize: 112,
                    x: this.gridX(6),
                    y: this.gridY(2),
                },
                // ライフ
                life: {
                    type: "Life",
                    x: 180,
                    y: this.gridY(5),
                },

                playButton: {
                    type: "PlayButton",
                    init: {
                        size: this.gridX(3),
                    },
                    x: this.gridX(6),
                    y: this.gridY(7),
                },

                // シェアボタン
                shareButton: {
                    type: "ShareButton",
                    init: {
                        size: this.gridX(2),
                        message: TITLE_TWEET,
                        url: APP_URL,
                    },
                    x: this.gridX(3),
                    y: this.gridY(9),
                },

                rankButton: {
                    type: "RankingButton",
                    init: { size: this.gridX(2), },
                    x: this.gridX(6),
                    y: this.gridY(10),
                },
                storeButton: {
                    type: "AppleButton",
                    init: {
                        size: this.gridX(2),
                    },
                    x: this.gridX(9),
                    y: this.gridY(9),
                },

            },
        });

        var data = UserData.get();

        this.playButton.onpush = function() {
            if (UserData.hasLife()) {
                if (TARGET === 'release') {
                    // ライフを減らすやつ
                    this.life.ondecrimented = function() {
                        this.playButton.fill();
                    }.bind(this);
                    this.life.decriment();
                }
                else {
                    this.playButton.fill();
                }

            }
            else {
                this.shareButton.blink();
                this.storeButton.blink();
            }
        }.bind(this);
        this.playButton.onfilled = function() {
            this.app.popScene();
        }.bind(this);

        this.storeButton.onpush = function() {
            this.life.recovery();
        }.bind(this);

        this.shareButton.onshared = function() {
            this.life.recovery();
        }.bind(this);

        this.bgm = tm.asset.Manager.get("sounds/bgm/title").clone().setVolume(0.5).setLoop(true);
        this.bgm.play();
    },

    onenter: function() {
        CircleFilterEffect({
            color: HOME_COLOR,
        }).addChildTo(this);
    },
    onexit: function() {
        this.bgm.stop();
    },

    onpointingstart: function(e) {
        var p = e.app.pointing;
        WaveEffect().addChildTo(this).setPosition(p.x, p.y);
    },

    gridX: function(i) {
        i+=this.col;
        i%=this.col;
        return (this.width/this.col)*i;
    },
    gridY: function(i) {
        return (this.height/this.row)*i;
    },

    update: function(app) {
        if (app.keyboard.getKey('space')) {
            this.app.popScene();
        }
    },

});

// シーンを定義
tm.define("GameScene", {
    superClass: "tm.app.Scene",
    
    init: function(param) {
        this.superInit();
        
        this.fromJSON({
            children: {
                shapeGauge: {
                    type: "ShapeGauge",
                },
            	stage: {
            		type: "tm.display.CanvasElement",
            	},
                arrowGroup: {
                    type: "tm.display.CanvasElement",
                },
                ui: {
                    type: "tm.display.CanvasElement",
                },
            }
        });

        this.ui.fromJSON({
            children: {
                scoreLabel: {
                    type: "tm.display.Label",
                    x: SCREEN_CENTER_X,
                    y: 115,
                    fillStyle: "#444",
                    fontSize: 64,
                    text: '0',
                },
                pauseButton: {
                    type: "PauseButton",
                    init: {
                        size: 60,
                    },
                    x: 590,
                    y: 50,
                },
            },
        });

        this.score = 0;
        this.combo = 0;
        this.timer = 0;
        this.limitTime = TIME;
        this.xList = [];
        this.yList = [];

        this.setupArrow();

        this.ui.pauseButton.onpush = function() {
            this.pause();
        }.bind(this);

        this.bgm = tm.asset.Manager.get("sounds/bgm/game").clone().setLoop(true);
        this.bgm.play();
    },

    onenter: function() {
        // // debug:
        // this.setQuestion();
        // return ;

        // 
        CircleFilterEffect().addChildTo(this);

        var scene = tm.game.CountScene();
        this.app.pushScene(scene);

        scene.onexit = function() {

            this.setQuestion();
        }.bind(this);
    },

    onexit: function() {
        this.bgm.stop();
    },

    createArrow: function(i) {
        var type = ['blue', 'blue', 'red', 'green'].pickup();
        var type = this.getArrowType();
        var direction = ['left', 'right', 'up', 'down'].pickup();
        var arrow = Arrow({
            type: type,
            direction: direction
        });
        arrow.x = 95 + i*110;
        arrow.y = 280;
        arrow.scaleX = 0.4;
        arrow.scaleY = 0.4;

        return arrow;
    },

    getArrowType: function() {
    	var score = this.score;
    	var table = QUESTION_TABLE[0];
    	Object.keys(QUESTION_TABLE).some(function(value) {
    		if (score <= value) {
    			return true;
    		}
			table = QUESTION_TABLE[value];
    	});

    	return table.pickup();
    },

    setupArrow: function() {
        (5).times(function(i) {
            var a = this.createArrow(i).addChildTo(this.arrowGroup);
        }, this);
    },

    // 補充
    fillArrow: function() {
        var a = this.createArrow(5).addChildTo(this.arrowGroup);

        var arrows = this.arrowGroup.children;

        arrows.each(function(arrow, i) {
            arrow.tweener
                .clear()
                .to({
                    x: 95 + i*110,
                    y: 280,
                }, 100)
                ;
        });
    },

    getArrow: function() {
        return this.stage.addChild(this.arrowGroup.children.first);
    },

    setQuestion: function() {
        var arrow = this.getArrow();
        arrow.appear(SCREEN_CENTER_X, SCREEN_CENTER_Y+120);
        this.arrow = arrow;

        // 補充
        this.fillArrow();
    },

    update: function(app) {
        var d = this.getFlickDirection(app);

        this.addTime(app.deltaTime);

        // support keyboard
        if (!d) {
            d = this.getKeyDirection(app);
        }

        if (d) {
            if (this.arrow.check(d)) {
                this.arrow.disappear(d);
                this.addScore(1);
                tm.asset.Manager.get("sounds/pinpon").clone().play();

                this.setQuestion();

                // ボーナス
                this.combo++;
                if (this.combo % 10 === 0) {
                	var time = (this.combo * this.combo);
                	time = Math.min(MAX_RECOVERY, time);
                	this.addTime(-time);
                }
            }
            else {
                this.arrow.move(SCREEN_CENTER_X, SCREEN_CENTER_Y+120);
                this.arrow.blink();
                tm.asset.Manager.get("sounds/boo").clone().play();

                // penalty
                this.addTime(PENALTY);
                
                this.combo = 0;
            }
        }

        if (this.isTimeup()) {

            this.gameover();
        }
    },

    gameover: function() {
        var app = this.app;
        this.nextLabel = 'game';

        var s = ResultScene({
            score: this.score,
            bgColor: 'rgba(255, 255, 255, 0.95)',
        });
        s.onexit = function() {
            this.nextLabel = s.nextLabel;
            app.popScene();
        }.bind(this);
        app.pushScene(s);
    },

    getFlickDirection: function(app) {
        var p = app.pointing;

        if (p.getPointing()) {
            this.xList.push(p.dx);
            if (this.xList.length > 10) this.xList.shift();
            this.yList.push(p.dy);
            if (this.yList.length > 10) this.yList.shift();

            this.arrow.x += p.dx*0.5;
            this.arrow.y += p.dy*0.5;
        }

        if (p.getPointingEnd() == true) {
            var delta = tm.geom.Vector2();

            delta.x = this.xList.average();
            delta.y = this.yList.average();

            this.xList.clear();
            this.yList.clear();

            var len = delta.lengthSquared();
            if (len > 2) {
                if (Math.abs(delta.x) > Math.abs(delta.y)) {
                    if (delta.x < 0) {
                        return "left";
                    }
                    else {
                        return "right";
                    }
                }
                else {
                    if (delta.y < 0) {
                        return "up";
                    }
                    else {
                        return "down";
                    }
                }
            }
        }

        return null;
    },

    getKeyDirection: function(app) {
        var key = app.keyboard;

        if (key.getKeyUp('left')) { return "left"; }
        else if (key.getKeyUp('right')) { return "right"; }
        else if (key.getKeyUp('up')) { return "up"; }
        else if (key.getKeyUp('down')) { return "down"; }

        return null;
    },

    addScore: function(point) {
        this.score += point;
        this.ui.scoreLabel.text = this.score;
    },

    addTime: function(time) {
        this.timer += time;
        this.shapeGauge.setValue( this.timer/(this.limitTime) );
    },

    isTimeup: function() {
        return this.timer >= this.limitTime;
    },

    pause: function() {
        var app = this.app;

        var s = PauseScene({
            score: this.score,
            bgColor: 'rgba(0, 0, 0, 0.95)',
        });
        s.onexit = function() {
            if (s.nextLabel === 'title') {
                this.nextLabel = 'title';
                app.popScene();
            }
        }.bind(this);
        app.pushScene(s);
    },

});



tm.define("Arrow", {
    superClass: "tm.display.CircleShape",

    init: function(param) {
        this.direction = param.direction;
        this.type = param.type || "blue";

        var color = {
            'red': 'hsla(0, 80%, 65%, 1.0)',
            'green': 'hsla(120, 80%, 65%, 1.0)',
            'blue': 'hsla(240, 80%, 65%, 1.0)',
        }[this.type];

        this.superInit({
            width: 256,
            height: 256,
            strokeStyle: "white",
            strokeStyle: "transparent",
            fillStyle: color,
            lineWidth: 8,
        });

        this.fromJSON({
            children: {
            	arrow: {
            		type: "tm.display.Sprite",
            		init: "images/arrow0",
            		width: 200,
            		height: 200,
                    rotation: {
                        'left': 180,
                        'right': 0,
                        'up': -90,
                        'down': 90,
                    }[this.direction],
            	},
            	/*
                arrow: {
                    type: "tm.display.Label",
                    init: String.fromCharCode(FONT_CODE.longArrowRight),
                    fontSize: 150,
                    fontFamily: 'FontAwesome',
                    rotation: {
                        'left': 180,
                        'right': 0,
                        'up': -90,
                        'down': 90,
                    }[this.direction],
                },
                */
            },
        });

        // this.appear();
    },

    check: function(direction) {
        if (this.type == "blue") {
            return this.direction == direction;
        }
        else if (this.type == "red") {
            return {
                'left': 'right',
                'right': 'left',
                'up': 'down',
                'down': 'up',
            }[this.direction] == direction;
        }
        else if (this.type == "green") {
            return {
                'left': ['up', 'down'],
                'right': ['up', 'down'],
                'up': ['left', 'right'],
                'down': ['left', 'right'],
            }[this.direction].indexOf(direction) != -1;
        }
    },

    appear: function(x, y) {
        this.scale.set(0.5, 0.5);

        this.tweener
            .clear()
            .to({
                x: x, y: y,
                scaleX: 1, scaleY: 1,

            }, 500, "easeOutCubic")
            ;
    },

    disappear: function(direction) {
        var v = {
            'left': [-1, 0],
            'right': [1, 0],
            'up': [0,-1],
            'down': [0,1],
        }[direction];

        this.tweener
            .clear()
            .by({
                x: v[0] * 400,
                y: v[1] * 400,
                alpha: -1,
            }, 200)
            .call(function() {
                this.remove();
            }, this)
            ;
    },

    move: function(x, y) {
        var tweener = tm.app.Tweener(this).addChildTo(this);

        tweener
            .move(x, y, 500, "easeOutElastic")
            .call(function() {
                tweener.remove();
            })
            ;
    },

    blink: function() {
        this.tweener
            .clear()
            .to({
                scaleX: 1, scaleY: 1,
            }, 1000, "easeOutElastic")
            ;

        this.tweener.clear();

        (3).times(function() {
            this.tweener
                .set({alpha:0})
                .wait(30)
                .set({alpha:1})
                .wait(70)
        }, this);
    }
});


/*
 * 最初の円のフィルター
 */
tm.define("CircleFilterEffect", {
    superClass: "tm.display.Shape",

    init: function(param) {
        param = param || {};
        param.$safe({
            color: "hsl(180, 60%, 50%)",
        });

        this.superInit({
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
        });

        this.origin.set(0, 0);

        var c = this.canvas;

        c.clearColor(param.color);
        c.setTransformCenter();

        this.circleRadius = 0;
        this.tweener.to({
            circleRadius: 1000,
        });
    },

    update: function() {
        var c = this.canvas;

        c.globalCompositeOperation = "destination-out";
        c.fillCircle(0, 0, this.circleRadius);
    },
});




tm.define("ShapeGauge", {
    superClass: "tm.display.Shape",

    init: function() {
        this.superInit({
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            bgColor: "hsla(0, 0%, 80%, 0.5)",
        });

        this.origin.y = 1;
        this.setPosition(SCREEN_CENTER_X, SCREEN_HEIGHT);

        this.value = 0;
    },

    update: function() {
        if (this.value >= 0.9) {
            var rate = 1-((1.0-this.value)/0.1);
            var s = rate*100;
            var color = "hsla(0, {0}%, 80%, 0.5)".format(s);
            this.bgColor = color;
        }
    },

    setValue: function(rate) {
        this.value = Math.clamp(rate, 0, 1);
        this.scaleY = this.value;
    },
});



tm.define("FadeScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        this.fromJSON({
            children: {
                filiter: {
                    type: "tm.display.Shape",
                    init: {
                        width: SCREEN_WIDTH,
                        height: SCREEN_HEIGHT,
                        bgColor: "white",
                        alpha: 0,
                    },
                    originX: 0,
                    originY: 0,
                    blendMode: "lighter",
                }
            }
        });

        this.filiter.tweener.fadeIn(1000)
            .wait(500)
                .call(function() {
                this.app.popScene();
            }, this);
    },
});














/*
 * ResultScene
 */

tm.define("ResultScene", {
    superClass: "tm.app.Scene",

    init: function(param) {
        this.superInit();

        tm.scene.ResultScene.default.score = 0;
        param = {}.$extend(tm.scene.ResultScene.default, param);
        this.param = param;

        var userData = UserData.get();
        var bestScore = (userData.bestScore) ? userData.bestScore : 0;
        var highScoreFlag = (param.score > bestScore);

        if (param.record) {
            if (highScoreFlag) {
                userData.bestScore = param.score;

                UserData.set(userData);
            }
        }

        this.fromJSON({
            children: {
                bg: {
                    type: "tm.display.RectangleShape",
                    init: {
                        width: param.width,
                        height: param.height,
                        fillStyle: param.bgColor,
                        strokeStyle: "transparent",
                    },
                    originX: 0,
                    originY: 0,
                },
                stage: {
                    type: "tm.display.CanvasElement",
                },
            }
        });

        var baseLabelParam = {
            type: "Label",
            fillStyle: param.fontColor,
            fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
        };

        // setup tweet
        var text = RESULT_URL.format(param);

        this.stage.fromJSON({
            children: {
                scoreText: baseLabelParam.$extend({
                    text: "score",
                    x: this.gridX(4),
                    y: this.gridY(2),
                    fontSize: param.fontSize*0.5,
                }),
                scoreLabel: {
                    type: "Label",
                    text: param.score,
                    x: this.gridX(4),
                    y: this.gridY(3),
                    fillStyle: param.fontColor,
                    fontSize: param.fontSize,
                    fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                },
                bestText: {
                    type: "Label",
                    text: "best",
                    x: this.gridX(8),
                    y: this.gridY(2),
                    fillStyle: param.fontColor,
                    fontSize: param.fontSize*0.5,
                    fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                },
                bestLabel: {
                    type: "Label",
                    text: bestScore,
                    x: this.gridX(8),
                    y: this.gridY(3),
                    fillStyle: param.fontColor,
                    fontSize: param.fontSize,
                    fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                },
                // ライフ
                life: {
                    type: "Life",
                    x: 180,
                    y: this.gridY(5),
                },

                newRecordText: {
                    type: "Label",
                    text: "new record!",
                    x: this.gridX(6),
                    y: this.gridY(4),
                    fillStyle: param.fontColor,
                    fontSize: param.fontSize*0.5,
                    fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                    visible: false,
                },

                homeButton: {
                    type: "HomeButton",
                    init: {
                        size: this.gridX(3),
                    },
                    x: this.gridX(6),
                    y: this.gridY(7),
                },

                // シェアボタン
                shareButton: {
                    type: "ShareButton",
                    init: {
                        size: this.gridX(2),
                        message: text,
                        url: APP_URL,
                    },
                    x: this.gridX(3),
                    y: this.gridY(9),
                },

                rankButton: {
                    type: "RankingButton",
                    init: { size: this.gridX(2), },
                    x: this.gridX(6),
                    y: this.gridY(10),
                },
                storeButton: {
                    type: "AppleButton",
                    init: {
                        size: this.gridX(2),
                    },
                    x: this.gridX(9),
                    y: this.gridY(9),
                },
            }
        });

        // setup
        var life = this.stage.life;
        var homeButton = this.stage.homeButton;
        var shareButton = this.stage.shareButton;
        var storeButton = this.stage.storeButton;
        homeButton.onpush = function() {
            homeButton.fill();
        }.bind(this);
        homeButton.onfilled = this._toHome.bind(this);

        storeButton.onpush = function() {
            life.recovery();
        }.bind(this);
        
        shareButton.onshared = function() {
            life.recovery();
        }.bind(this);

        // setup record
        if (highScoreFlag) {
            this.stage.newRecordText.show();
            this.stage.newRecordText.tweener
                .set({alpha:0.0})
                .fadeIn(2000)
                .setLoop(true)
                ;

        }

        // gamecenter にスコアを送る
        this.sendHighScore(userData.bestScore);
        
        // fade
        this.bg.alpha = 0;
        this.bg.tweener.wait(100).fadeIn(200);
        this.stage.alpha = 0;
        this.stage.children.each(function(elm) { elm.sleep(); });
        this.stage.tweener
            .wait(500)
            .call(function() {
                this.stage.children.each(function(elm) { elm.wakeUp(); });
            }, this)
            .fadeIn(200);

        if (tm.util.Random.randbool()) {
            showAd();
        }
    },

    sendHighScore: function(score) {
        if (window.gamecenter) {
            var data = {
                score: score,
                leaderboardId: BOARD_ID,
            };

            gamecenter.submitScore(function() {
                // alert('success');
            }, function() {
                // alert('failure');
            }, data);
        }
    },

    onpointingstart: function(e) {
        var p = e.app.pointing;
        WaveEffect().addChildTo(this).setPosition(p.x, p.y);
    },

    gridX: function(index) {
        return this.param.width/12*index;
    },

    gridY: function(index) {
        return this.param.height/12*index;
    },

    _toHome: function() {
        this.nextLabel = 'title';
        this.app.popScene();
    },
});


/*
 * PauseScene
 */


tm.define("PauseScene", {
    superClass: "tm.app.Scene",

    init: function(param) {
        this.superInit();

        param = {
        	bgColor: 'rgba(0, 0, 0, 0.95)',
        }.$extend(param);

        this.fromJSON({
            children: {
                bg: {
                    type: "tm.display.RectangleShape",
                    init: {
                        width: SCREEN_WIDTH,
                        height: SCREEN_HEIGHT,
                        fillStyle: param.bgColor,
                        strokeStyle: "transparent",
                    },
                    originX: 0,
                    originY: 0,
                },
                stage: {
                    type: "tm.display.CanvasElement",
                },
            }
        });

        this.stage.fromJSON({
        	children: {
                homeButton: {
                    type: "HomeButton",
                    init: {
                        size: 140,
                    },
                    x: 160,
                    y: SCREEN_CENTER_Y,
                },
                playButton: {
                    type: "PlayButton",
                    init: {
                        size: 140,
                    },
                    x: SCREEN_WIDTH - 160,
                    y: SCREEN_CENTER_Y,
                },
        	}
        });

        this.stage.homeButton.onpush = function() {
            this.fill();
        };
        this.stage.homeButton.onfilled = function() {
	        this.nextLabel = 'title';
	        this.app.popScene();
        }.bind(this);

        this.stage.playButton.onpush = function() {
	        this.app.popScene();
        }.bind(this);

        // fade
        this.bg.alpha = 0;
        this.bg.tweener.wait(100).fadeIn(200);
        this.stage.alpha = 0;
        this.stage.children.each(function(elm) { elm.sleep(); });
        this.stage.tweener
            .wait(500)
            .call(function() {
                this.stage.children.each(function(elm) { elm.wakeUp(); });
            }, this)
            .fadeIn(200);
    },
});




;(function() {

    tm.define("tm.game.CountScene", {
        superClass: "tm.app.Scene",

        init: function() {
            this.superInit();

            this.fromJSON({
                children: {
                    bg: {
                        type: "tm.display.Shape",
                    },
                    label: {
                        type: "tm.display.Label",
                        fillStyle: "white",
                        fontSize: 100,
                        x: SCREEN_CENTER_X,
                        y: SCREEN_CENTER_Y,
                    },
                }
            });

            this.counter = 1;
            this._updateCount();
        },

        _updateCount: function() {
            var endFlag = this.counter <= 0;

            this.counter-=1;
            this.label.text = "Ready";

            this.label.scale.set(1, 1);
            this.label.tweener
                .clear()
                .to({
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                }, 250)
                .wait(500)
                .to({
                    scaleX: 1.5,
                    scaleY: 1.5,
                    alpha: 0.0
                }, 250)
                .call(function() {
                    if (this.counter <= 0) {
                        this.app.popScene();
                    }
                    else {
                        this._updateCount();
                    }
                }, this);
        },
    });

})();
/*
 * # tutorial - tmlib.js
 * tmlib.js のチュートリアルです.
 * http://phi-jp.github.io/tmlib.js/tutorial.html
 */


var main = function() {
    // キャンバスアプリケーションを生成
    var app = tm.display.CanvasApp("#world");
    app.background = BACKGROUND_COLOR;
    // リサイズ
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    // ウィンドウにフィットさせる
    app.fitWindow();

    // ロード
    var loading = tm.scene.LoadingScene({
        assets: ASSETS,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    });
    loading.onload = function() {
        // シーン切り替え
        app.replaceScene(ManagerScene());
    };
    app.replaceScene(loading);

    // 実行
    app.run();

    document.body.style.background = '#222';
};

// main
if (window.target === 'debug') {
    main();
}
else {
    tm.main(main);
}

tm.define("ManagerScene", {
    superClass: "tm.scene.ManagerScene",

    init: function() {
        this.superInit({
            startLabel: QUERY.scene,
            scenes: [
                {
                    className: "TitleScene",
                    label: "title",
                },
                {
                    className: "GameScene",
                    label: "game",
                    arguments: {
                        level: QUERY.level,
                    },
                    nextLabel: "result",
                },
                {
                    className: "ResultScene",
                    label: "result",
                    nextLabel: "title",
                },

                {
                    className: "PauseScene",
                    label: "pause",
                },
            ],
        });

        // tm.asset.Manager.get("sounds/bgm").setLoop(true).play();
    },
});


