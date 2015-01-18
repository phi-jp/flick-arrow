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
                    className: "tm.scene.ResultScene",
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
        // this.superInit({
        //     width: SCREEN_WIDTH,
        //     height: SCREEN_HEIGHT,
        //     title: TITLE,
        //     message: "青 - 矢印の方向にフリック\n赤 - 矢印と反対の方向にフリック\n緑 - 矢印を左右どちらかに90度傾けた方向にフリック",
        // });
        this.superInit();

        // grid
        this.width = SCREEN_WIDTH;
        this.height = SCREEN_HEIGHT;
        this.col = 12;  // x
        this.row = 16; // y

        this.fromJSON({
            children: {
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
                    type: "tm.ui.FlatButton",
                    init: {
                        width: this.gridX(8),
                        height: this.gridY(1.5),
                        fontFamily: SUB_FONT,
                    },
                    x: this.gridX(6),
                    y: this.gridY(11),
                },
                helpButton: {
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


