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
        this.col = 12;  // x
        this.row = 16; // y

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
                    y: this.gridY(4),
                },
                playButton: {
                    type: "MorphingButton",
                    init: {
                        width: this.gridX(8),
                        height: this.gridY(1.5),
                        fontFamily: SUB_FONT,
                    },
                    x: this.gridX(6),
                    y: this.gridY(11),
                },
                rankButton: {
                    type: "tm.ui.FlatButton",
                    init: {
                        width: this.gridX(8),
                        height: this.gridY(1.5),
                        text: "RANKING",
                        fontFamily: SUB_FONT,
                    },
                    x: this.gridX(6),
                    y: this.gridY(13),
                },
            },
        });

        this.playButton.onpush = function() {
            this.titleLabel.tweener.fadeOut(200);
            this.rankButton.tweener.fadeOut(200);
        }.bind(this);

        this.playButton.onpushed = function() {
            this.app.popScene();
        }.bind(this);

    },

    gridX: function(i) {
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


tm.define("MorphingButton", {
    superClass: "tm.ui.FlatButton",
    
    init: function(param) {
        this.superInit(param);
        
        this.initialWidth = this.width;
        this.initialHeight = this.height;
        this.initialCornerRadius = this.cornerRadius;
        
        this.on('push', function() {
            this.morphCircle();
        });
    },
    
    // 円形に変形
    morphCircle: function(radius) {
        var circleSize = radius || 1500;
        
        this.setInteractive(false);
        this.label.tweener
            .clear()
            .fadeOut(200)
            ;
        this.tweener
            .clear()
            .wait(300)
            .to({
                width: this.height,
                cornerRadius: this.height/2
            }, 300, 'easeOutQuint')
            .to({
                width: circleSize,
                height: circleSize,
                cornerRadius: circleSize/2
            }, 500, 'easeOutQuint')
            .call(function() {
                this.flare('circled');
                this.flare('pushed');
                this.setInteractive(true);
            }, this)
            ;
    },
    
    // 元の形に変形
    morphDefault: function() {
        this.setInteractive(false);
        this.label.tweener
            .clear()
            .wait(800)
            .fadeIn(200)
            ;
        
        this.tweener
            .clear()
            .to({
                width: this.initialHeight,
                height: this.initialHeight,
                cornerRadius: this.initialHeight/2
            }, 500, 'easeOutQuint')
            .to({
                width: this.initialWidth,
                cornerRadius: this.initialCornerRadius,
            }, 300, 'easeOutQuint')
            .call(function() {
                this.flare('defaulted');
                this.setInteractive(true);
            }, this)
            ;
    },
});

