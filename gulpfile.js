/*
 *
 */

var gulp = require('gulp');
var ghelper = require('gulp-helper');
ghelper.require();

gulp.task('default', ['build']);  

gulp.task('build', function() {  
  var scripts = [
    './scripts/constant.js',
    './scripts/element.js',
    './scripts/scenes/title.js',
    './scripts/scenes/game.js',
    './scripts/scenes/result.js',
    './scripts/countscene.js',
    './scripts/main.js',
  ];
  gulp.src(scripts)
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./build'))
    .pipe(uglify())
    .pipe(rename({
      extname: ".min.js",
    }))
    .pipe(gulp.dest('./build'))
    ;
});

gulp.task('dev', function() {
  gulp.src('./')
    .pipe(webserver({
      // livereload: true, // ライブリロードを有効に
      open: true,       // タスク実行と同時にページを開く
    }))
    ;
});


