let syntax = 'sass' // Syntax: sass or scss;

let gulp = require('gulp')

let sass = require('gulp-sass')

let browserSync = require('browser-sync')

let concat = require('gulp-concat')

let cleancss = require('gulp-clean-css')

let rename = require('gulp-rename')

let autoprefixer = require('gulp-autoprefixer')

let notify = require('gulp-notify')

let jquery = 'node_modules/jquery/dist/jquery.min.js'
let slider = 'node_modules/slick-carousel/slick/slick.min.js'

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  })
})

gulp.task('styles', function () {
  return gulp.src('app/' + syntax + '/**/*.' + syntax + '')
    .pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError()))
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream())
})

gulp.task('js', function () {
  return gulp.src([
    jquery,
    slider,
    'app/js/common.js' // Always at the end
  ])
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('watch', ['styles', 'js', 'browser-sync'], function () {
  gulp.watch('app/' + syntax + '/**/*.' + syntax + '', ['styles'])
  gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js'])
  gulp.watch('app/*.html', browserSync.reload)
})

gulp.task('default', ['watch'])
