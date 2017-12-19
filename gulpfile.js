const gulp = require("gulp")
const babel = require("gulp-babel")

let destination = "es5"

gulp.task("es6toes5", () => {

	return gulp.src("src/**/*.js")
	.pipe(babel({presets: "es2015"}))
	.pipe(gulp.dest(destination))
})


gulp.task('dev', ["es6toes5"])