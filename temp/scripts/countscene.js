

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
                        fontSize: 100,
                        x: SCREEN_CENTER_X,
                        y: SCREEN_CENTER_Y,
                    },
                }
            });

            this.counter = 1;
            this._updateCount();
        },

        _updateCount: function() {
            var endFlag = this.counter <= 0;

            this.counter-=1;
            this.label.text = "Ready";

            this.label.scale.set(1, 1);
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
                    if (this.counter <= 0) {
                        this.app.popScene();
                    }
                    else {
                        this._updateCount();
                    }
                }, this);
        },
    });

})();