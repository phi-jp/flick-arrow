// シーンを定義
tm.define("GameScene", {
    superClass: "tm.app.Scene",
    
    init: function(param) {
        this.superInit();
        
        this.fromJSON({
            children: {
            	stage: {
            		type: "tm.display.CanvasElement",
            	},
                questionGroup: {
                    type: "tm.display.CanvasElement",
                },
            }
        });

        this.setQuestion();

        this.xList = [];
        this.yList = [];
    },

    setQuestion: function() {
        var direction = ['left', 'right', 'up', 'down'].pickup();
        var type = ['blue', 'blue', 'red', 'green'].pickup();
        var arrow = Arrow({
            type: type,
            direction: direction
        }).addChildTo(this);
        arrow.x = SCREEN_CENTER_X;
        arrow.y = SCREEN_CENTER_Y;

        this.arrow = arrow;
    },

    update: function(app) {
        var d = this.getFlickDirection(app);

        if (d) {
            console.log(d);

            if (this.arrow.check(d)) {
                this.arrow.disappear(d);
                this.setQuestion();
            }
        }
    },

    getFlickDirection: function(app) {
        var p = app.pointing;

        if (p.getPointing()) {
            this.xList.push(p.dx);
            if (this.xList.length > 10) this.xList.shift();
            this.yList.push(p.dy);
            if (this.yList.length > 10) this.yList.shift();
        }

        if (p.getPointingEnd() == true) {
            var delta = tm.geom.Vector2();

            delta.x = this.xList.average();
            delta.y = this.yList.average();

            this.xList.clear();
            this.yList.clear();

            var len = delta.lengthSquared();
            if (len > 2) {
                if (Math.abs(delta.x) > Math.abs(delta.y)) {
                    if (delta.x < 0) {
                        return "left";
                    }
                    else {
                        return "right";
                    }
                }
                else {
                    if (delta.y < 0) {
                        return "up";
                    }
                    else {
                        return "down";
                    }
                }
            }
        }

        return null;
    },

});



tm.define("Arrow", {
    superClass: "tm.display.CircleShape",

    init: function(param) {
        this.direction = param.direction;
        this.type = param.type || "blue";

        this.superInit({
            width: 256,
            height: 256,
            strokeStyle: "white",
            fillStyle: this.type,
            lineWidth: 8,
        });

        var arrowChar = {
            'left': '←',
            'right': '→',
            'up': '↑',
            'down': '↓',
        }[this.direction];

        this.fromJSON({
            children: {
                label: {
                    type: "tm.display.Label",
                    text: arrowChar,
                    fontWeight: "bold",
                    fontSize: 160,
                },
            },
        });

        this.appear();
    },

    check: function(direction) {
        if (this.type == "blue") {
            return this.direction == direction;
        }
        else if (this.type == "red") {
            return {
                'left': 'right',
                'right': 'left',
                'up': 'down',
                'down': 'up',
            }[this.direction] == direction;
        }
        else if (this.type == "green") {
            return {
                'left': ['up', 'down'],
                'right': ['up', 'down'],
                'up': ['left', 'right'],
                'down': ['left', 'right'],
            }[this.direction].indexOf(direction) != -1;
        }
    },

    appear: function() {
        this.scale.set(0.5, 0.5);

        this.tweener
            .clear()
            .to({
                scaleX: 1, scaleY: 1,
            }, 1000, "easeOutElastic")
            ;
    },

    disappear: function(direction) {
        var v = {
            'left': [-1, 0],
            'right': [1, 0],
            'up': [0,-1],
            'down': [0,1],
        }[direction];

        this.tweener
            .clear()
            .by({
                x: v[0] * 500,
                y: v[1] * 500,
            }, 100)
            .call(function() {
                this.remove();
            }, this)
            ;
    },
});
