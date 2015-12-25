/*
 * gulpfile.js
 */

var gulp = require('gulp');
var gutil = require('gulp-util');
var ghelper = require('gulp-helper');
ghelper.require();

var pkg = require('./package.json');
var ip = require('ip');

gulp.task('download', function() {
  var files = [
    'https://raw.githubusercontent.com/phi-jp/phina.js/develop/build/phina.js',
    'https://raw.githubusercontent.com/phi-jp/phina.js/develop/build/phina.min.js',
  ];
  download(files)
    .pipe(gulp.dest('assets/plugins/phina.js/'));
});

gulp.task('copy', function() {
  var ios = '../wrapp/platforms/ios/platform_www/**';
  var android = '../wrapp/platforms/android/platform_www/**';

  gulp.src(ios).pipe(gulp.dest('assets/plugins/cordova/ios'));
  gulp.src(android).pipe(gulp.dest('assets/plugins/cordova/android'));
});

gulp.task('server', function() {
  express.run(['src/index.js']);
});

gulp.task('default', ['server']);
