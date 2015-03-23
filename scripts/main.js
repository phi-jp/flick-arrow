/*
 * # tutorial - tmlib.js
 * tmlib.js のチュートリアルです.
 * http://phi-jp.github.io/tmlib.js/tutorial.html
 */


var main = function() {
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
};

// main
if (window.target === 'debug') {
    main();
}
else {
    tm.main(main);
}

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

                {
                    className: "PauseScene",
                    label: "pause",
                },
            ],
        });

        // tm.asset.Manager.get("sounds/bgm").setLoop(true).play();
    },
});


