var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var watchify = require('watchify');
var errorify = require('errorify');

var watch = function() {
  browserSync.init({
    server: './app'
  });
  gulp.watch('./app/scss/**', ['styles']);
};

var build = function () {
  var b = browserify(
    {
      entries: './app/src/main.js',
      transform: [["babelify", {presets: ["es2015"]}], ['jstify']],
      cache: {},
      packageCache: {},
      fullPaths: true
    }
  );

  b.plugin(errorify);

  var watcher  = watchify(b);

  return watcher
    .on('update', function () {
      var updateStart = Date.now();
      watcher.bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./app/'))
        .pipe(browserSync.stream());
      console.log('Finished : ', (Date.now() - updateStart) + 'ms');
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./app'));
};

var styles = function() {
  return gulp.src('./app/scss/style.scss')
    .pipe(sass({sourceMap : false, outputStyle : 'expanded'}).on('error', sass.logError))
    .pipe(autoprefixer({
            browsers: ['last 40 versions']
          }))
    .pipe(gulp.dest('./app/css'))
    .pipe(browserSync.stream());
};


var start = function () {
  build();
  styles();
  watch();
};

gulp.task('build', function() { return build(); });
gulp.task('styles', function() { return styles(); });
gulp.task('start', function() { return start(); });
