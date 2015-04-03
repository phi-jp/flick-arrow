
/*
 * ResultScene
 */


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
                adButton: {
                    type: "AdButton",
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
        var adButton = this.stage.adButton;
        homeButton.onpush = function() {
            homeButton.fill();
        }.bind(this);
        homeButton.onfilled = this._toHome.bind(this);

        adButton.onaded = function() {
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

        if (tm.util.Random.randint(0, 5) === 0) {
            setTimeout(function() {
                showAd();
            }, 1000);
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

