/*
 * index.js
 */



document.addEventListener('deviceready', function() {

    debugger;

var message = {
    text: "This is a test message",
    activityTypes: ["Mail", "Facebook", "PostToFacebook", "PostToTwitter"]
};
window.socialmessage.send(message);

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
