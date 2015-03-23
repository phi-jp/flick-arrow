/*
 * index.js
 */



document.addEventListener('deviceready', function() {

    // var message = {
    //     text: "This is a test message",
    //     activityTypes: ["Mail", "Facebook", "PostToFacebook", "PostToTwitter"]
    // };
    // window.socialmessage.send(message);

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

}, false);
