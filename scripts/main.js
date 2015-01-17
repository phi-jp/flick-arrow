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

        // tm.asset.Manager.get("bgm").clone().play();
    },
});



tm.define("TitleScene", {
    superClass: "tm.scene.TitleScene",

    init: function() {
        this.superInit({
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            title: "arrow flick",
            message: "青 - 矢印の方向にフリック\n赤 - 矢印と反対の方向にフリック\n緑 - 矢印を左右どちらかに90度傾けた方向にフリック",
        });

        this.touchLabel.text = "PRESS 'SPACE' START";
    },

    update: function(app) {
        if (app.keyboard.getKey('space')) {
            this.app.popScene();
        }
    },
});


