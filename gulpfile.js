var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var jade = require('gulp-jade');
var postcss = require('gulp-postcss');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var autoprefixer = require('autoprefixer');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var cache = require('gulp-cache');
var del = require('del');


gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: 'build'
        },
        notify: false,
        open: false,
        reloadDelay: 3000
    });
});


gulp.task('templates', function() {
  var YOUR_LOCALS = {};
  gulp.src(['!./app/layouts/**', './app/**/*.jade'])
    .pipe(jade({
        locals: YOUR_LOCALS,
        pretty: true
    }))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('styles', function () {
  gulp.src('./app/assets/css/**/*.css')
    .pipe(postcss([ autoprefixer() ]))
    .pipe(concatCss("app.css"))
    .pipe(gulp.dest('./build/assets/css'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('scripts', function () {
  gulp.src('./app/assets/js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/assets/js'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('images', function () {
  gulp.src('./app/assets/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./build/assets/img'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('fonts', function () {
  gulp.src('./app/assets/fonts/**/*')
    .pipe(gulp.dest('./build/assets/fonts'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('lib-scripts', function () {
  gulp.src('./app/assets/vendor/js/**/*.js')
    .pipe(gulp.dest('./build/assets/vendor//scripts'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('lib-styles', function () {
  gulp.src('./app/assets/vendor/css/**/*.css')
    .pipe(gulp.dest('./build/assets/vendor/styles'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('lib-fonts', function () {
  gulp.src('./app/assets/vendor/fonts/**/*')
    .pipe(gulp.dest('./build/assets/vendor/fonts'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('delete', function() {
    del.sync('build'); // Удаляем папку dist перед сборкой
});


gulp.task('clean', function () {
    cache.clearAll(); // Удаляем Кэш
});

gulp.task('watch', ['server', 'templates', 'styles', 'scripts', 'images', 'fonts', 'lib-scripts', 'lib-styles', 'lib-fonts'], function () {
  watch('./app/**/*.jade', batch(function (events, done) { gulp.start('templates', done); }));
  watch('./app/assets/css/**/*.css', batch(function (events, done) { gulp.start('styles', done); }));
  watch('./app/assets/js/**/*.js', batch(function (events, done) { gulp.start('scripts', done); }));
  watch('./app/assets/img/**/*', batch(function (events, done) { gulp.start('images', done); }));
  watch('./app/assets/fonts/**/*', batch(function (events, done) { gulp.start('fonts', done); }));
  watch('./app/assets/vendor/js/**/*.js', batch(function (events, done) { gulp.start('lib-scripts', done); }));
  watch('./app/assets/vendor/css/**/*.css', batch(function (events, done) { gulp.start('lib-styles', done); }));
  watch('./app/assets/vendor/fonts/**/*', batch(function (events, done) { gulp.start('lib-fonts', done); }));
});


gulp.task('build', ['delete', 'clean', 'watch']);


gulp.task('default', ['watch']);
