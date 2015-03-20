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
                this.shareButton.blink();
                this.adButton.blink();
            }
        }.bind(this);
        this.playButton.onfilled = function() {
            this.app.popScene();
        }.bind(this);

        this.rankButton.onpush = function() {
            var data = {
                leaderboardId: BOARD_ID
            };
            gamecenter.showLeaderboard(null, null, data);
        };
        this.adButton.onpush = this._showAd.bind(this);

        this.shareButton.onclick = this._share.bind(this);
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

    _showAd: function() {
        clickAdCallback = function() {
            this.life.recovery();
        }.bind(this);

        showAd();
    },

    _share: function() {
        var text = "『FlickArrow』矢印をフリックするシンプルなゲームです♪";

        if (isNative()) {
            var message = {
                text: text,
                activityTypes: ['PostToFacebook'],
                // activityTypes: ["PostToFacebook", "PostToTwitter", "PostToWeibo", "Message", "Mail", "Print", "CopyToPasteboard", "AssignToContact", "SaveToCameraRoll", "AddToReadingList", "PostToFlickr", "PostToVimeo", "TencentWeibo", "AirDrop"];
                activityTypes: ["Mail", "PostToFacebook", "PostToTwitter"],
                url: 'http://gotoapp',
            };
            window.socialmessage.send(message);
            this.life.recovery();
        }
        else {
            var twitterURL = tm.social.Twitter.createURL({
                type    : "tweet",
                text    : text,
                hashtags: "FlickArrow,tmlib",
                url     : window.document.location.href,
            });
            var win = window.open(twitterURL, 'share window', 'width=400, height=300');
            var timer = setInterval(function() {   
                if(win.closed) {
                    this.life.recovery();
                    clearInterval(timer);  
                }
            }.bind(this), 100);
        }
    },
});
