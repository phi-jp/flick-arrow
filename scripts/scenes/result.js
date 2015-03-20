
/*
 * ResultScene
 */

    
(function() {

    tm.define("ResultScene", {
        superClass: "tm.app.Scene",

        init: function(param) {
            this.superInit();

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

                    playButton: {
                        type: "CircleButton",
                        init: {
                            size: this.gridX(3),
                            text: String.fromCharCode('0xe80d'),
                        },
                        x: this.gridX(6),
                        y: this.gridY(7),
                    },

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
                    homeButton: {
                        type: "CircleButton",
                        init: {
                            size: this.gridX(2),
                            text: String.fromCharCode('0xe80c'),
                            bgColor: HOME_COLOR,
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
                }
            });

            // setup tweet
            var text = "SCORE: {score}, {message}".format(param);
            var twitterURL = tm.social.Twitter.createURL({
                type    : "tweet",
                text    : text,
                hashtags: param.hashtags,
                url     : param.url, // or window.document.location.href
            });

            this.twitterURL = twitterURL;
            this.stage.shareButton.onclick = this._tweet.bind(this);            

            // setup
            var life = this.stage.life;
            var playButton = this.stage.playButton;
            var shareButton = this.stage.shareButton;
            var adButton = this.stage.adButton;
            playButton.onpush = function() {
                if (UserData.hasLife()) {
                    life.ondecrimented = function() {
                        playButton.fill();
                    }.bind(this);
                    life.decriment();
                }
                else {
                    shareButton.blink();
                    adButton.blink();
                }
            }.bind(this);
            this.stage.playButton.onfilled = this._play.bind(this);
            this.stage.homeButton.onpush = function() { this.fill(); };
            this.stage.homeButton.onfilled = this._toHome.bind(this);

            // setup record
            if (highScoreFlag) {
                this.stage.newRecordText.show();
                this.stage.newRecordText.tweener
                    .set({alpha:0.0})
                    .fadeIn(2000)
                    .setLoop(true)
                    ;
            }

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


            if (window.gamecenter) {
                alert('send');
                var data = {
                    score: param.score,
                    leaderboardId: BOARD_ID,
                };

                gamecenter.submitScore(function() {
                    alert('success');
                }, function() {
                    alert('failure');
                }, data);
            }
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

        _play: function() {
            this.nextLabel = 'game';
            this.app.popScene();
        },

        _tweet: function() {
            window.open(this.twitterURL, 'share window', 'width=400, height=300');
        },
    });


})();