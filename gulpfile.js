var gulp = require('gulp');

gulp.task('clean', function () {
		return require('del')('./public');
});

function tpl () {
	return gulp.src('client/**/*.html')
		.pipe(gulp.dest('./public'));
}

function js () {
	return gulp.src('./client/main.js', { read: false })
		.pipe(require('gulp-browserify')({
			basedir: __dirname + '/client',
			debug: true,
			transform: ['debowerify', require('swigify')()],
			exclude: ['underscore', 'jquery'],
			shim: {
	            abcjs: {
	                path: './bower_components/abcjs/index.js',
	                exports: 'ABCJS'
	            },
	            backbone: {
	            	path: './bower_components/exoskeleton/exoskeleton.js',
	            	exports: 'Backbone'
	            }
            }
		}))
		// .pipe(require('gulp-uglify')())
		.pipe(gulp.dest('./public'));
}

function sass () {
	return gulp.src('client/main.scss')
		.pipe(require('gulp-sass')())//{outputStyle: 'compressed'}))
		.pipe(require('gulp-csso')())
		.pipe(gulp.dest('./public'));
} 

gulp.task('tpl', tpl);
gulp.task('js', js);
gulp.task('sass', sass);


gulp.task('clean-build', ['clean'], function () {
	tpl();
	js();
	sass();
});

gulp.task('default', ['tpl', 'js', 'sass']);

gulp.task('watch', function() {
	gulp.watch('./client/**/*.scss', ['sass']);
	gulp.watch('./client/**/*.js', ['js']);
	gulp.watch('./client/**/*.html', ['tpl']);
});