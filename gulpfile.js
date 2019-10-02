//import modules
const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const eslint = require('gulp-eslint');

//set default sass compiler
sass.compiler = require('node-sass');

//compile sass to css
function sassCompile() {
  return src('assets/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write('scss-maps/'))
    .pipe(dest('assets/'));
}

//eslint
function lintJS() {
  return src('assets/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
}

//watch
function watchFiles() {
  watch('assets/scss/**/*.scss', {delay: 1000}, sassCompile);
}

exports.default = series(sassCompile, lintJS);
exports.watch = watchFiles;
