
var gulp = require('gulp');
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
        reloadDelay: 1000
    });
});


gulp.task('templates', function() {
    var YOUR_LOCALS = {};

    gulp.src(['!app/layouts/**', './app/**/*.jade'])
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
        .pipe(gulp.dest('./build/css'));
});


gulp.task('ts', function () {
    gulp.src('app/scripts/ts/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            out: 'tsApp.js'
        }))
        .pipe(gulp.dest('build/js'));
});


gulp.task('js', function () {
    gulp.src('app/scripts/js/**/*.js')

        .pipe(gulp.dest('build/js'));
});


gulp.task('images', function () {
    gulp.src('app/img/**/*')

        .pipe(gulp.dest('build/img'));
});


gulp.task('fonts', function () {
    gulp.src('app/fonts/**/*')

        .pipe(gulp.dest('build/fonts'));
});


gulp.task('lib-scripts', function () {
   gulp.src('app/lib/scripts/**/*.js')
       .pipe(gulp.dest('build/lib/scripts'));
});


gulp.task('lib-styles', function () {
    gulp.src('app/lib/styles/**/*.css')
        .pipe(gulp.dest('build/lib/styles'));
});


gulp.task('lib-fonts', function () {
    gulp.src('app/lib/fonts/**/*')
        .pipe(gulp.dest('build/lib/fonts'));
});


gulp.task('delete', function() {
    del.sync('build'); // Удаляем папку dist перед сборкой
});


gulp.task('clean', function () {
    cache.clearAll();
});


gulp.task('watch', ['server', 'templates', 'styles', 'ts', 'js', 'images', 'fonts', 'lib-scripts', 'lib-styles', 'lib-fonts'], function() {
    gulp.watch('./app/img/**/*', ['images']).on("change", reload);
    gulp.watch('./app/fonts/**/*', ['fonts']).on("change", reload);
    gulp.watch('./app/css/**/*.css', ['templates', 'styles', 'js', 'ts', 'images', 'fonts']).on("change", reload);
    gulp.watch('./app/**/*.jade', ['templates', 'styles', 'js', 'ts', 'images', 'fonts']).on("change", reload);
    gulp.watch('./app/scripts/ts/**/*.ts', ['templates', 'styles', 'js', 'ts', 'images', 'fonts']).on("change", reload);
    gulp.watch('./app/scripts/js/**/*.js', ['templates', 'styles', 'js', 'ts', 'images', 'fonts']).on("change", reload);
    gulp.watch('./app/lib/scripts/**/*.js', ['lib-scripts']).on("change", reload);
    gulp.watch('./app/lib/styles/**/*.css', ['lib-styles']).on("change", reload);
    gulp.watch('./app/lib/fonts/**/*', ['lib-fonts']).on("change", reload);
});


gulp.task('build', ['delete', 'clean', 'watch']);


gulp.task('default', ['watch']);
