/*
 * title
 */


phina.define('TitleScene', {
  superClass: 'CanvasScene',

  init: function(options) {
    this.superInit({
      width: SCREEN_WIDTH, 
      height: SCREEN_HEIGHT, 
    });

    this.fromJSON({
      children: {
        titleLabel: {
          className: 'Label',
          arguments: [TITLE, {
            fontSize: 112,
            fontFamily: MAIN_FONT,
          }],
          x: this.gridX.span(8),
          y: this.gridY.span(3),
        },
        playButton: {
          className: 'CircleButton',
          arguments: {
            text: FONT_CODE.play,
            text: String.fromCharCode(FONT_CODE.play),
            fontFamily: 'FontAwesome',
            radius: this.gridX.span(2),
            backgroundColor: 'hsl(180, 60%, 50%)',
          },
          x: this.gridX.span(8),
          y: this.gridY.span(9),
        },
      },
    });

    this.playButton.onpush = function() {
      this.fill();

      this.onfilled = function() {
        this.getRoot().exit();
      }
    };
  },
});

