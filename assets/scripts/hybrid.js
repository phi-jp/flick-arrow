

var hybrid = {
  admob: {
    prepareInterstitial: function() {
      if (!window.AdMob) return ;
      AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:true} );
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
};


document.addEventListener('deviceready', function() {
  
  // setup nend
  hybrid.nend.createBanner(NEND_BANNER_API_KEY, NEND_BANNER_SPOT_ID);
  hybrid.nend.showBanner();
  hybrid.nend.createInterstitial(NEND_INTERSTITIAL_API_KEY, NEND_INTERSTITIAL_SPOT_ID);

  // login game center
  hybrid.gamecenter.auth();

  // StatusBar
  hybrid.statusBar.hide();

  // launchReview
  hybrid.launchReview.init({
    ios: '978643804',
  });
});
