

var hybrid = {
  admob: {
    init: function(options) {
      if (!window.AdMob) return ;

      var admobid = {};
      // for android
      if( /(android)/i.test(navigator.userAgent) ) {
        admobid = options.android;
      }
      else {
        admobid = options.ios;
      }

      AdMob.createBanner({
        adId:admobid.banner,
        position:AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow: false,
      });

      this.admobid = admobid;
      // 
      AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false} );
    },
    showBanner: function() {
      if (!window.AdMob) return ;
      AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
    },
    showInterstitial: function() {
      if (!window.AdMob) return ;

      AdMob.showInterstitial(function() {
        AdMob.prepareInterstitial( {adId:this.admobid.interstitial, autoShow:false} );
        console.log('success');
      }.bind(this));
    },
  },
  gamecenter: {
    auth: function() {
      // login gamecenter
      if (window.gamecenter) {
        gamecenter.auth();
      }
    },
    showLeaderboard: function(board_id) {
      if (!window.gamecenter) return ;

      var data = {
        leaderboardId: board_id
      };
      gamecenter.showLeaderboard(null, null, data);
    },
    submitScore: function(board_id, score) {
      if (!window.gamecenter) return ;

      var data = {
        score: score,
        leaderboardId: board_id,
      };

      gamecenter.submitScore(function() {
        // alert('success');
      }, function() {
        // alert('failure');
      }, data);
    },
  },

  statusBar: {
    show: function() {
      if (!window.StatusBar) return ;
      StatusBar.show();
    },
    hide: function() {
      if (!window.StatusBar) return ;
      StatusBar.hide();
    },
  },

  launchReview: {
    init: function(idSet) {
      if (!window.LaunchReview) return ;

      var appId = null;
      var platform = device.platform.toLowerCase();

      switch(platform) {
        case 'ios':
          appId = idSet.ios;
          break;
        case 'android':
          appId = idSet.android;
          break;
      }

      this.appId = appId;
    },
    launch: function() {
      if (!window.LaunchReview) return ;

      LaunchReview.launch(this.appId, function(){
        console.log("Successfully launched store app");
      });
    },
  },
  socialmessage: {
    send: function(message) {
      if (!window.socialmessage) return ;

      // message.activityTypes = ["PostToTwitter", "PostToFacebook", "Mail", "Message", "AirDrop", "CopyToPasteboard"];
      // message.activityTypes = ["PostToTwitter", "PostToFacebook", "Message", "Mail"];

      socialmessage.send(message);
      return this;
    },
  },

  nend: {
    createBanner: function(apiKey, spotId) {
      if (!window.Nend) return ;

      var options = {};
      options.bannerApiKey = apiKey;
      options.bannerSpotId = spotId;
      // options.bannerWidth = 300; // optional (default: 320)
      // options.bannerHeight = 250; // optional (default: 50)
      // options.bannerBackgroundColor = "0xff0000"; // background color for banner view (default: "0xFFFFFF")

      Nend.setOptions(options); // If you don't call this function, a key and an id for testing will be used instead.
      Nend.createBanner(); // Being invoked in "deviceready" event might be good.
    },
    showBanner: function() {
      if (!window.Nend) return ;
      Nend.showBanner();
    },
    hideBanner: function() {
      if (!window.Nend) return ;
      Nend.hideBanner();
    },

    createInterstitial: function(apiKey, spotId) {
      if (!window.Nend) return ;

      var options = {};
      options.interstitialApiKey = apiKey;
      options.interstitialSpotId = spotId;

      Nend.setOptions(options); // If you don't call this function, a key and an id for testing will be used instead.
      Nend.createInterstitial(); // Being invoked in "deviceready" event might be good.
    },
    showInterstitial: function() {
      if (!window.Nend) return ;
      Nend.showInterstitial();
    },
  },

  on: function(eventName, listener) {
    if (!this._listener) {
      this._listener = {};
    }
    if (!this._listener[eventName]) {
      this._listener[eventName] = [];
    }

    this._listener[eventName].push(listener);
  },

  fire: function(eventName) {
    if (!this._listener[eventName]) return ;

    this._listener[eventName].forEach(function(listener) {
      listener();
    });
  },
};

document.addEventListener('deviceready', function(e) {
  hybrid.fire('deviceready');
});

document.addEventListener('pause', function(e) {
  hybrid.fire('pause');
});

document.addEventListener('resume', function() {
  hybrid.fire('resume');
});

hybrid.on('deviceready', function() {
  // login game center
  hybrid.gamecenter.auth();

  // StatusBar
  hybrid.statusBar.hide();

  // launchReview
  hybrid.launchReview.init({
    ios: '978643804',
    android: 'jp.phi.FlickArrow_',
  });
});
