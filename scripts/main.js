/*
 * # tutorial - tmlib.js
 * tmlib.js のチュートリアルです.
 * http://phi-jp.github.io/tmlib.js/tutorial.html
 */


// main
tm.main(function() {
    // キャンバスアプリケーションを生成
    var app = tm.display.CanvasApp("#world");
    app.background = "#eee";
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
});

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
            ],
        });

        // tm.asset.Manager.get("sounds/bgm").setLoop(true).play();
    },
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
                        bgColor: "rgb(248, 248, 248)",
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

                playButton: {
                    type: "CircleButton",
                    init: {
                        size: this.gridX(3),
                        text: String.fromCharCode('0xe80d'),
                        fillFlag: true,
                    },
                    x: this.gridX(6),
                    y: this.gridY(6),
                },
                reviewButton: {
                    type: "CircleButton",
                    init: {
                        size: this.gridX(2),
                        text: String.fromCharCode('0xe810'),
                        text: String.fromCharCode('0xe80f'),
                        bgColor: "white",
                        fontColor: "black",
                        strokeColor: "black",
                    },
                    x: this.gridX(2),
                    y: this.gridY(10),
                },

                reviewButton: {
                    type: "CircleButton",
                    init: {
                        size: this.gridX(2),
                        text: String.fromCharCode('0xe804'),
                        bgColor: "hsl(60, 100%, 64%)",
                    },
                    x: this.gridX(3),
                    y: this.gridY(9),
                },
                rankButton: {
                    type: "CircleButton",
                    init: {
                        size: this.gridX(2),
                        text: String.fromCharCode('0xe800'),
                        bgColor: "hsl(200, 100%, 64%)",
                    },
                    x: this.gridX(6),
                    y: this.gridY(10),
                },
                adButton: {
                    type: "CircleButton",
                    init: {
                        size: this.gridX(2),
                        text: 'Ad',
                        bgColor: "hsl(0, 100%, 64%)",
                    },
                    x: this.gridX(9),
                    y: this.gridY(9),
                },

            },
        });
        this.playButton.onfilled = function() {
            this.app.popScene();
        }.bind(this);

        this.reviewButton.onpush = function() {
            alert('go to review page in app store.');
        };
        this.rankButton.onpush = function() {
            alert('open ranking page.');
        };
        this.adButton.onpush = function() {
            alert('open ad.');
        };
    },

    onenter: function() {
        CircleFilterEffect({
            color: HOME_COLOR,
        }).addChildTo(this);
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

tm.define("CircleButton", {
    superClass: "tm.display.CanvasElement",

    init: function(param) {
        this.superInit();

        param = param || {};

        param.$safe({
            size: 150,
            text: 'A',
            fontFamily: 'share',
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

            if (this.fillFlag === true) {
                this.parent.children.each(function(elm) {
                    elm.tweener.clear().fadeOut(200)
                });
                this.fill();
            }
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
});




