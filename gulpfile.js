var gulp = require('gulp');

//scss
var sass = require('gulp-sass');
var pleeease = require('gulp-pleeease');
var plumber = require('gulp-plumber');

//画像圧縮
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

//JS圧縮
var uglify = require('gulp-uglify');

//browserSync
var browserSync = require('browser-sync');

// Styleguide
var aigis = require('gulp-aigis');

// Utility
var runSequence = require('run-sequence');
var del = require('del');

////////////
// config
///////////
var themeName = 'theme-name';

//開発用ディレクトリ
var develop = {
    'root': 'wp-content/themes/'+themeName+'/assets/'
}

//コンパイル先
var release = {
    'root': 'wp-content/themes/'+themeName+'/',
    'sass': 'wp-content/themes/'+themeName+'/'
}

var AUTOPREFIXER_BROWSERS = [
    // @see https://github.com/ai/browserslist#browsers
    // Major Browsers（主要なブラウザの指定）
    'last 2 version', // （Major Browsersの）最新2バージョン
    // 'Chrome >= 34', // Google Chrome34以上
    // 'Firefox >= 30', // Firefox30以上
    'ie >= 9', // IE9以上
    // 'Edge >= 12', // Edge12以上
    'iOS >= 7', // iOS7以上
    // 'Opera >= 23', // Opera23以上
    // 'Safari >= 7', // Safari7以上

    // Other（Androidなどのマイナーなデバイスの指定）
    'Android >= 4.0' // Android4.0以上
];

//////////////////
// gulp setting
//////////////////

// sass
gulp.task('sass', function () {
    console.log('--------- sass task ----------');
    return gulp.src(develop.root + 'scss/**/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err.messageFormatted);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(pleeease({
            autoprefixer: {"browsers": AUTOPREFIXER_BROWSERS},
            minifier: false
        }))
        .pipe(gulp.dest(release.sass));
});

//画像を圧縮
gulp.task('image-min', function () {
    console.log('--------- image-min task ----------');
    return gulp.src(develop.root + 'images/**/*.+(jpg|jpeg|png|gif|svg)')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            use: [pngquant({quality: '65-80', speed: 1})]
        }))
        .pipe(gulp.dest(release.root));
});

// jsを圧縮
gulp.task('uglify', function () {
    console.log('--------- uglify task ----------');
    return gulp.src(develop.root + '**/*.js')
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(release.root));
});

//開発環境のコンパイル
gulp.task('copy', function () {
    console.log('--------- output task ----------');
    gulp.src(
        [develop.root +'**','!' + develop.root + '**/scss/**','!' + develop.root + '**/scss/',develop.root +'**/*.css',develop.root + '**/js/*.js', develop.root + '**/fonts/*.{eot,oft,ttf,woff,woff2}', develop.root +'**/images/*.{png,jpg,gif,svg}'],
        {base: develop.root}
    )
        .pipe(gulp.dest(release.root));
});

// browserSync
gulp.task('browser-sync', function () {
    browserSync({
        //proxy:'192.168.33.10'//ここにwordpressサーバへのIPアドレスを書く
        //proxy:'http://local/'
    });
});

gulp.task('bs-reload', function () {
    console.log('--------- bs-reload task ----------');
    browserSync.reload();
});


////////////////////////////////////////////////
// スタイルガイドを生成
////////////////////////////////////////////////
gulp.task('aigis', function() {
    return gulp.src('./aigis/aigis_config.yml')
        .pipe(aigis());
});

////////////////////////////////////////////////
// スタイルガイドディレクトリを削除
////////////////////////////////////////////////
gulp.task('clean-styleguide', function (cb) {
    console.log('--------- clean-styleguide task ----------');
    return del('./styleguide/' + '**/*');
});


////////////////////////////////////////////////
//スタイルガイドを生成
////////////////////////////////////////////////

gulp.task('styleguide',['clean-styleguide'], function(callback) {
    return runSequence(
        'sass',
        'aigis',
        callback
    );
});
gulp.task('re-styleguide', function(callback) {
    return runSequence(
        'styleguide',
        'bs-reload',
        callback
    );
});

///////////////////////////////////////////////
//その他
////////////////////////////////////////////////
gulp.task('re-sass', function(callback) {
    return runSequence(
        'sass',
        'bs-reload',
        callback
    );
});
gulp.task('output', function(callback) {
    return runSequence(
        'copy',
        ['sass','image-min','uglify'],
        'bs-reload',
        callback
    );
});

// gulpのデフォルト
gulp.task('default',['output'], function () {
    gulp.watch(develop.root + 'scss/**/*.scss', ['re-sass']);
    gulp.watch(develop.root + 'images/**/*', ['image-min']);
    gulp.watch(develop.root + 'js/**/*', ['uglify']);
    gulp.watch('./**/*.html', ['bs-reload']);
    gulp.watch( './**/*.php', ['bs-reload'] );
});

// ブラウザシンクの起動
gulp.task('sync', ['browser-sync'], function () {
    gulp.watch(develop.root + 'scss/**/*.scss', ['re-sass']);
    gulp.watch('./**/*.html', ['bs-reload']);
    gulp.watch( './**/*.php', ['bs-reload'] );
});




