
/*
 * ResultScene
 */

phina.define("ResultScene", {
  superClass: "CanvasScene",

  init: function(options) {
    this.superInit(options);

    this.fromJSON({
      children: {
        scoreText: {
          className: 'phina.display.Label',
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
          className: 'phina.display.Label',
          arguments: {
            text: options.score || '0',
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
          className: 'AdButton',
          arguments: {
            radius: this.gridX.span(1),
          },
          x: this.gridX.span(12),
          y: this.gridY.span(11),
        },
      },
    });

    this.homeButton.onpush = function() {
      this.parent.children.each(function(c) {
        c.tweener.clear().fadeOut(200);
      });
      this.fill();
    };

    this.homeButton.onfilled = function() {
      var app = this.app;
      app.popScene();
      app.currentScene.exit('title');
    }.bind(this);

    return ;

    homeButton.onpush = function() {
      homeButton.fill();
    }.bind(this);
    homeButton.onfilled = this._toHome.bind(this);

    storeButton.onpush = function() {
      life.recovery();
    }.bind(this);
    
    shareButton.onshared = function() {
      life.recovery();
    }.bind(this);

    // setup record
    if (highScoreFlag) {
      this.stage.newRecordText.show();
      this.stage.newRecordText.tweener
        .set({alpha:0.0})
        .fadeIn(2000)
        .setLoop(true)
        ;

    }

    // gamecenter にスコアを送る
    this.sendHighScore(userData.bestScore);
    
    // fade
    this.bg.alpha = 0;
    this.bg.tweener.wait(100).fadeIn(200);
    this.stage.alpha = 0;
    this.stage.children.each(function(elm) { elm.sleep(); });
    this.stage.tweener
      .wait(500)
      .call(function() {
        this.stage.children.each(function(elm) { elm.wakeUp(); });
      }, this)
      .fadeIn(200);

    if (tm.util.Random.randbool()) {
      showAd();
    }
  },

  sendHighScore: function(score) {
    if (window.gamecenter) {
      var data = {
        score: score,
        leaderboardId: BOARD_ID,
      };

      gamecenter.submitScore(function() {
        // alert('success');
      }, function() {
        // alert('failure');
      }, data);
    }
  },

  onpointingstart: function(e) {
    var p = e.app.pointing;
    WaveEffect().addChildTo(this).setPosition(p.x, p.y);
  },

  gridX: function(index) {
    return this.param.width/12*index;
  },

  gridY: function(index) {
    return this.param.height/12*index;
  },

  _toHome: function() {
    this.nextLabel = 'title';
    this.app.popScene();
  },
});

