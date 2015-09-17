/*
 * PauseScene
 */


tm.define("PauseScene", {
    superClass: "tm.app.Scene",

    init: function(param) {
        this.superInit();

        param = {
        	bgColor: 'rgba(0, 0, 0, 0.95)',
        }.$extend(param);

        this.fromJSON({
            children: {
                bg: {
                    type: "tm.display.RectangleShape",
                    init: {
                        width: SCREEN_WIDTH,
                        height: SCREEN_HEIGHT,
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

        this.stage.fromJSON({
        	children: {
                homeButton: {
                    type: "HomeButton",
                    init: {
                        size: 140,
                    },
                    x: 160,
                    y: SCREEN_CENTER_Y,
                },
                playButton: {
                    type: "PlayButton",
                    init: {
                        size: 140,
                    },
                    x: SCREEN_WIDTH - 160,
                    y: SCREEN_CENTER_Y,
                },
        	}
        });

        this.stage.homeButton.onpush = function() {
            this.fill();
        };
        this.stage.homeButton.onfilled = function() {
	        this.nextLabel = 'title';
	        this.app.popScene();
        }.bind(this);

        this.stage.playButton.onpush = function() {
	        this.app.popScene();
        }.bind(this);

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
    },
});

