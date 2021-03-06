'use strict';

/* --------- plugins --------- */

var
  fs = require('fs'),
  del = require('del'),
  gulp = require('gulp'),
  jade = require('gulp-jade'),
  less = require('gulp-less'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  deploy = require('gulp-gh-pages'),
  plumber = require('gulp-plumber'),
  csscomb = require('gulp-csscomb'),
  postcss = require('gulp-postcss'),
  imagemin = require('gulp-imagemin'),
  syntax_less = require('postcss-less'),
  reporter = require('postcss-reporter'),
  flexboxfixer = require('postcss-flexboxfixer'),
  cssnano = require('cssnano'),
  foldero = require('foldero'),
  server = require('browser-sync'),
  stylelint = require('stylelint'),
  autoprefixer = require('autoprefixer');

/* --------- paths --------- */

var
  paths = {
    build: './build',
    jade: {
      location: './jade/**/*.jade',
      compiled: './jade/_pages/*.jade',
      data: './jade/_data/',
      destination: './build'
    },
    style: {
      src: './less',
      location: './less/style.less',
      watch: ['./less/*.less', './less/_*/*.less'],
      entryPoint: './css/style.css',
      destination: './build/css'
    },
    js: {
      watch: './js/*.js',
      destination: './build/js'
    }
  };

/* --------- clean build folder --------- */

gulp.task('clean', function () {
  return del('build/**/*');
});

/* --------- js compress --------- */

gulp.task('js', function () {
  return gulp.src(paths.js.watch)
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.destination))
    .pipe(notify({
      message: 'JS: <%= file.relative %>',
      sound: 'Pop'
    }));
});

/* --------- img compress --------- */

  gulp.task('images', function() {
  return gulp.src('img/**/*.{png,jpg,gif,svg}')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true
    }))
    .pipe(gulp.dest('build/img'))
    .pipe(notify({
      message: 'Image: <%= file.relative %>'
    }));
});

/* --------- push build to gh-pages --- */

gulp.task('deploy', ['style', 'jade', 'js', 'images'], function () {
  return gulp.src(['./build/**/*'])
    .pipe(deploy())
});

/* --------- jade --------- */

gulp.task('jade', function () {
  var siteData = {};
  if (fs.existsSync(paths.jade.data)) {
    siteData = foldero(paths.jade.data, {
      recurse: true,
      whitelist: '(.*/)*.+\.(json)$',
      loader: function loadAsString(file) {
        var json = {};
        try {
          json = JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (e) {
          console.log('Error Parsing JSON file: ' + file);
          console.log('==== Details Below ====');
          console.log(e);
        }
        return json;
      }
    });
  }

  return gulp.src(paths.jade.compiled)
    .pipe(plumber({
      errorHandler: notify.onError('Error:  <%= error.message %>')
    }))
    .pipe(jade({
      locals: {
        site: {
          data: siteData
        }
      },
      pretty: true
    }))
    .pipe(gulp.dest(paths.jade.destination))
    .pipe(notify({
      message: 'Jade: <%= file.relative %>',
      sound: 'Pop'
    }));
});

/* --------- stylecomb --------- */
gulp.task('csscomb', function () {
  return gulp.src(paths.style.watch)
    .pipe(csscomb())
    .pipe(gulp.dest(paths.style.src));
});

/* --------- styletest --------- */

gulp.task('styletest', function () {
  var processors = [
    stylelint(),
    reporter({
      throwError: true
    })
  ];

  return gulp.src(paths.style.watch)
    .pipe(plumber())
    .pipe(postcss(processors, {
      syntax: syntax_less
    }));
});

/* --------- style --------- */

gulp.task('style', ['styletest'], function () {
  return gulp.src(paths.style.location)
    .pipe(plumber({
      errorHandler: notify.onError('Error:  <%= error.message %>')
    }))
    // .pipe(gulpIf(!isOnProduction, sourcemaps.init()))
    .pipe(less())
    .pipe(gulp.dest(paths.style.destination))
    .pipe(postcss([
      flexboxfixer,
      autoprefixer({
        browsers: [
          'last 2 version',
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'last 2 Opera versions',
          'last 2 Edge versions'
        ]
      }),
      cssnano({
        safe: true
      })
    ]))
    .pipe(rename('style.min.css'))
    // .pipe(gulpIf(!isOnProduction, sourcemaps.write()))
    .pipe(gulp.dest(paths.style.destination))

    .pipe(server.stream())
    .pipe(notify({
      message: 'Style: <%= file.relative %>',
      sound: 'Pop'
    }));
});

/* --------- watch --------- */

gulp.task('watch', function () {
  gulp.watch(paths.jade.location, ['jade']);
  gulp.watch(paths.style.watch, ['style']);
  gulp.watch(paths.js.watch, ['js']);
});

/* --------- serve --------- */

gulp.task('serve', function () {
  server.init({
    server: {
      baseDir: paths.build
    },
    notify: true,
    open: false,
    ui: false
  });
});

/* --------- default --------- */

gulp.task('build', ['style', 'jade', 'images', 'js']);

gulp.task('default', ['style', 'jade'], function () {
  gulp.watch(paths.style.watch, ['style', server.stream]);
  gulp.watch(paths.jade.location, ['jade', server.reload]);
});
