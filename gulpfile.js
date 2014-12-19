var gulp = require('gulp');
var gulpif = require('gulp-if');
var streamify = require('gulp-streamify');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');

gulp.task('clean', function () {
	return require('del')('./public');
});

gulp.task('img', function  () {
	return gulp.src('client/scaffolding/global-styles/**/*.svg')
		.pipe(gulp.dest('./public'));
});

gulp.task('jshint', function () {
	var jshint = require('gulp-jshint');
	return gulp.src('client/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default', { verbose: true }))
		.pipe(jshint.reporter(require('jshint-stylish')))
		.pipe(jshint.reporter('fail'));
		// .pipe(require('gulp-jscs')());
});

gulp.task('js', function () {
	return gulp
		.src('./client/main.js', { read: false })
		.pipe(require('gulp-browserify')({
			basedir: __dirname + '/client',
			debug: process.env.NODE_ENV === 'development',
			transform: ['debowerify', require('swigify')({compress: null})],
			exclude: ['underscore', 'jquery'],
			shim: {
				abc: {
					path: './bower_components/abcjs/bin/abcjs_basic_1.9-min.js',
					exports: 'ABCJS'
				},
				backbone: {
					path: './bower_components/exoskeleton/exoskeleton.js',
					exports: 'Backbone'
				}
			}
		}))
		.pipe(gulpif(process.env.NODE_ENV !== 'development', streamify(uglify())))
		.pipe(gulp.dest('./public'));
});

gulp.task('sass', function () {
	return gulp.src('client/main.scss')
		.pipe(require('gulp-sass')({
			outputStyle: (process.env.NODE_ENV !== 'development') && 'compressed'
		}))
		.pipe(gulpif(process.env.NODE_ENV !== 'development', csso()))
		.pipe(gulp.dest('./public'));
} );

// gulp.task('jshint', ['jshint']);


// gulp.task('clean-build', ['clean'], ['tpl', 'js', 'sass']);

gulp.task('default', ['js', 'sass', 'img']);

gulp.task('watch', function() {
	gulp.watch('./client/**/*.scss', ['sass']);
	gulp.watch('./client/**/*.js', ['jshint', 'js']);
	gulp.watch('./client/**/*.html', ['js']);
});