/* global process */
'use strict';

var gulp        = require('gulp');
var source      = require('vinyl-source-stream');
var browserify  = require('browserify');
var uglify      = require('gulp-uglify');
var zip         = require('gulp-zip');
var runSequence = require('run-sequence');
var gulpif      = require('gulp-if');
var streamify   = require('gulp-streamify');

var env = process.env.NODE_ENV || 'development';
var outputDir = 'builds/development';

gulp.task('js', function() {
	return browserify('./src/js/main')
		.bundle({ 'debug': env === 'development' })
		.pipe(source('main.js'))
		// .pipe(gulpif(env !== 'development', streamify(uglify())))
		.pipe(gulp.dest(outputDir));
});

gulp.task('files', function() {
	return gulp.src('./src/files/**/*')
		.pipe(gulp.dest(outputDir));
});

gulp.task('build', function() {
	env = 'gadget';
	outputDir = './builds/production';

	runSequence(['js', 'files'], 'zip');
});

gulp.task('zip', function() {
	return gulp.src(outputDir + '/**/*')
		.pipe(zip('Streamsniper.gadget'))
		.pipe(gulp.dest('./builds/gadget'));
});

gulp.task('watch', function() {
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('./src/files/**/*', ['files']);
});

gulp.task('default', ['js', 'files', 'watch']);