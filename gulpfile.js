var gulp = require('gulp');
var util = require('gulp-util');
var gulpif = require('gulp-if');
var rsync = require('gulp-rsync');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var runSequence = require('run-sequence');
var del = require('del');
var ngHtml2Js = require("gulp-ng-html2js");
var htmlmin = require('gulp-htmlmin');
var csso = require('gulp-csso');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var glob = require('glob');
var nano = require('gulp-cssnano');
var rev = require('gulp-rev');
var bump = require('gulp-bump');

// dev flag
var isDev = util.env.dev;

gulp.task('default', function(callback) {
    runSequence('clean', 'prim', 'templates', 'ui-bootstrap', 'browserify', 'css', 'bump', 'deploy', callback);
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
        .pipe(concat('prim.js'))
        .pipe(gulp.dest('./build'));
});

// build and minify templates
gulp.task('templates', function() {
    return gulp.src(['./src/templates/*.html',
            './src/templates/**/*.html'
        ])
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
        .pipe(gulp.dest('./build'));
});

// build and minify ui-bootstrap
gulp.task('ui-bootstrap', function() {
    return gulp.src(['./ui-bootstrap.1.1.2.js'])
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./build'));
});

// browserify the app and place in dist
gulp.task('browserify', function() {
    // get all our files
    var files = glob.sync('./build/*.js');

    // new browserify
    var b = browserify({
        entries: files
    });

    // bundle and uglify the file
    return b.bundle()
        .pipe(source('prim.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulpif(!isDev, rev()))
        .pipe(gulp.dest('./dist'))
});

// optimize css and autoprefix
gulp.task('css', function() {
    return gulp.src([
            './src/css/prim.css',
            './node_modules/angular-hotkeys/build/hotkeys.min.css',
            './node_modules/angularjs-toaster/toaster.min.css',
            './node_modules/angular-chart.js/dist/angular-chart.min.css'
        ])
        .pipe(concat('prim.css'))
        .pipe(nano({
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(csso())
        .pipe(postcss([autoprefixer({
            browsers: ['last 2 versions']
        })]))
        .pipe(gulpif(!isDev, rev()))
        .pipe(gulp.dest('./dist'));
});

// bump the version
gulp.task('bump', function() {
    gulp.src('./package.json')
        .pipe(gulpif(!isDev, bump()))
        .pipe(gulp.dest('./'));
});

// upload to dev server
gulp.task('deploy', function() {
    return gulp.src(['./dist/*'])
        .pipe(gulpif(isDev, rsync({
            username: 'root',
            root: 'dist',
            hostname: 'dev.trish.io',
            destination: '/data/prim/assets/prim'
        })));
});
