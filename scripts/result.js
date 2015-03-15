
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

            var userData = this._getUserData();
            var bestScore = (userData.bestScore) ? userData.bestScore : 0;
            var highScoreFlag = (param.score > bestScore);

            if (param.record) {
                if (highScoreFlag) {
                    userData.bestScore = param.score;
                    this._record(userData);
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
                        x: this._toGridX(4),
                        y: this._toGridY(2),
                        fontSize: param.fontSize*0.5,
                    }),
                    scoreLabel: {
                        type: "Label",
                        text: param.score,
                        x: this._toGridX(4),
                        y: this._toGridY(3),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                    },
                    bestText: {
                        type: "Label",
                        text: "best",
                        x: this._toGridX(8),
                        y: this._toGridY(2),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize*0.5,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                    },
                    bestLabel: {
                        type: "Label",
                        text: bestScore,
                        x: this._toGridX(8),
                        y: this._toGridY(3),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                    },

                    newRecordText: {
                        type: "Label",
                        text: "new record!",
                        x: this._toGridX(6),
                        y: this._toGridY(6),
                        fillStyle: param.fontColor,
                        fontSize: param.fontSize*0.5,
                        fontFamily: "'Helvetica-Light' 'Meiryo' sans-serif",
                        visible: false,
                    },

                    playButton: {
                        type: "CircleButton",
                        init: {
                            size: this._toGridX(3),
                            text: String.fromCharCode('0xe80d'),
                            fillFlag: true,
                        },
                        x: this._toGridX(6),
                        y: this._toGridY(6),
                    },

                    shareButton: {
                        type: "CircleButton",
                        init: {
                            size: this._toGridX(2),
                            text: String.fromCharCode('0xe810'),
                            bgColor: "hsl(240, 100%, 64%)",
                        },
                        x: this._toGridX(3),
                        y: this._toGridY(9),
                    },
                    homeButton: {
                        type: "CircleButton",
                        init: {
                            size: this._toGridX(2),
                            text: String.fromCharCode('0xe80c'),
                            bgColor: HOME_COLOR,
                            fillFlag: true,
                        },
                        x: this._toGridX(6),
                        y: this._toGridY(9),
                    },
                    adButton: {
                        type: "CircleButton",
                        init: {
                            size: this._toGridX(2),
                            text: 'Ad',
                            bgColor: "hsl(0, 100%, 64%)",
                        },
                        x: this._toGridX(9),
                        y: this._toGridY(9),
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

            // setup back
            this.stage.playButton.onfilled = this._play.bind(this);
            this.stage.homeButton.onfilled = this._toHome.bind(this);

            // setup record
            if (highScoreFlag) {
                this.newRecordText.show();
                this.newRecordText.tweener
                    .set({alpha:0.0})
                    .fadeIn(2000)
                    .setLoop(true)
                    ;
            }
        },

        _getUserData: function() {
            var key = location.pathname.toCRC32();
            var data = localStorage.getItem(key);
            return (data) ? JSON.parse(data) : {};
        },

        _record: function(data) {
            var key = location.pathname.toCRC32();
            var dataString = JSON.stringify(data);
            localStorage.setItem(key, dataString);
            return this;
        },

        _toGridX: function(index) {
            return this.param.width/12*index;
        },

        _toGridY: function(index) {
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