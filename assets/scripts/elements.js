
phina.define('CircleButton', {
  superClass: 'CanvasElement',

  init: function(options) {
    this.superInit();

    this.fromJSON({
      children: {
        bg: {
          className: "CircleShape",
          arguments: {
            radius: options.radius,
            stroke: false,
            color: options.backgroundColor,
          },
        },
        label: {
          className: "Label",
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
          // tm.asset.Manager.get("sounds/warp").clone().play();
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


