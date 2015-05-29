var gulp = require('gulp');
var ngHtml2Js = require("gulp-ng-html2js");
var concat = require("gulp-concat");
var clean = require("gulp-clean");

//read env variable, you can use command "FILE_NAME=test.js gulp"
var fileName = process.env.FILE_NAME || "all.js";

gulp.task('clean', function(){
   return gulp.src(['./tmp', './dist'])
    .pipe(clean());
})

gulp.task('html2js', function() {
   return gulp.src("./src/template/*.html")
    .pipe(ngHtml2Js({
        moduleName: "cuf.template",
        prefix: "template/"
    }))
    .pipe(gulp.dest("./tmp/template"));
});

gulp.task('concat', ['html2js'], function() {
   return gulp.src(["./tmp/template/*.js", "./src/js/*.js"])
    .pipe(concat(fileName))
    .pipe(gulp.dest("./dist/js"))
});

gulp.task('default',['html2js', 'concat']);
