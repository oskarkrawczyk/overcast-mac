var gulp         = require('gulp')
var sass         = require("gulp-sass")
var autoprefixer = require("gulp-autoprefixer")
var electron     = require('electron-connect').server.create()


var handleError = function(err){
  console.log(err.toString())
  this.emit("end")
}

gulp.task("css", function(){
  console.log("task:css")
  gulp.src("browser.scss")
  .pipe(sass())
  .on("error", handleError)
  .pipe(autoprefixer())
  .on("error", handleError)
  .pipe(gulp.dest("dist/"))

  electron.restart()
})

gulp.task('start', function(){

  // Start browser process
  electron.start()

  // Restart browser process
  gulp.watch('main.js', electron.restart)

  // Reload renderer process
  gulp.watch('browser.scss', ["css"])
  gulp.watch('browser.js', electron.reload)
})
