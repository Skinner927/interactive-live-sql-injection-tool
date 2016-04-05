/*eslint-env node */
/*eslint no-unused-vars:0 */
var gulp         = require('gulp'),
    autoprefixer = require('autoprefixer'),
    batch        = require('gulp-batch'),
    beep         = require('beepbeep'),
    concat       = require('gulp-concat'),
    eslint       = require('gulp-eslint'),
    notify       = require('gulp-notify'),
    plumber      = require('gulp-plumber'),
    postcss      = require('gulp-postcss'),
    sass         = require('gulp-sass'),
    watch        = require('gulp-watch'),
    webserver    = require('gulp-webserver');

var paths = Object.freeze({
  index: './app/index.html',
  sass: ['./app/app.scss', 'app/components/**/*.scss'],
  cssOut: './app/css/',
  js: ['./app/**/*.js', '!./app/js/**/*', '!./app/challenges/**/*'], // ensure this negates jsOut
  vendorJs: [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/angular/angular.min.js',
    'node_modules/angular-ui-router/release/angular-ui-router.min.js',
    'node_modules/sql.js/js/sql.js',
    'vendor_custom/prism/prism.js'
  ],
  jsOut: './app/js/'
});

/**
 * Take all sass files and barf them into css/app.css
 */
gulp.task('sass', function() {
  return gulp.src(paths.sass.concat(['./app/_variables.scss']))
    .pipe(sass({
      includePaths: ['./node_modules/bootstrap/scss']
    }).on('error', sass.logError))
    .pipe(postcss([autoprefixer({
      browsers: [
        // Taken from bootstrap 4
        "Android 2.3",
        "Android >= 4",
        "Chrome >= 20",
        "Firefox >= 24",
        "Explorer >= 8",
        "iOS >= 6",
        "Opera >= 12",
        "Safari >= 6"
      ]
    })]))
    .pipe(concat('app.css'))
    .pipe(gulp.dest(paths.cssOut));
});

/**
 * Concats all vendor js into vendor.js
 */
gulp.task('vendorJs', function() {
  return gulp.src(paths.vendorJs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.jsOut));
});

gulp.task('appJs', function() {
  return gulp.src(paths.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.jsOut));
});

/**
 * Will lint all js files and beep on errors
 */
gulp.task('eslint', function() {
  return gulp.src(paths.js.concat(['Gulpfile.js', '!app/vendor.js']))
    .pipe(eslint({
      extends: 'eslint:recommended',
      envs: ['browser'],
      globals: {
        $: false,
        jQuery: false,
        angular: false,
        SQL: false
      },
      rules: {}
    }))
    .pipe(eslint.format())
    .pipe(eslint.formatEach('compact', process.stderr))
    .pipe(eslint.failAfterError())
    .on('error', function() {
      beep();
      notify.onError({
        title: 'Linting Error',
        message: function(error) {
          return error.message;
        }
      }).apply(this, arguments);
    });
});

/**
 * Lints then builds appJs
 */
gulp.task('buildAppJs', ['eslint', 'appJs']);

/**
 * Watches sass and js files for changes
 */
gulp.task('watch', function() {
  watch(paths.sass, batch(function(events, done) {
    gulp.start('sass', done);
  }));

  watch(paths.js, batch(function(events, done) {
    gulp.start('buildAppJs', done);
  }));
});

/**
 * Hosts the app directory as a web app
 */
gulp.task('webserver', function() {
  gulp.src('./app')
    .pipe(webserver({
      host: 'localhost',
      port: 8080,
      livereload: true,
      directoryListing: false
    }));
});

/**
 * The serve task will parse sass, spin up a web server, then watch files for
 * changes.
 */
gulp.task('serve', ['sass', 'buildAppJs', 'vendorJs', 'webserver', 'watch']);


gulp.task('default', ['serve']);
