var gulp = require('gulp');
//Use gulp-load-plugins to auto require plugins
//The plugin name: transforms hyphenated plugins names to camel case
var plugins = require('gulp-load-plugins')();
/*
 var ngHtml2Js = require("gulp-ng-html2js");
 var concat = require("gulp-concat");
 var clean = require("gulp-clean");
 var ngAnnotate = require('gulp-ng-annotate');
 var minifyCss = require('gulp-minify-css');
 var gulpif = require('gulp-if');
 var uglify = require('gulp-uglify');
 */
var _ = plugins.loadUtils(['log', 'colors', 'env']);
var eventStream = require('event-stream');

//read env variable
var _fileName = _.env['concat-file-name'] || "all.js";
var _uglify = _.env.uglify || false;
var _cssmini = _.env.cssmini || false;
var _moduleName = _.env['template-module-name'] || "cuf.template";
/*
 --file-name ${{fileName}}
 --uglify
 --cssmini
 --module-name ${{moduleName}}
 */

gulp.task('buildcss', ['clean'], function(){
    return gulp.src('./src/css/*.css')
        .pipe(plugins.if(_cssmini, plugins.minifyCss()))
        .pipe(gulp.dest("./dist/css"));
});

gulp.task('clean', function(){
    return gulp.src('./dist')
        .pipe(plugins.clean({force: true}));
});

gulp.task('buildjs', ['clean'], function() {

    var jsStream = gulp.src("./src/js/*.js"),
        htmlStream = gulp.src("./src/template/*.html");

    htmlStream.pipe(plugins.ngHtml2js({
        moduleName: _moduleName,
        prefix: "template/"
    }));

    return eventStream.merge(jsStream, htmlStream)
        .pipe(plugins.concat(_fileName))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.if(_uglify, plugins.uglify()))
        .pipe(gulp.dest("./dist/js"))
});

gulp.task('default', ['clean', 'buildjs', 'buildcss']);