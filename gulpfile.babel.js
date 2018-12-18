import babel from 'gulp-babel';
import gulp from 'gulp';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import sass from 'gulp-sass';
import rename from 'gulp-rename';

const srcJSFiles = ['./src/js/utils.js', './src/js/pureSwiper.js'];

gulp.task('transferJS', () => {
  gulp
    .src(srcJSFiles)
    .pipe(concat('pureSwiper.min.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('transferCSS', () => {
  gulp
    .src('./src/css/pureSwiper.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({ compatibility: '*' }))
    .pipe(rename('pureSwiper.min.css'))
    .pipe(gulp.dest('./dist'));
});

// 监控
gulp.task('watch', () => {
  gulp.watch(srcJSFiles, ['transferJS']);
  gulp.watch('./src/css/pureSwiper.scss', ['transferCSS']);
});

// 打包发布
gulp.task('build', ['transferJS', 'transferCSS']);
