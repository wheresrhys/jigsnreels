var gulp = require('gulp');

gulp.task('clean', function () {
	return require('del')('./public');
});

gulp.task('tpl', function  () {
	return gulp.src('client/**/*.html')
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
});

gulp.task('sass', function () {
	return gulp.src('client/main.scss')
		.pipe(require('gulp-sass')())//{outputStyle: 'compressed'}))
		.pipe(require('gulp-csso')())
		.pipe(gulp.dest('./public'));
} );


// gulp.task('clean-build', ['clean'], ['tpl', 'js', 'sass']);

gulp.task('default', ['tpl', 'js', 'sass']);

gulp.task('watch', function() {
	gulp.watch('./client/**/*.scss', ['sass']);
	gulp.watch('./client/**/*.js', ['jshint', 'js']);
	gulp.watch('./client/**/*.html', ['tpl', 'js']);
});