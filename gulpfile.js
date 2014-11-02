var gulp = require('gulp');

gulp.task('clean', function () {
		return require('del')('./public');
});

function tpl () {
	return gulp.src('./client/**/*.html')
		.pipe(gulp.dest('./public'));
}

function js () {
	return gulp.src('./client/main.js')
		.pipe(require('gulp-browserify')({debug:true}))
		.pipe(require('gulp-uglify')())
		.pipe(gulp.dest('./public'));
}

function sass () {
	return gulp.src('./client/main.scss')
		.pipe(require('gulp-sass')())//{outputStyle: 'compressed'}))
		.pipe(require('gulp-csso')())
		.pipe(gulp.dest('./public'));
} 

gulp.task('tpl', tpl);
gulp.task('js', js);
gulp.task('sass', sass);

gulp.watch('./client/**/*/scss', ['sass']);
gulp.watch('./client/**/*/js', ['js']);
gulp.watch('./client/**/*/html', ['tpl']);

gulp.task('clean-build', ['clean'], function () {
	tpl();
	js();
	sass();
});

gulp.task('default', ['tpl', 'js', 'sass']);
