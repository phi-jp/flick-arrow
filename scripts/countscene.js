

;(function() {

    tm.define("tm.game.CountScene", {
        superClass: "tm.app.Scene",

        init: function() {
            this.superInit();

            this.fromJSON({
                children: {
                    bg: {
                        type: "tm.display.Shape",
                    },
                    label: {
                        type: "tm.display.Label",
                        fillStyle: "white",
                        fontSize: 256,
                        x: SCREEN_CENTER_X,
                        y: SCREEN_CENTER_Y,
                    },
                }
            });

            this.counter = 3;
            this._updateCount();
        },

        _updateCount: function() {
            var endFlag = this.counter <= 0;

            if (endFlag) {
                this.label.fontSize *= 0.5;
                this.label.text = 'START';
            }
            else {
                this.label.text = this.counter--;
            }

            this.label.scale.set(0.5, 0.5);
            this.label.tweener
                .clear()
                .to({
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                }, 250)
                .wait(500)
                .to({
                    scaleX: 1.5,
                    scaleY: 1.5,
                    alpha: 0.0
                }, 250)
                .call(function() {
                    if (endFlag) {
                        this.app.popScene();
                    }
                    else {
                        this._updateCount();
                    }
                }, this);
        },
    });

})();