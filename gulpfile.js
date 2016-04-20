/* --------- plugins --------- */

var
	gulp        = require('gulp'),
	jade        = require('gulp-jade'),
	less        = require('gulp-less');

/* --------- paths --------- */

var
	paths = {
		jade : {
			location: 'jade/**/*.jade',
			compiled: 'jade/_pages/*.jade',
			destination: '.'
		},

		less : {
			location    : 'less/**/*.less',
			entryPoint  : 'css/style.css',
			destination: 'css'
		}
	};

/* --------- jade --------- */

gulp.task('jade', function() {
	gulp.src(paths.jade.compiled)
		.pipe(jade({
			pretty: '\t',
		}))
		.pipe(gulp.dest(paths.jade.destination));
});

/* --------- scss --------- */

gulp.task('less', function () {
	gulp.src(paths.less.location)
    	.pipe(gulp.dest(paths.less.destination));
});

/* --------- watch --------- */

gulp.task('watch', function(){
	gulp.watch(paths.jade.location, ['jade']);
	gulp.watch(paths.less.location, ['less']);
});

/* --------- default --------- */

gulp.task('default', ['jade', 'less', 'watch']);
