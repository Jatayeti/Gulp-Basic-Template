'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const del = require('del');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

gulp.task('templates', () => {
  return gulp.src('src/templates/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
});

gulp.task('styles', () => {
  return gulp.src('src/assets/styles/main.styl')
    .pipe(stylus())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('dist/static/css'))
});

gulp.task('scripts', () => {
  return gulp.src('src/assets/js/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('dist/static/js'))
});

gulp.task('images', () => {
  return gulp.src('src/assets/img/**/*.*')
    .pipe(imagemin({
      progressive: true,
    }))
    .pipe(gulp.dest('dist/static/img'))
});

gulp.task('fonts', () => {
  return gulp.src('src/assets/fonts/**/*.*')
    .pipe(gulp.dest('dist/static/fonts'))
});

gulp.task('clean', () => {
  return del('dist')
});

gulp.task('watch', () => {
  gulp.watch('src/templates/**/*.*', gulp.series('templates'));
  gulp.watch('src/assets/styles/**/*.*', gulp.series('styles'));
  gulp.watch('src/assets/js/**/*.*', gulp.series('scripts'));
  gulp.watch('src/assets/img/**/*.*', gulp.series('images'));
  gulp.watch('src/assets/fonts/**/*.*', gulp.series('fonts'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'templates', 'scripts', 'images', 'fonts')));

gulp.task('server', () => {
  browserSync.init({
    server: 'dist',
    open: false
  });

  browserSync.watch('src/**/*.*').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'server')));