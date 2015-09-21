
phina.define('CircleButton', {
  superClass: 'CanvasElement',

  init: function(options) {
    this.superInit();

    this.fromJSON({
      children: {
        bg: {
          className: 'CircleShape',
          arguments: {
            radius: options.radius,
            stroke: false,
            color: options.backgroundColor,
          },
        },
        label: {
          className: 'Label',
          arguments: [options.text, {
            color: 'white',
            fontFamily: options.fontFamily,
            fontSize: options.radius,
            stroke: false,
          }],
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
          // tm.asset.Manager.get('sounds/warp').clone().play();
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





phina.define('RankingButton', {
  superClass: 'CircleButton',

  init: function(options) {
    options = (options || {}).$safe({
      text: FONT_CODE.trophy,
      fontFamily: 'FontAwesome',
      backgroundColor: 'hsl(200, 100%, 50%)',
    });

    this.superInit(options);
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
  }
});

phina.define('AdButton', {
  superClass: 'CircleButton',

  init: function(options) {
    options = (options || {}).$safe({
      text: FONT_CODE.buysellads,
      fontFamily: 'FontAwesome',
      backgroundColor: 'hsl(0, 100%, 64%)',
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
        color: color,
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


    /*


    blink: function() {
        this.tweener
            .clear()
            .to({
                scaleX: 1, scaleY: 1,
            }, 1000, 'easeOutElastic')
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
    */
});



