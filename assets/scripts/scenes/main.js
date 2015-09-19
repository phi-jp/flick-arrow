

// 
phina.define('MainScene', {
  superClass: 'CanvasScene',

  init: function() {
    this.superInit();

    this.fromJSON({

    });
  },

  onenter: function() {
    CircleFilterEffect().addChildTo(this);

    var scene = CountScene({
      count: ['Ready'],
      fontSize: 100,
    });

    this.app.pushScene(scene);

    scene.onexit = function() {
      // this.setQuestion();
    }.bind(this);
  }
});

/*
 * 最初の円のフィルター
 */
phina.define("CircleFilterEffect", {
    superClass: "Shape",

    init: function(options) {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'hsl(180, 60%, 50%)',
      });

      this.origin.set(0, 0);

      this.canvas.transformCenter();

      this.circleRadius = 0;
      this.tweener
        .to({
          circleRadius: 1000,
        })
        .call(function() {
          this.target.remove();
        })
    },

    update: function() {
        var c = this.canvas;

        c.context.globalCompositeOperation = "destination-out";
        c.fillCircle(0, 0, this.circleRadius);
    },
});



