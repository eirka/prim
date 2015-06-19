var gulp = require('gulp')
var concat = require('gulp-concat')
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var size = require('gulp-size');

gulp.task('default', function() {
    gulp.src([
            'src/module.js',
            'src/**/*.js'
        ])
        .pipe(ngAnnotate())
        .pipe(concat('prim.js'))
        .pipe(gulp.dest('dist'))
        .pipe(size())
        .pipe(rename("prim.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(size())
});
