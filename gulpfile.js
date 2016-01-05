process.chdir('..');

var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var git = require('gulp-git');

var gunzip = require('gulp-gunzip');
var gzip = require('gulp-gzip');

var prompt = require('gulp-prompt');
var rename = require("gulp-rename")
var watch = require("gulp-watch");

var paths = {

}

gulp.task('init', function(){
  git.init();
});
gulp.task('addRemote', function(){
  return gulp.src('*').pipe(
    prompt.prompt(
      [
        {
          type: 'input',
          name: 'remote',
          message: 'Please enter remote repo ...'
        }
      ],
      function(data){
        return git.addRemote('origin', data.remote, function (err) {
          if (err) throw err;
        });
      })
    );
});

gulp.task('watch', function(){
  return gulp.watch('*.als', ['autoCommit']);
});
gulp.task('autoCommit', ['uncompress'], function()
{
  return gulp.src('.uncompressed')
  .pipe(git.add())
  .pipe(git.commit("autoCommit"));
});

gulp.task('pull', function(){
  git.pull('origin', 'master', function (err) {
    if (err) throw err;
  });
})
gulp.task('push', function(){
  git.push('origin', 'master', function (err) {
    if (err) throw err;
  });
});

gulp.task('tag', function(){
  return gulp.src('*').pipe(
    prompt.prompt(
      [
        {
          type: 'input',
          name: 'version',
          message: 'Please enter version ...'
        },
        {
          type: 'input',
          name: 'message',
          message: 'Please enter version message ...'
        },
      ],
      function(data){
        return git.tag(data.version, data.message, function (err) {
            if (err) throw err;
          });
      })
    );

});

gulp.task('checkout', function(){
  return gulp.src('*').pipe(
    prompt.prompt(
      [
        {
          type: 'input',
          name: 'branch',
          message: 'Please enter branch name ...'
        }
      ],
      function(data){
        return git.checkout(data.branch, function (err) {
          if (err) throw err;
        });
      })
    );
});

gulp.task('compress', function() {
    return gulp.src('.uncompressed/*.als.xml')
    .pipe(gzip({'append': false}))
    .pipe(rename(function (path){
      // path.dirname = "./.uncompressed";
      path.extname = ""
    }))
    .pipe(gulp.dest('./'));
});
gulp.task('uncompress', function(){
  return gulp.src('*.als')
  .pipe(gunzip())
	.pipe(rename(function (path){
    // path.dirname = "./.uncompressed";
    path.extname = ".als.xml"
  }))
  .pipe(gulp.dest('.uncompressed'));
});
