cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "pluginId": "cordova-plugin-statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/cordova-plugin-game-center/www/gamecenter.js",
        "id": "cordova-plugin-game-center.GameCenter",
        "pluginId": "cordova-plugin-game-center",
        "clobbers": [
            "gamecenter"
        ]
    },
    {
        "file": "plugins/com.effers.kaky.nend/www/nend.js",
        "id": "com.effers.kaky.nend.Nend",
        "pluginId": "com.effers.kaky.nend",
        "clobbers": [
            "Nend"
        ]
    },
    {
        "file": "plugins/cordova-launch-review/www/launchreview.js",
        "id": "cordova-launch-review.LaunchReview",
        "pluginId": "cordova-launch-review",
        "clobbers": [
            "LaunchReview"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-social-message/www/socialmessage.js",
        "id": "cordova-plugin-social-message.SocialMessage",
        "pluginId": "cordova-plugin-social-message",
        "clobbers": [
            "socialmessage"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.0",
    "cordova-plugin-statusbar": "2.0.0",
    "cordova-plugin-game-center": "0.4.2",
    "com.effers.kaky.nend": "0.1.0",
    "cordova-launch-review": "1.0.2",
    "cordova-plugin-device": "1.1.0",
    "cordova-plugin-social-message": "0.3.1"
}
// BOTTOM OF METADATA
});