// シーンを定義
tm.define("GameScene", {
    superClass: "tm.app.Scene",
    
    init: function(param) {
        this.superInit();
        
        this.fromJSON({
            children: {
                shapeGauge: {
                    type: "ShapeGauge",
                },
            	stage: {
            		type: "tm.display.CanvasElement",
            	},
                arrowGroup: {
                    type: "tm.display.CanvasElement",
                },
                ui: {
                    type: "tm.display.CanvasElement",
                },
            }
        });

        this.ui.fromJSON({
            children: {
                scoreLabel: {
                    type: "tm.display.Label",
                    x: SCREEN_CENTER_X,
                    y: 115,
                    fillStyle: "#444",
                    fontSize: 64,
                    text: '0',
                },
            },
        });

        this.score = 0;
        this.combo = 0;
        this.timer = 0;
        this.limitTime = TIME;
        this.xList = [];
        this.yList = [];

        this.setupArrow();
    },

    onenter: function() {
        // debug:
        this.setQuestion();
        return ;

        // 
        CircleFilterEffect().addChildTo(this);

        var scene = tm.game.CountScene();
        this.app.pushScene(scene);

        scene.onexit = function() {
            this.setQuestion();
        }.bind(this);
    },

    createArrow: function(i) {
        var type = ['blue', 'blue', 'red', 'green'].pickup();
        var type = this.getArrowType();
        var direction = ['left', 'right', 'up', 'down'].pickup();
        var arrow = Arrow({
            type: type,
            direction: direction
        });
        arrow.x = 95 + i*110;
        arrow.y = 280;
        arrow.scaleX = 0.4;
        arrow.scaleY = 0.4;

        return arrow;
    },

    getArrowType: function() {
    	var score = this.score;
    	var table = QUESTION_TABLE[0];
    	Object.keys(QUESTION_TABLE).some(function(value) {
    		if (score <= value) {
    			return true;
    		}
			table = QUESTION_TABLE[value];
    	});

    	console.log(table);

    	return table.pickup();
    },

    setupArrow: function() {
        (5).times(function(i) {
            var a = this.createArrow(i).addChildTo(this.arrowGroup);
        }, this);
    },

    // 補充
    fillArrow: function() {
        var a = this.createArrow(5).addChildTo(this.arrowGroup);

        var arrows = this.arrowGroup.children;

        arrows.each(function(arrow, i) {
            arrow.tweener
                .clear()
                .to({
                    x: 95 + i*110,
                    y: 280,
                }, 100)
                ;
        });
    },

    getArrow: function() {
        return this.stage.addChild(this.arrowGroup.children.first);
    },

    setQuestion: function() {
        var arrow = this.getArrow();
        arrow.appear(SCREEN_CENTER_X, SCREEN_CENTER_Y+120);
        this.arrow = arrow;

        // 補充
        this.fillArrow();
    },

    update: function(app) {
        var d = this.getFlickDirection(app);

        this.addTime(app.deltaTime);

        // support keyboard
        if (!d) {
            d = this.getKeyDirection(app);
        }

        if (d) {
            if (this.arrow.check(d)) {
                this.arrow.disappear(d);
                this.addScore(1);
                tm.asset.Manager.get("sounds/pinpon").clone().play();

                this.setQuestion();

                // ボーナス
                this.combo++;
                if (this.combo % 10 === 0) {
                	var time = (this.combo * this.combo);
                	time = Math.min(MAX_RECOVERY, time);
                	this.addTime(-time);
                }
            }
            else {
                this.arrow.move(SCREEN_CENTER_X, SCREEN_CENTER_Y+120);
                this.arrow.blink();
                tm.asset.Manager.get("sounds/boo").clone().play();

                // penalty
                this.addTime(PENALTY);
                
                this.combo = 0;
            }
        }

        if (this.isTimeup()) {

            this.gameover();
        }
    },

    gameover: function() {
        var app = this.app;
        this.nextLabel = 'game';

        var s = ResultScene({
            score: this.score,
            bgColor: 'rgba(255, 255, 255, 0.95)',
        });
        s.onexit = function() {
            this.nextLabel = s.nextLabel;
            app.popScene();
        }.bind(this);
        app.pushScene(s);
    },

    getFlickDirection: function(app) {
        var p = app.pointing;

        if (p.getPointing()) {
            this.xList.push(p.dx);
            if (this.xList.length > 10) this.xList.shift();
            this.yList.push(p.dy);
            if (this.yList.length > 10) this.yList.shift();

            this.arrow.x += p.dx*0.5;
            this.arrow.y += p.dy*0.5;
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

    getKeyDirection: function(app) {
        var key = app.keyboard;

        if (key.getKeyUp('left')) { return "left"; }
        else if (key.getKeyUp('right')) { return "right"; }
        else if (key.getKeyUp('up')) { return "up"; }
        else if (key.getKeyUp('down')) { return "down"; }

        return null;
    },

    addScore: function(point) {
        this.score += point;
        this.ui.scoreLabel.text = this.score;
    },

    addTime: function(time) {
        this.timer += time;
        this.shapeGauge.setValue( this.timer/(this.limitTime) );
    },

    isTimeup: function() {
        return this.timer >= this.limitTime;
    },

});



tm.define("Arrow", {
    superClass: "tm.display.CircleShape",

    init: function(param) {
        this.direction = param.direction;
        this.type = param.type || "blue";

        var color = {
            'red': 'hsla(0, 80%, 65%, 1.0)',
            'green': 'hsla(120, 80%, 65%, 1.0)',
            'blue': 'hsla(240, 80%, 65%, 1.0)',
        }[this.type];

        this.superInit({
            width: 256,
            height: 256,
            strokeStyle: "white",
            strokeStyle: "transparent",
            fillStyle: color,
            lineWidth: 8,
        });

        this.fromJSON({
            children: {
            	arrow: {
            		type: "tm.display.Sprite",
            		init: "images/arrow0",
            		width: 200,
            		height: 200,
                    rotation: {
                        'left': 180,
                        'right': 0,
                        'up': -90,
                        'down': 90,
                    }[this.direction],
            	},
            	/*
                arrow: {
                    type: "tm.display.Label",
                    init: String.fromCharCode(FONT_CODE.longArrowRight),
                    fontSize: 150,
                    fontFamily: 'FontAwesome',
                    rotation: {
                        'left': 180,
                        'right': 0,
                        'up': -90,
                        'down': 90,
                    }[this.direction],
                },
                */
            },
        });

        // this.appear();
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

    appear: function(x, y) {
        this.scale.set(0.5, 0.5);

        this.tweener
            .clear()
            .to({
                x: x, y: y,
                scaleX: 1, scaleY: 1,

            }, 500, "easeOutCubic")
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
                x: v[0] * 400,
                y: v[1] * 400,
                alpha: -1,
            }, 200)
            .call(function() {
                this.remove();
            }, this)
            ;
    },

    move: function(x, y) {
        var tweener = tm.app.Tweener(this).addChildTo(this);

        tweener
            .move(x, y, 500, "easeOutElastic")
            .call(function() {
                tweener.remove();
            })
            ;
    },

    blink: function() {
        this.tweener
            .clear()
            .to({
                scaleX: 1, scaleY: 1,
            }, 1000, "easeOutElastic")
            ;

        this.tweener.clear();

        (3).times(function() {
            this.tweener
                .set({alpha:0})
                .wait(30)
                .set({alpha:1})
                .wait(70)
        }, this);
    }
});


/*
 * 最初の円のフィルター
 */
tm.define("CircleFilterEffect", {
    superClass: "tm.display.Shape",

    init: function(param) {
        param = param || {};
        param.$safe({
            color: "hsl(180, 60%, 50%)",
        });

        this.superInit({
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
        });

        this.origin.set(0, 0);

        var c = this.canvas;

        c.clearColor(param.color);
        c.setTransformCenter();

        this.circleRadius = 0;
        this.tweener.to({
            circleRadius: 1000,
        });
    },

    update: function() {
        var c = this.canvas;

        c.globalCompositeOperation = "destination-out";
        c.fillCircle(0, 0, this.circleRadius);
    },
});




tm.define("ShapeGauge", {
    superClass: "tm.display.Shape",

    init: function() {
        this.superInit({
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            bgColor: "hsla(0, 0%, 80%, 0.5)",
        });

        this.origin.y = 1;
        this.setPosition(SCREEN_CENTER_X, SCREEN_HEIGHT);

        this.value = 0;
    },

    update: function() {
        if (this.value >= 0.9) {
            var rate = 1-((1.0-this.value)/0.1);
            var s = rate*100;
            var color = "hsla(0, {0}%, 80%, 0.5)".format(s);
            this.bgColor = color;
        }
    },

    setValue: function(rate) {
        this.value = Math.clamp(rate, 0, 1);
        this.scaleY = this.value;
    },
});



tm.define("FadeScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        this.fromJSON({
            children: {
                filiter: {
                    type: "tm.display.Shape",
                    init: {
                        width: SCREEN_WIDTH,
                        height: SCREEN_HEIGHT,
                        bgColor: "white",
                        alpha: 0,
                    },
                    originX: 0,
                    originY: 0,
                    blendMode: "lighter",
                }
            }
        });

        this.filiter.tweener.fadeIn(1000)
            .wait(500)
                .call(function() {
                this.app.popScene();
            }, this);
    },
});












