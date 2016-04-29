'use strict';

var argv = require('minimist')(process.argv.slice(2));
var isOnProduction = !!argv.production;

/* --------- plugins --------- */

var
  fs = require('fs'),
  gulp = require('gulp'),
  jade = require('gulp-jade'),
  less = require('gulp-less'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  plumber = require('gulp-plumber'),
  postcss = require('gulp-postcss'),
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
    build: '.',
    jade: {
      location: './jade/**/*.jade',
      compiled: './jade/_pages/*.jade',
      data: './jade/_data/',
      destination: '.'
    },

    style: {
      location: './less/style.less',
      watch: ['./less/*.less', './less/_*/*.less'],
      entryPoint: './css/style.css',
      destination: './css'
    }
  };

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

  gulp.src(paths.jade.compiled)
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

/* --------- styletest --------- */

gulp.task('styletest', function () {
  var processors = [
    stylelint(),
    reporter({
      throwError: true
    })
  ];

  gulp.src(paths.style.watch)
    .pipe(plumber())
    .pipe(postcss(processors, {
      syntax: syntax_less
    }));
});

/* --------- style --------- */

gulp.task('style', ['styletest'], function () {
  gulp.src(paths.style.location)
    .pipe(plumber({
      errorHandler: notify.onError('Error:  <%= error.message %>')
    }))
    // .pipe(gulpIf(!isOnProduction, sourcemaps.init()))
    .pipe(less())
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
    .pipe(gulp.dest(paths.style.destination))
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

var allTasks = ['style', 'jade'];
if (!isOnProduction) {
  allTasks.push('serve');
}

gulp.task('default', allTasks, function () {
  if (!isOnProduction) {
    gulp.watch(paths.style.watch, ['style', server.stream]);
    gulp.watch(paths.jade.location, ['jade', server.reload]);
  }
});
