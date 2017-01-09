var autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync').create(),
    gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    svgmin = require('gulp-svgmin'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence');

var paths = {
  sass: 'scss/*.scss'
};




// -----------------------------------------------------------------------------
// start local server ----------------------------------------------------------
// -----------------------------------------------------------------------------
gulp.task('browser-sync', function() {
    browserSync.init(['**/*.css', 'js/*.js', '**/*.html'], {
      // This port should be different from the express app port
      server: './',
      port: 51723,
      browser: ['opera'],
  });
});


// -----------------------------------------------------------------------------
// optimize svg ----------------------------------------------------------------
// -----------------------------------------------------------------------------
gulp.task('svg-optimize', function () {
  return gulp.src(['svg/*.svg'])
  .pipe(svgmin())
  .pipe(gulp.dest('svg'));
});


// -----------------------------------------------------------------------------
// sass compailer --------------------------------------------------------------
// -----------------------------------------------------------------------------
gulp.task('css-compile', function() {
    gulp.src([
      'scss/osmodal.scss'
    ])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({
      includePaths:['scss'],
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('css'));
});


// -----------------------------------------------------------------------------
// auto prefix css for better browser support ----------------------------------
// -----------------------------------------------------------------------------
gulp.task('css-autoprefix', function () {
  gulp.src([
    'css/osmodal.css'
  ])
  .pipe(sourcemaps.init())
  .pipe(postcss([
    autoprefixer({
      browsers: ['last 10 versions']
    })
  ]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('css'));
});



// -----------------------------------------------------------------------------
// minify css ------------------------------------------------------------------
// -----------------------------------------------------------------------------
gulp.task('css-minify', function() {
  gulp.src([
    'css/osmodal.css'
    ])
    .pipe(plumber())
    .pipe(cssnano({discardComments: {removeAll: true}}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/css'));
});


// -----------------------------------------------------------------------------
// minify js --------------------------------------------------------
// -----------------------------------------------------------------------------
gulp.task('js-minify', function() {
  gulp.src([
    'js/osmodal.js'
    ])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/js'));
});


// -----------------------------------------------------------------------------
// watching sass files  --------------------------------------------------------
// -----------------------------------------------------------------------------
gulp.task('scss-watch', ['css-compile'], function() {
  gulp.watch('scss/**/*.scss', ['css-compile']);
});


// ----------------------------------------------------------------------------
// default gulp task  ---------------------------------------------------------
// ----------------------------------------------------------------------------
gulp.task('default', function() {
  runSequence(
              //'iconfont',
              'browser-sync',
              'scss-watch'
            );
});
