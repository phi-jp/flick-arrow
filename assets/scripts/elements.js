
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



