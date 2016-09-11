var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sassToCss', function () {
   return gulp.src("styles/sass/*.scss", { base: "./styles/sass/" })
    .pipe(sass())
    .pipe(gulp.dest('styles/css/')); 
});

gulp.task('default', ['sassToCss']);
gulp.watch('styles/sass/*.scss', ['sassToCss']);