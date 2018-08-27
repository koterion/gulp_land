'use strict'

const buildWay = './build/'

const gulp = require('gulp') // npm install gulp
const rigger = require('gulp-rigger') // npm install gulp-rigger
const watch = require('gulp-watch') // npm install --save-dev gulp-watch
const prefixer = require('gulp-autoprefixer') // npm install --save-dev gulp-autoprefixer
const uglify = require('gulp-uglify-es').default // npm install --save-dev gulp-uglify
const sass = require('gulp-sass') // npm install gulp-less
const cssmin = require('gulp-csso') // npm install --save-dev gulp-clean-css
const spritesmith = require('gulp.spritesmith')
const rimraf = require('rimraf') // npm install rimraf
const browserSync = require('browser-sync') // npm install browser-sync
const reload = browserSync.reload

let path = {
  build: { // Тут мы укажем куда складывать готовые после сборки файлы. xxx - название сайта
    html: buildWay,
    js: buildWay + 'js/',
    css: buildWay + 'css/',
    fonts: buildWay + 'fonts/',
    img: buildWay + 'img/'
  },
  update: { // исходные папкки
    html: 'src/',
    js: 'src/js/',
    css: 'src/sass/',
    fonts: 'src/fonts/',
    img: 'src/img/'
  },
  src: { // Пути откуда брать исходники
    html: 'src/*.html', // Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
    js: 'src/js/*.js', // В стилях и скриптах нам понадобятся только main файлы
    style: 'src/sass/*.sass',
    fonts: 'src/fonts/**/*.*',
    img: 'src/img/*', // Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    sprt: 'src/img/sprites/*.png' // Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
  },
  watch: { // Тут мы укажем, за изменением каких файлов мы хотим наблюдать
    html: 'src/**/*.html',
    js: 'src/js/**/*.js',
    style: 'src/css/**/*.less',
    fonts: 'src/fonts/*.*',
    img: 'src/img/*',
    sprt: 'src/img/sprites/*.png'
  },
  clean: './' + buildWay
}

const config = { // Автообновление страницы в браузере
  server: {
    baseDir: './' + buildWay
  },
  tunnel: false,
  host: 'localhost',
  port: 8080,
  logPrefix: 'koterion'
}

const plugins = {
  autoprefixer: {
    options: {
      browsers: [
        'last 2 version',
        'Chrome >= 20',
        'Firefox >= 20',
        'Opera >= 12',
        'Android 2.3',
        'Android >= 4',
        'iOS >= 6',
        'Safari >= 6',
        'Explorer >= 8'
      ],
      cascade: false
    }
  }
}

gulp.task('html:build', () => {
  gulp.src(path.src.html) // Выберем файлы по нужному пути
    .pipe(rigger()) // Прогоним через rigger
    .pipe(gulp.dest(path.build.html)) // Выплюнем их в папку build
    .pipe(reload({stream: true}))
})

gulp.task('fonts:build', () => {
  gulp.src(path.src.fonts) // Выберем файлы по нужному пути
    .pipe(gulp.dest(path.build.fonts)) // Выплюнем их в папку build
    .pipe(reload({stream: true})) // И перезагрузим наш сервер для обновлений
})

gulp.task('js:build', () => {
  gulp.src(path.src.js) // Найдем наш main файл
    .pipe(rigger()) // Прогоним через rigger
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify()) // Сожмем наш js
    .pipe(gulp.dest(path.build.js)) // выплёвуем
    .pipe(reload({stream: true})) // И перезагрузим наш сервер для обновлений
})

gulp.task('style:build', () => {
  gulp.src(path.src.style) // Выберем наш main.css
    .pipe(sass())
    .pipe(prefixer(plugins.autoprefixer.option)) // Добавим вендорные префиксы
    .pipe(gulp.dest(path.build.css))
    .pipe(cssmin()) // Сожмем
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true})) // И перезагрузим наш сервер для обновлений
})

gulp.task('image:build', () => {
  gulp.src(path.src.img) // Выберем наши картинки
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true})) // И перезагрузим наш сервер для обновлений
})

gulp.task('sprite:build', () => {
  const spriteData =
    gulp.src(path.src.sprt) // путь, откуда берем картинки для спрайта
      .pipe(spritesmith({
        imgName: '../img/sprite/sprite.png',
        cssName: 'sprite.sass',
        algorithm: 'binary-tree',
        padding: 2,
        cssFormat: 'sass',
        cssVarMap: sprite => {
          sprite.name = 's-' + sprite.name
        }
      }))

  spriteData.img
    .pipe(gulp.dest(path.build.img)) // путь, куда сохраняем картинку
  spriteData.css
    .pipe(gulp.dest(path.update.css + 'components')) // путь, куда сохраняем стили
})

gulp.task('build', [
  'html:build',
  'js:build',
  'style:build',
  'image:build',
  'fonts:build',
  'sprite:build'
])

gulp.task('watch', () => {
  watch([path.watch.html], () => {
    gulp.start('html:build')
  })
  watch([path.watch.style], () => {
    gulp.start('style:build')
  })
  watch([path.watch.js], () => {
    gulp.start('js:build')
  })
  watch([path.watch.img], () => {
    gulp.start('image:build')
  })
  watch([path.watch.fonts], () => {
    gulp.start('fonts:build')
  })
  watch([path.watch.sprt], () => {
    gulp.start('sprite:build')
  })
})

gulp.task('webserver', () => {
  browserSync(config)
})

gulp.task('clean', cb => {
  rimraf(path.clean, cb)
})

gulp.task('default', ['build', 'webserver', 'watch'])
