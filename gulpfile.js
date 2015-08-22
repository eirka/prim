var gulp = require('gulp');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var del = require('del');
var ngHtml2Js = require("gulp-ng-html2js");
var htmlmin = require('gulp-htmlmin');
var csso = require('gulp-csso');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');

gulp.task('default', function(callback) {
    runSequence('clean', 'prim', 'templates', 'ui-bootstrap', 'app', 'browserify', 'css', callback);
});

// clean env
gulp.task('clean', function() {
    return del(['./dist', './build']);
});

// build and minify prim
gulp.task('prim', function() {
    return gulp.src([
            './src/module.js',
            './src/**/*.js'
        ])
        .pipe(ngAnnotate())
        .pipe(concat('prim.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

// build and minify templates
gulp.task('templates', function() {
    return gulp.src(['./src/templates/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(ngHtml2Js({
            moduleName: "prim",
            declareModule: false,
            prefix: "pages/"
        }))
        .pipe(ngAnnotate())
        .pipe(concat('templates.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

// build and minify ui-bootstrap
gulp.task('ui-bootstrap', function() {
    return gulp.src(['./ui-bootstrap.0.13.js'])
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./build'));
});

// concat the build dir
gulp.task('app', function() {
    return gulp.src(['./build/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./build'));
});

// browserify the app and place in dist
gulp.task('browserify', function() {
    return browserify('./build/app.js')
        .bundle()
        .pipe(source('prim.js'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('css', function() {
    return gulp.src([
            './src/css/prim.css',
            './node_modules/angular-hotkeys/build/hotkeys.min.css',
            './node_modules/angularjs-toaster/toaster.min.css'
        ])
        .pipe(concat('prim.css'))
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions']
        })]))
        .pipe(csso())
        .pipe(gulp.dest('./dist'));
});
