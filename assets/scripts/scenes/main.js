

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

    this.timer = 0;
    this.limitTime = TIME;
  },

  onenter: function() {
    CircleFilterEffect().addChildTo(this);

    var scene = CountScene({
      count: ['Ready'],
      fontSize: 100,
    });
    scene.onexit = function() {
      // this.setQuestion();
    }.bind(this);

    this.app.pushScene(scene);
  },

  update: function() {
    this.addTime(this.app.ticker.deltaTime);
  },

  addTime: function(time) {
    this.timer += time;
    this.gaugeShape.value = (this.timer/this.limitTime);
  },
});

/*
 * 最初の円のフィルター
 */
phina.define('CircleFilterEffect', {
    superClass: 'Shape',

    init: function(options) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'hsl(180, 60%, 50%)',
      });

      this.origin.set(0, 0);

      this.canvas.transformCenter();

      this.circleRadius = 0;
      this.tweener
        .to({
          circleRadius: 1000,
        })
        .call(function() {
          this.target.remove();
        })
    },

    update: function() {
        var c = this.canvas;

        c.context.globalCompositeOperation = 'destination-out';
        c.fillCircle(0, 0, this.circleRadius);
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
      this.style.backgroundColor = color;
    }
  },

  _accessor: {
    value: {
      get: function() {
        return this._value;
      },
      set: function(v) {
        this._value = v;
        this.scaleY = this.value;
      },
    },
  },

  // setValue: function(rate) {
  //     this.value = Math.clamp(rate, 0, 1);
  //     this.scaleY = this.value;
  // },
});

