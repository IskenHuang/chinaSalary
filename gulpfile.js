'use strict';

// Load plugins
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    removeLogs = require('gulp-removelogs'),
    imagemin = require('gulp-imagemin'),
    less = require('gulp-less'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    size = require('gulp-size'),
    connect = require('gulp-connect'),
    bower = require('gulp-bower');

var devPath = 'app/',
    prodPath = './';

// Styles
gulp.task('styles', function () {
    return gulp.src( devPath + 'styles/**/*.less')
        .pipe(less())
        .pipe(autoprefixer('last 1 version'))
        .pipe(csso())
        .pipe(size())
        .pipe(gulp.dest( prodPath + 'styles'))
        .pipe(connect.reload());
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src( devPath + 'scripts/**/*')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(removeLogs())
        .pipe(gulp.dest( prodPath + 'scripts'))
        .pipe(connect.reload());
});

// HTML
gulp.task('html', function () {
    return gulp.src( devPath + '*.html')
        .pipe(size())
        .pipe(gulp.dest(prodPath))
        .pipe(connect.reload());
});

// Images
gulp.task('images', function () {
    return gulp.src( devPath + 'img/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(size())
        .pipe(gulp.dest( prodPath + 'img'))
        .pipe(connect.reload());
});

// bower
gulp.task('bower', function() {
    return bower( devPath + 'bower_components')
        .pipe(gulp.dest( prodPath + 'bower_components'));
});

// Clean
gulp.task('clean', function () {
    return gulp.src(['dist'], {read: false}).pipe(clean());
});

// Watch
gulp.task('watch', function () {
    // Watch .html files
    gulp.watch( devPath + '*.html');

    // Watch .scss files
    gulp.watch( devPath + 'styles/**/*.less', ['styles']);

    // Watch .js files
    gulp.watch( devPath + 'scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch( devPath + 'img/**/*', ['images']);
});

// Server
gulp.task('connect', connect.server({
    root: [
        prodPath,
    ],
    port: 9000,
    livereload: true,
    open: {
        // browser: 'chrome', // if not working OS X browser: 'Google Chrome'
        file: ''
    },
    // middleware: function(connect, o) {
    //     return [
    //         // ...
    //     ]
    // }
}));

// Build
gulp.task('build', [
    'html',
    'styles',
    'scripts',
    'bower',
    'images',
], function(){
    console.log('build finished');
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
