var annotate = require('gulp-ng-annotate');
var gulp = require('gulp');
var path = require('path');
var rename = require('gulp-rename');
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var Server = require('karma').Server;
var uglify = require('gulp-uglify');

var COVERAGE = path.resolve(__dirname, 'coverage');
var DIST = path.resolve(__dirname, 'dist');
var LIB = path.resolve(__dirname, 'lib');

gulp.task('clean:coverage', function(cb) {
  rimraf(COVERAGE + '/**', cb);
});

gulp.task('clean:dist', function(cb) {
  rimraf(DIST + '/**', cb);
});

gulp.task('clean', ['clean:coverage', 'clean:dist']);

gulp.task('copy', function(cb) {
  return gulp.src([LIB + '/angular-async-form.js'])
      .pipe(gulp.dest(DIST));
});

gulp.task('build', ['copy'], function() {
  return gulp.src([DIST + '/angular-async-form.js'])
      .pipe(annotate())
      .pipe(uglify())
      .pipe(rename('angular-async-form.min.js'))
      .pipe(gulp.dest(DIST));
});

gulp.task('test', function(cb) {
  new Server({
    configFile: path.resolve(__dirname, 'karma.conf.js'),
    singleRun: true
  }, cb).start();
});

gulp.task('test:watch', function(cb) {
  new Server({
    configFile: path.resolve(__dirname, 'karma.conf.js')
  }, cb).start();
});

gulp.task('default', function(cb) {
  runSequence(
    'clean',
    'build',
    cb
  );
});
