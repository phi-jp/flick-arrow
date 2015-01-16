/*
 *
 */

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', ['build']);  

gulp.task('build', function() {  
  var scripts = [
    './scripts/constant.js',
    './scripts/game.js',
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


