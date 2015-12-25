
phina.define('CircleButton', {
  superClass: 'CanvasElement',

  init: function(options) {
    this.superInit();

    options.radius = options.radius || 32;

    this.fromJSON({
      children: {
        bg: {
          className: 'CircleShape',
          arguments: {
            radius: options.radius,
            stroke: false,
            fill: options.backgroundColor,
          },
        },
        label: {
          className: 'Label',
          arguments: {
            text: options.text,
            fill: 'white',
            fontFamily: options.fontFamily,
            fontSize: options.radius,
            stroke: false,
          },
        },
      }
    });

    this.width = options.radius*2;
    this.height = options.radius*2;
    this.setInteractive(true);

    this.onpointend = function() {
      this.flare('push');
    };
  },

  fill: function() {
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
      .call(function() {
        AssetManager.get('sound', 'warp').play();
      })
      .call(function() {
        this.bg.tweener
          .clear()
          .to({
            radius: 600,
          }, 500, 'easeOutQuint')
          .call(function() {
            this.flare('filled');
          }, this)
          ;
      }, this)
  },
});


phina.define('PlayButton', {
  superClass: 'CircleButton',

  init: function(options) {
    options = (options || {}).$safe({
      text: FONT_CODE.play,
      fontFamily: 'FontAwesome',
      backgroundColor: 'hsl(180, 60%, 50%)',
    });

    this.superInit(options);
  }
});

phina.define('HomeButton', {
  superClass: 'CircleButton',

  init: function(options) {
    options = (options || {}).$safe({
      text: FONT_CODE.home,
      fontFamily: 'FontAwesome',
      backgroundColor: HOME_COLOR,
    });

    this.superInit(options);
  }
});

phina.define('RankingButton', {
  superClass: 'CircleButton',

  init: function(options) {
    options = (options || {}).$safe({
      text: FONT_CODE.trophy,
      fontFamily: 'FontAwesome',
      backgroundColor: 'hsl(200, 100%, 50%)',
    });

    this.superInit(options);

    this.onpush = function() {
      hybrid.gamecenter.showLeaderboard(BOARD_ID);
    };
  }
});

phina.define('ShareButton', {
  superClass: 'CircleButton',

  init: function(options) {
    options = (options || {}).$safe({
      text: FONT_CODE.comment,
      fontFamily: 'FontAwesome',
      backgroundColor: 'hsl(240, 100%, 64%)',
    });

    this.superInit(options);

    this.label.text = FONT_CODE.comment;

    this.onclick = function() {
      hybrid.socialmessage.send(options);
    };
  }
});

phina.define('LinkButton', {
  superClass: 'CircleButton',

  init: function(options) {
    options = (options || {}).$safe({
      text: FONT_CODE.thumbsUp,
      fontFamily: 'FontAwesome',
      backgroundColor: 'hsl(0, 100%, 64%)',
    });

    this.superInit(options);

    this.onclick = function() {
      window.open(options.url);
      hybrid.launchReview.launch()
    }
  }
});


phina.define('PauseButton', {
  superClass: 'CircleButton',

  init: function(options) {
    options = (options || {}).$safe({
      text: FONT_CODE.pause,
      fontFamily: 'FontAwesome',
      backgroundColor: 'hsl(0, 0%, 50%)',
    });

    this.superInit(options);
  }
});


phina.define('Arrow', {
    superClass: 'CircleShape',

    init: function(param) {
      this.direction = param.direction;
      this.type = param.type || 'blue';

      var color = {
        'red': 'hsla(0, 80%, 65%, 1.0)',
        'green': 'hsla(120, 80%, 65%, 1.0)',
        'blue': 'hsla(240, 80%, 65%, 1.0)',
      }[this.type];

      this.superInit({
        radius: 128,
        stroke: false,
        fill: color,
        lineWidth: 8,
      });

      this.fromJSON({
        children: {
          arrow: {
            className: 'Sprite',
            arguments: 'arrow',
            width: 200,
            height: 200,
            rotation: {
              'left': 180,
              'right': 0,
              'up': -90,
              'down': 90
            }[this.direction],
          },
        },
      });
    },

    appear: function(x, y) {
      this.scale.set(0.5, 0.5);

      this.tweener
        .clear()
        .to({
          x: x, y: y,
          scaleX: 1, scaleY: 1,
        }, 500, 'easeOutCubic')
        ;
    },

    check: function(direction) {
      if (this.type == 'blue') {
        return this.direction == direction;
      }
      else if (this.type == 'red') {
        return {
          'left': 'right',
          'right': 'left',
          'up': 'down',
          'down': 'up',
        }[this.direction] == direction;
      }
      else if (this.type == 'green') {
        return {
          'left': ['up', 'down'],
          'right': ['up', 'down'],
          'up': ['left', 'right'],
          'down': ['left', 'right'],
        }[this.direction].indexOf(direction) != -1;
      }
    },

    move: function(x, y) {
      var tweener = Tweener().attachTo(this);

      tweener
        .to({
          x:x, y:y
        }, 500, 'easeOutElastic')
        .call(function() {
          this.remove();
        })
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

    blink: function() {
      var tweener = Tweener().attachTo(this);

      (3).times(function() {
        tweener
          .set({alpha:0})
          .wait(20)
          .set({alpha:1})
          .wait(60)
      }, this);

      tweener.call(function() {
        this.remove();
      });
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
      backgroundColor: options.backgroundColor || 'hsl(180, 60%, 50%)',
    });

    this.origin.set(0, 0);

    this.circleRadius = 0;
    this.tweener
      .to({
        circleRadius: 1000,
      })
      .call(function() {
        this.target.remove();
      })
  },

  render: function(canvas) {
    canvas.clearColor(this.backgroundColor);
    canvas.transformCenter();
    canvas.context.globalCompositeOperation = 'destination-out';
    canvas.fillCircle(0, 0, this.circleRadius);
  },

  _accessor: {
    circleRadius: {
      get: function() {
        return this._circleRadius;
      },
      set: function(v) {
        this._dirtyDraw = true;
        this._circleRadius = v;
      },
    },
  },
});



