
/*
 * ResultScene
 */

phina.define("ResultScene", {
  superClass: "CanvasScene",

  init: function(options) {
    this.superInit(options);

    options.score = options.score || 0;

    this.fromJSON({
      children: {
        bg: {
          className: 'Shape',
          arguments: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,

          },
          originX: 0,
          originY: 0,
        },
        ui: {
          className: 'CanvasElement',
        },
      },
    });

    this.ui.fromJSON({
      children: {
        scoreText: {
          className: 'Label',
          arguments: {
            text: 'score',
            color: '#444',
            stroke: false,
            fontSize: 48,
          },
          x: this.gridX.span(8),
          y: this.gridY.span(3),
        },
        scoreLabel: {
          className: 'Label',
          arguments: {
            text: options.score + '',
            color: '#444',
            stroke: false,
            fontSize: 80,
          },
          x: this.gridX.span(8),
          y: this.gridY.span(4.5),
        },

        homeButton: {
          className: 'HomeButton',
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
          className: 'LinkButton',
          arguments: {
            radius: this.gridX.span(1),
            url: APP_URL,
          },
          x: this.gridX.span(12),
          y: this.gridY.span(11),
        },
      },
    });

    this.ui.homeButton.onpush = function() {
      this.parent.children.each(function(c) {
        c.tweener.clear().fadeOut(200);
      });
      this.fill();
    };

    this.ui.homeButton.onfilled = function() {
      var app = this.app;
      app.popScene();
      app.currentScene.exit('title');
    }.bind(this);

    // 
    this.bg.tweener
      .wait(100)
      .fadeIn(200);
    
    this.ui.alpha = 0;
    this.ui.tweener
      .wait(200)
      .fadeIn(200)
      ;

    this.onpointstart = function(e) {
      var wave = Wave().addChildTo(this).setPosition(e.pointer.x, e.pointer.y);
      AssetManager.get('sound', 'touch').play();
    };

    // gamecenter にスコアを送る
    hybrid.gamecenter.submitScore(BOARD_ID, options.score);

    // 広告を表示
    if (Random.randint(0, 2) === 0) {
      setTimeout(function() {
        hybrid.showInterstitial();
      }, 1024);
    }
  },
});

