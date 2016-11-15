/* jshint node:true */
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require("gulp-jshint"),
    del = require('del');

gulp.task('clear', function(){
    del(['dist/hprose.js']);
});

gulp.task('concat', ['clear'], function() {
    return gulp.src(['src/CopyRight.js',
                     'src/Init.js',
                     'src/Helper.js',
                     'src/TimeoutError.js',
                     'src/setImmediate.js',
                     'src/Map.js',
                     'src/Future.js',
                     'src/StringIO.js',
                     'src/Tags.js',
                     'src/ClassManager.js',
                     'src/Writer.js',
                     'src/Reader.js',
                     'src/Formatter.js',
                     'src/ResultMode.js',
                     'src/Client.js',
                     'src/HttpClient.js',
                     'src/JSONRPCClientFilter.js',
                     'src/Loader.js'])
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(concat('hprose.src.js'))
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify', ['concat'], function() {
    gulp.src(['utils/co.js'])
        .pipe(concat('co.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
    gulp.src(['utils/regenerator-runtime.js'])
        .pipe(concat('regenerator-runtime.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
    return gulp.src(['dist/hprose.src.js'])
        .pipe(concat('hprose.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['uglify'], function() {
    return gulp.src(['src/CopyRight.js', 'dist/hprose.js'])
        .pipe(concat('hprose.js'))
        .pipe(gulp.dest('dist'))
});
