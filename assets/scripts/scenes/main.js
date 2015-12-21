

// 
phina.define('MainScene', {
  superClass: 'CanvasScene',

  init: function() {
    this.superInit();

    this.fromJSON({
      children: {
        gaugeShape: {
          className: 'GaugeShape',
        },
        stage: {
          className: 'CanvasElement',
        },
        arrowGroup: {
          className: 'CanvasElement',
        },
        ui: {
          className: 'CanvasElement',
        },
      },
    });

    this.ui.fromJSON({
      children: {
        scoreLabel: {
          className: 'Label',
          arguments: {
            text: '0',
            fontSize: 64,
            color: "#444",
          },
          x: this.gridX.center(),
          y: this.gridY.span(2),
        },
        pauseButton: {
          className: 'PauseButton',
          init: {
            radius: 60,
          },
          x: this.gridX.span(14),
          y: this.gridX.span(2),
        },
      },
    });

    this.score = 0;
    this.combo = 0;
    this.timer = 0;
    this.limitTime = TIME;
    this.xList = [];
    this.yList = [];

    this.ui.pauseButton.onpush = function() {
      this.pause();
    }.bind(this);

    this.setup();
  },

  onenter: function() {
    SoundManager.stopMusic(1000);

    CircleFilterEffect({}).addChildTo(this);

    var scene = CountScene({
      count: ['Ready'],
      fontSize: 100,
      backgroundColor: 'hsl(180, 60%, 50%)',
    });
    scene.onexit = function() {
      SoundManager.playMusic('bgm_game');
      this.setQuestion();
    }.bind(this);

    this.app.pushScene(scene);
  },

  addTime: function(time) {
    this.timer += time;
    this.gaugeShape.value = (this.timer/this.limitTime);
  },

  addScore: function(v) {
    this.score += v;
    this.ui.scoreLabel.text = this.score + '';
  },

  setup: function() {
    (5).times(function(i) {
      var a = this.createArrow(i).addChildTo(this.arrowGroup);
    }, this);
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

    return table.pickup();
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

  setQuestion: function() {
    var arrow = this.arrowGroup.children.first;
    this.stage.addChild(arrow);
    arrow.appear(SCREEN_CENTER_X, SCREEN_CENTER_Y+120);
    this.arrow = arrow;

    this.fillArrow();
  },

  getFlickDirection: function(app) {
    var p = app.pointer;

    if (p.getPointing()) {
      this.xList.push(p.dx);
      if (this.xList.length > 10) this.xList.shift();
      this.yList.push(p.dy);
      if (this.yList.length > 10) this.yList.shift();

      this.arrow.x += p.dx*0.5;
      this.arrow.y += p.dy*0.5;
    }

    if (p.getPointingEnd() == true) {
      var delta = Vector2();

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

  isTimeup: function() {
    return this.timer >= this.limitTime;
  },

  update: function(app) {
    this.addTime(this.app.ticker.deltaTime);

    var d = this.getFlickDirection(app);

    // support keyboard
    if (!d) {
      // d = this.getKeyDirection(app);
    }

    if (d) {
      if (this.arrow.check(d)) {
        this.arrow.disappear(d);
        this.addScore(1);
        this.setQuestion();

        AssetManager.get('sound', 'pinpon').play();

        // bonus
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

        AssetManager.get('sound', 'boo').play();

        // penalty
        this.addTime(PENALTY);

        this.combo = 0;
      }
    }

    if (this.isTimeup()) {
      this.gameover();
    }
  },

  pause: function() {
    var scene = PauseScene({});

    scene.onexit = function() {

    }.bind(this);

    this.app.pushScene(scene);
  },


  gameover: function() {
    var app = this.app;

    var s = ResultScene({
      score: this.score,
    });

    app.pushScene(s);
  },

});




phina.define('GaugeShape', {
  superClass: 'Shape',

  init: function() {
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      backgroundColor: 'hsla(0, 0%, 80%, 0.5)',
    });

    this.origin.y = 1;
    this.setPosition(SCREEN_CENTER_X, SCREEN_HEIGHT);

    this.value = 0.0;
  },

  update: function() {
    if (this.value >= 0.9) {
      var rate = 1-((1.0-this.value)/0.1);
      var s = rate*100;
      var color = 'hsla(0, {0}%, 80%, 0.5)'.format(s);
      this.backgroundColor = color;
    }
  },

  _accessor: {
    value: {
      get: function() {
        return this._value;
      },
      set: function(v) {
        this._value = Math.clamp(v, 0, 1);
        this.scaleY = this.value;
      },
    },
  },
});

