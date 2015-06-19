var gulp = require('gulp')
var concat = require('gulp-concat')
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var size = require('gulp-size');
var bowerMain = require('bower-main');

var bowerMainJavaScriptFiles = bowerMain('js', 'min.js');

gulp.task('bower', function() {
    gulp.src(bowerMainJavaScriptFiles.minified)
        .pipe(gulp.dest('lib'))
});

gulp.task('dev', function() {
    gulp.src([
            'src/module.js',
            'src/**/*.js'
        ])
        .pipe(ngAnnotate())
        .pipe(concat('prim.js'))
        .pipe(gulp.dest('build'))
        .pipe(size())
});

gulp.task('min', function() {
    gulp.src([
            'src/module.js',
            'src/**/*.js'
        ])
        .pipe(ngAnnotate())
        .pipe(concat('prim.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build'))
        .pipe(size())
});

gulp.task('ui', function() {
    gulp.src(['ui-bootstrap.0.13.js'])
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('lib'))
        .pipe(size())
});

gulp.task('prod', function() {
    gulp.src([
            'lib/angular.min.js',
            'lib/*.js',
            'build/prim.min.js'
        ])
        .pipe(concat('prim.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dest'))
        .pipe(size())
});
