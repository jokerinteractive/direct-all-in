/* --------- plugins --------- */

var
	gulp        = require('gulp'),
	jade        = require('gulp-jade'),
	plumber     = require('gulp-plumber'),
	less        = require('gulp-less');

/* --------- paths --------- */

var
	paths = {
		jade : {
			location: './jade/**/*.jade',
			compiled: './jade/_pages/*.jade',
			destination: '.'
		},

		less : {
			location    : './less/style.less',
			watch		: './less/**/*.less',
			entryPoint  : './css/style.css',
			destination: './css'
		}
	};

/* --------- jade --------- */

gulp.task('jade', function() {
	gulp.src(paths.jade.compiled)
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
		}))
		.pipe(gulp.dest(paths.jade.destination));
});

/* --------- less --------- */

gulp.task('less', function () {
	gulp.src(paths.less.location)
		.pipe(plumber())
    	.pipe(less())
    	.pipe(gulp.dest(paths.less.destination));
});

/* --------- watch --------- */

gulp.task('watch', function(){
	gulp.watch(paths.jade.location, ['jade']);
	gulp.watch(paths.less.watch, ['less']);
});

/* --------- default --------- */

gulp.task('default', ['jade', 'less', 'watch']);
