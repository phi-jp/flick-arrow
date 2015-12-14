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
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.0",
    "cordova-plugin-statusbar": "2.0.0",
    "cordova-plugin-game-center": "0.4.2",
    "com.effers.kaky.nend": "0.1.0"
}
// BOTTOM OF METADATA
});