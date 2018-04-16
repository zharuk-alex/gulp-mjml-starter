var gulp = require('gulp');
var mjml = require('gulp-mjml');
var browserSync = require('browser-sync').create();
var folderIndex = require("gulp-folder-index");
var del = require('del');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jpegtran = require('imagemin-jpegtran');
var cache = require('gulp-cache');
//

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        notify: true
    });
});

gulp.task('clean', function() {
  return del.sync('./html/**/*');
});

gulp.task('emailsIndex', ['mjml'], function() {
  return gulp.src('html/*.html')
    .pipe(folderIndex({
      extension: '.html',
      filename: 'index.json',
      prefix: 'http://localhost:3000/html',
      directory: false
    }))
    .pipe(gulp.dest('./'));
});



gulp.task('mjml', function () {
  return gulp.src('./assets/*.mjml')
    .pipe(mjml())
    .pipe(gulp.dest('./html'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
  return gulp.src('./assets/images/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [
      {
        removeViewBox: false
      }
    ],
    use: [pngquant()]
  })))
  .pipe(gulp.dest('./html/images/'));
});

gulp.task('watch', ['browser-sync', 'clean', 'emailsIndex', 'img'], function() {
  gulp.watch('./assets/**/*.mjml', ['mjml']);
  gulp.watch('./assets/images/*', ['img'], browserSync.reload);
});

gulp.task('default', ['watch']);
