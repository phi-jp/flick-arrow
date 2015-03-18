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




tm.define("CircleButton", {
    superClass: "tm.display.CanvasElement",

    init: function(param) {
        this.superInit();

        param = param || {};

        param.$safe({
            size: 150,
            text: 'A',
            fontFamily: 'share',
            fontColor: "white",
            bgColor: "hsl(180, 60%, 50%)",
            strokeColor: "transparent",
            lineWidth: 4,
        });

        this.fromJSON({
            children: {
                bg: {
                    type: "tm.display.Shape",
                    init: {
                        width: param.size,
                        height: param.size,
                    }
                },
                label: {
                    type: "tm.display.Label",
                    init: param.text,
                    fillStyle: param.fontColor,
                    fontFamily: param.fontFamily,
                    fontSize: param.size/2,
                }
            }
        });

        this.setInteractive(true, "circle");
        this.on("pointingend", function() {
            this.flare('push');
        });

        this.fillFlag = param.fillFlag;

        this.lineWidth = param.lineWidth;
        this.strokeColor = param.strokeColor;
        this.bgColor = param.bgColor;
        this.radius = param.size/2;
        this._render();
    },
    _render: function() {
        var c = this.bg.canvas;
        c.setTransformCenter();
        c.fillStyle = this.bgColor;
        c.fillCircle(0, 0, this.radius);

        c.lineWidth = this.lineWidth;
        c.strokeStyle = this.strokeColor;
        c.strokeCircle(0, 0, this.radius-this.lineWidth/2-1);
    },

    fill: function() {
        this.parent.children.each(function(elm) {
            elm.tweener.clear().fadeOut(200)
        });

        var c = this.bg.canvas;
        this.bg.width = SCREEN_WIDTH;
        this.bg.height= SCREEN_HEIGHT;
        this._render();

        this.setInteractive(false);

        this.label.tweener
            .clear()
            .fadeOut(200)
            ;

        this.tweener
            .clear()
            .wait(300)
            .to({
                x: SCREEN_CENTER_X,
                y: SCREEN_CENTER_Y,
            }, 300, 'easeOutQuint')
            .to({
                radius: 600,
            }, 500, 'easeOutQuint')
            .call(function() {
                this.flare('filled');
            }, this)
            ;

        this.update = function() {
            this._render();
        };
    },

    blink: function() {
        this.tweener
            .clear()
            .set({alpha:0})
            .wait(100)
            .set({alpha:1})
            .wait(100)
            .set({alpha:0})
            .wait(100)
            .set({alpha:1})
            .wait(100)
            .set({alpha:0})
            .wait(100)
            .set({alpha:1})
            .wait(100)
            .set({alpha:0})
            .wait(100)
            .set({alpha:1})
            .wait(100);
    }
});



tm.define("Life", {
    superClass: "tm.display.CanvasElement",

    init: function() {
        this.superInit();

        var data = UserData.get();

        this.backGroup = tm.display.CanvasElement().addChildTo(this);
        this.frontGroup = tm.display.CanvasElement().addChildTo(this);
        (5).times(function(i) {
            var h = tm.display.HeartShape({
                width: 40,
                height: 40,
                fillStyle: "gray",
            }).addChildTo(this.backGroup);
            h.x = i*70;
            h.y = 0;
        }, this);
        (5).times(function(i) {
            var h = tm.display.HeartShape({
                width: 40,
                height: 40,
            }).addChildTo(this.frontGroup);
            h.x = i*70;
            h.y = 0;

            h.hide();

            if (data.life>i) {
                h.show();
            }
        }, this);
    },
    decriment: function() {
        var data = UserData.get();
        data.life--;
        UserData.set(data);

        var hearts = this.frontGroup.children;
        hearts[data.life].tweener
            .clear()
            .by({
                y: -100,
                alpha: -1,
            }, 200)
            .call(function() {
                this.flare('decrimented');
            }, this)
            ;
    },

    recovery: function() {
        var data = UserData.get();
        var fronts = this.frontGroup.children;

        (5-data.life).times(function(i) {
            var h = fronts[data.life+i];

            h.show();
            h.alpha = 0;
            h.scale.set(2, 2);

            h.tweener
                .clear()
                .wait(i*250)
                .to({
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1,
                }, 500)
                ;
        }, this);

        data.life = 5;
        UserData.set(data);
    },

});

