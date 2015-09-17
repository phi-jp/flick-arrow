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
