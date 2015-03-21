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
                position:AdMob.AD_POSITION.TOP_CENTER, 
            });
            AdMob.createBanner({
                adId:admobid.banner, 
                position:AdMob.AD_POSITION.BOTTOM_CENTER, 
            });
        }, 2000);
    }

    // login gamecenter
    if (window.gamecenter) {
        gamecenter.auth();
    }

}, false);

/*
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        // var ref = window.open('http://junk.tmlife.net/hoge/', '_blank', 'location=no,toolbar=no');
        // var ref = window.open('http://junk.tmlife.net/hoge/', '_self', 'location=no,toolbar=no');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    },

};



app.initialize();
*/

// window.open('http://google.com', '_system', 'location=no');
