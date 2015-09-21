/*
 * PauseScene
 */


phina.define('PauseScene', {
  superClass: 'CanvasScene',

  init: function(options) {
    options = (options || {}).$safe({
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    });

    this.superInit(options);

    this.fromJSON({
      children: {
        homeButton: {
          className: 'HomeButton',
          arguments: {
            radius: this.gridX.span(2),
          },
          x: this.gridX.span(4),
          y: this.gridY.center(),
        },
        playButton: {
          className: 'PlayButton',
          arguments: {
            radius: this.gridX.span(2),
          },
          x: this.gridX.span(12),
          y: this.gridY.center(),
        },
      }
    });

    this.playButton.onpush = function() {
      this.app.popScene();
    }.bind(this);

    this.homeButton.onpush = function() {
      this.parent.children.each(function(child) {
        if (child === this) return ;
        child.tweener.clear().fadeOut(200);
      }, this);

      this.fill();
    };

    this.homeButton.onfilled = function() {
      var app = this.app;
      app.popScene();
      app.currentScene.exit('title');
    }.bind(this);
  },
});

