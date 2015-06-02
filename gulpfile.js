var gulp = require('gulp');
var ngHtml2Js = require("gulp-ng-html2js");
var concat = require("gulp-concat");
var clean = require("gulp-clean");
var ngAnnotate = require('gulp-ng-annotate');
var minifyCss = require('gulp-minify-css');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var eventStream = require('event-stream');

//read env variable, you can use command "FILE_NAME=test.js gulp"
var _fileName = process.env.FILE_NAME || "all.js";
var _uglify = false;
var _cssmini = false;
var _moduleName = "cuf.template";

gulp.task('buildcss', ['clean'], function(){
   return gulp.src('./src/css/*.css')
    .pipe(gulpif(_cssmini, minifyCss()))
    .pipe(gulp.dest("./dist/css"));
});

gulp.task('clean', function(){
   return gulp.src('./dist')
    .pipe(clean({force: true}));
});

gulp.task('buildjs', ['clean'], function() {
   
   var jsStream = gulp.src("./src/js/*.js"),
       htmlStream = gulp.src("./src/template/*.html");

   htmlStream.pipe(ngHtml2Js({
        moduleName: _moduleName,
        prefix: "template/"
   }));

   return eventStream.merge(jsStream, htmlStream)
    .pipe(concat(_fileName))
    .pipe(ngAnnotate())
    .pipe(gulpif(_uglify, uglify()))
    .pipe(gulp.dest("./dist/js"))
});

gulp.task('default', ['clean', 'buildjs', 'buildcss']);

