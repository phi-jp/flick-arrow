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
            fontSize: 64,
          }],
          x: this.gridX.span(8),
          y: this.gridY.span(4),
        }
      }
    })
  },
});




