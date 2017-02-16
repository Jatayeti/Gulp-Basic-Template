var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var jade = require('gulp-jade');
var postcss = require('gulp-postcss');
var concatCss = require('gulp-concat-css');
var ts = require('gulp-typescript');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var cache = require('gulp-cache');
var del = require('del');


gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: 'build'
        },
        notify: true,
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
  gulp.src('./app/css/**/*.css')
    .pipe(postcss([ autoprefixer() ]))
    .pipe(concatCss("app.css"))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('ts', function () {
  gulp.src('./app/scripts/ts/**/*.ts')
    .pipe(ts({
        noImplicitAny: true,
        out: 'tsApp.js'
    }))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('js', function () {
  gulp.src('./app/scripts/js/**/*.js')
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('images', function () {
  gulp.src('./app/img/**/*')
    .pipe(gulp.dest('build/img'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('fonts', function () {
  gulp.src('./app/fonts/**/*')
    .pipe(gulp.dest('build/fonts'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('lib-scripts', function () {
  gulp.src('./app/lib/scripts/**/*.js')
    .pipe(gulp.dest('build/lib/scripts'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('lib-styles', function () {
  gulp.src('./app/lib/styles/**/*.css')
    .pipe(gulp.dest('build/lib/styles'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('lib-fonts', function () {
  gulp.src('./app/lib/fonts/**/*')
    .pipe(gulp.dest('build/lib/fonts'))
    .pipe(browserSync.reload({stream: true}));
});


gulp.task('delete', function() {
    del.sync('build'); // Удаляем папку dist перед сборкой
});


gulp.task('clean', function () {
    cache.clearAll(); // Удаляем Кэш
});

gulp.task('watch', ['server', 'templates', 'styles', 'ts', 'js', 'images', 'fonts', 'lib-scripts', 'lib-styles', 'lib-fonts'], function () {
  watch('./app/**/*.jade', batch(function (events, done) { gulp.start('templates', done); }));
  watch('./app/css/**/*.css', batch(function (events, done) { gulp.start('styles', done); }));
  watch('./app/scripts/ts/**/*.ts', batch(function (events, done) { gulp.start('ts', done); }));
  watch('./app/scripts/js/**/*.js', batch(function (events, done) { gulp.start('js', done); }));
  watch('./app/img/**/*', batch(function (events, done) { gulp.start('images', done); }));
  watch('./app/fonts/**/*', batch(function (events, done) { gulp.start('fonts', done); }));
  watch('./app/lib/scripts/**/*.js', batch(function (events, done) { gulp.start('lib-scripts', done); }));
  watch('./app/lib/styles/**/*.css', batch(function (events, done) { gulp.start('lib-styles', done); }));
  watch('./app/lib/fonts/**/*', batch(function (events, done) { gulp.start('lib-fonts', done); }));
});


gulp.task('build', ['delete', 'clean', 'watch']);


gulp.task('default', ['watch']);
