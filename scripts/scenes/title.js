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
                // ライフ
                life: {
                    type: "Life",
                    x: 180,
                    y: this.gridY(5),
                },

                playButton: {
                    type: "CircleButton",
                    init: {
                        size: this.gridX(3),
                        text: String.fromCharCode('0xe80d'),
                    },
                    x: this.gridX(6),
                    y: this.gridY(7),
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

                // レビューボタン
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
                // シェアボタン
                shareButton: {
                    type: "CircleButton",
                    init: {
                        size: this.gridX(2),
                        text: String.fromCharCode('0xe810'),
                        bgColor: "hsl(240, 100%, 64%)",
                    },
                    x: this.gridX(3),
                    y: this.gridY(9),
                },

                rankButton: {
                    type: "CircleButton",
                    init: {
                        size: this.gridX(2),
                        text: String.fromCharCode('0xe800'),
                        bgColor: "hsl(200, 100%, 50%)",
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

        var data = UserData.get();

        this.playButton.onpush = function() {
            if (UserData.hasLife()) {
                this.life.ondecrimented = function() {
                    this.playButton.fill();
                }.bind(this);
                this.life.decriment();
            }
            else {
                this.reviewButton.blink();
                this.adButton.blink();
            }
        }.bind(this);
        this.playButton.onfilled = function() {
            this.app.popScene();
        }.bind(this);

        this.rankButton.onpush = function() {
            alert('open ranking page.');
        };
        this.adButton.onpush = function() {
            showAd();
        };

        this.shareButton.onclick = this._review.bind(this);

        if (isNative()) {
            this.shareButton.hide().sleep();
        }
        else {
            this.reviewButton.hide().sleep();
        }
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

    _review: function() {
        var text = "『ArrowFlick』矢印をフリックするシンプルなゲームです♪";
        var twitterURL = tm.social.Twitter.createURL({
            type    : "tweet",
            text    : text,
            hashtags: "ArrowFlick,tmlib",
            url     : window.document.location.href,
        });

        var win = window.open(twitterURL, 'share window', 'width=400, height=300');
        var timer = setInterval(function() {   
            if(win.closed) {
                this.life.recovery();
                clearInterval(timer);  
            }
        }.bind(this), 100);
    },
});
