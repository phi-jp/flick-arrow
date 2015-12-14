
var NEND_BANNER_API_KEY = '8f4af98e1d2fb9ae6eb704f8182731a9c2bc1c67';
var NEND_BANNER_SPOT_ID = '497147';
var NEND_INTERSTITIAL_API_KEY = 'b41a30d6ce3eb4a1a34ae36c04636792b254bf68';
var NEND_INTERSTITIAL_SPOT_ID = '497174';


var hybrid = {
  admob: {
    prepareInterstitial: function() {
      if (!window.AdMob) return ;
      AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:true} );
    },
  },
  gamecenter: {
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
  var admobid = {};
  // select the right Ad Id according to platform
  if( /(android)/i.test(navigator.userAgent) ) { 
    admobid = { // for Android
      banner: '????',
      interstitial: '????'
    };
  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobid = { // for iOS
      banner: 'ca-app-pub-1611962793956940/2978822116',
      interstitial: 'ca-app-pub-1611962793956940/4455555319'
    };
  } else {
    admobid = { // for Windows Phone
      banner: 'ca-app-pub-1611962793956940/2978822116',
      interstitial: 'ca-app-pub-1611962793956940/4455555319'
    };
  }

  window.admobid = admobid;

  if(window.AdMob) {
    setTimeout(function() {
      AdMob.createBanner({
        adId:admobid.banner, 
        position:AdMob.AD_POSITION.BOTTOM_CENTER, 
      });
    }, 1000);
  }
  
  hybrid.nend.createBanner(NEND_BANNER_API_KEY, NEND_BANNER_SPOT_ID);
  hybrid.nend.showBanner();
  hybrid.nend.createInterstitial(NEND_INTERSTITIAL_API_KEY, NEND_INTERSTITIAL_SPOT_ID);

  // login gamecenter
  if (window.gamecenter) {
    gamecenter.auth();
  }

  // StatusBar
  // if (window.StatusBar) {
  //   StatusBar.hide();
  // }

  // launchReview
  hybrid.launchReview.init({
    ios: '978643804',
  });
});
