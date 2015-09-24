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
        titleSprite: {
          className: 'Sprite',
          arguments: 'title',
          x: this.gridX.span(8),
          y: this.gridY.span(3),
        },
        playButton: {
          className: 'PlayButton',
          arguments: {
            radius: this.gridX.span(2),
          },
          x: this.gridX.span(8),
          y: this.gridY.span(9),
        },
        shareButton: {
          className: 'ShareButton',
          arguments: {
            radius: this.gridX.span(1),
          },
          x: this.gridX.span(4),
          y: this.gridY.span(11),
        },
        rankingButton: {
          className: 'RankingButton',
          arguments: {
            radius: this.gridX.span(1),
          },
          x: this.gridX.span(8),
          y: this.gridY.span(12),
        },
        storeButton: {
          className: 'AdButton',
          arguments: {
            radius: this.gridX.span(1),
          },
          x: this.gridX.span(12),
          y: this.gridY.span(11),
        },
      },
    });

    var self = this;

    this.playButton.onpush = function() {

      this.parent.children.each(function(child) {
        if (child === this) return ;
        child.tweener.clear().fadeOut(200);
      }, this);

      this.fill();

      this.onfilled = function() {
        this.getRoot().exit();
      }
    };

    // AssetManager.get('sound', 'bgm_title').play();

    this.onpointstart = function() {
      AssetManager.get('sound', 'touch').play();
    }
  },

  onenter: function() {
    CircleFilterEffect({
      backgroundColor: HOME_COLOR,
    }).addChildTo(this);
  },
});

