'use strict';

var build_way =   './build/',

    gulp =        require('gulp'), // npm install gulp
    rigger =      require('gulp-rigger'), // npm install gulp-rigger
    watch =       require('gulp-watch'), // npm install --save-dev gulp-watch
    prefixer =    require('gulp-autoprefixer'), // npm install --save-dev gulp-autoprefixer
    uglify =      require('gulp-uglify'), // npm install --save-dev gulp-uglify
    sass =        require('gulp-sass'), // npm install gulp-less
    cssmin =      require('gulp-csso'), // npm install --save-dev gulp-clean-css
    spritesmith = require('gulp.spritesmith'),
    rimraf =      require('rimraf'), // npm install rimraf
    browserSync = require("browser-sync"), // npm install browser-sync
    reload =      browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы. xxx - название сайта
        html:   build_way,
        js:     build_way + 'js/',
        css:    build_way + 'css/',
        fonts:  build_way + 'fonts/',
        img:    build_way + 'img/'
    },
    update: { // исходные папкки
        html:  'src/',
        js:    'src/js/',
        css:   'src/sass/',
        fonts: 'src/fonts/',
        img:   'src/img/'
    },
    src: { //Пути откуда брать исходники
        html:  'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js:    'src/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/sass/*.sass',
        fonts: 'src/fonts/**/*.*',
        img:   'src/img/*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        sprt:  'src/img/sprites/*.png' //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html:  'src/**/*.html',
        js:    'src/js/**/*.js',
        style: 'src/css/**/*.less',
        fonts: 'src/fonts/*.*',
        img:   'src/img/*',
        sprt:  'src/img/sprites/*.png',
    },
    clean: './' + build_way
};

var config = { // Автообновление страницы в браузере
    server: {
        baseDir: './' + build_way
    },
    tunnel: false,
    host: 'localhost',
    port: 8080,
    logPrefix: "koterion"
};

var plugins = {
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
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.fonts)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.js))
        .pipe(uglify()) //Сожмем наш js
        .pipe(gulp.dest(path.build.js)) //выплёвуем
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.css
        .pipe(sass())
        .pipe(prefixer(plugins.autoprefixer.option)) //Добавим вендорные префиксы
        .pipe(gulp.dest(path.build.css))
        .pipe(cssmin()) //Сожмем
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
});

gulp.task('sprite:build', function() {
    var spriteData =
        gulp.src(path.src.sprt) // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: '../img/sprite/sprite.png',
                cssName: 'sprite.sass',
                algorithm: 'binary-tree',
                padding: 2,
                cssFormat: 'sass',
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name;
                }
            }));

    spriteData.img
        .pipe(gulp.dest(path.build.img)); // путь, куда сохраняем картинку
    spriteData.css
        .pipe(gulp.dest(path.update.css + 'components')); // путь, куда сохраняем стили
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'image:build',
    'fonts:build',
    'sprite:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
    watch([path.watch.sprt], function(event, cb) {
        gulp.start('sprite:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);

