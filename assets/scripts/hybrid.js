
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

  // login gamecenter
  if (window.gamecenter) {
    gamecenter.auth();
  }

  // 
  if (window.StatusBar) {
    StatusBar.hide();
  }
});
