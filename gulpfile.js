var gulp = require('gulp');

//scss
var sass = require('gulp-sass');
var pleeease = require('gulp-pleeease');
var plumber = require('gulp-plumber');

//pug
var pug = require('gulp-pug');
var fs = require('fs');
var data = require('gulp-data');
var path = require('path');


//画像圧縮
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

//JS圧縮
var uglify = require('gulp-uglify');

//browserSync
var browserSync = require('browser-sync');

// Styleguide
var aigis = require('gulp-aigis');

//htmlCheck
var htmlhint = require("gulp-htmlhint");

// Utility
var notify = require("gulp-notify");
var watch = require("gulp-watch");
var runSequence = require('run-sequence');
var del = require('del');
var rename = require("gulp-rename");


////////////
// config
///////////

//開発用ディレクトリ
var develop = {
    'root': './static/src/',
    'assets': './static/src/assets/'
};

//コンパイル先
var release = {
    'root': './static/dist/',
    'css': './static/dist/css/',
    'images': './static/dist/images/',
    'assets': './static/dist/'
};
//theme
var themeName = 'theme-name';//ここにテーマの名前が入ります。
var theme = {
    'root': './wp-content/themes/' + themeName + '/',
    'css': './wp-content/themes/' + themeName + '/css/',
    'js': './wp-content/themes/' + themeName + '/js/',
    'images': './wp-content/themes/' + themeName + '/images/',
    'assets': './wp-content/themes/assets/'
};

// Defining base pathes
var paths = {
    node: './node_modules/',
    guide: './aigis/'
};

// browser-sync watched files
// automatically reloads the page when files changed
var browserSyncWatchFiles = [
    develop.root + './**/*.pug',
    develop.assets + '**/scss/*.scss',
    release.root + '**/css/*.css',
    release.root + '**/js/*.js',
    release.root + '**/*.php',
    release.root + '**/*.html'
];


// browser-sync options
// see: https://www.browsersync.io/docs/options/
var browserSyncOptions = {
    //proxy: "localhost/wordpress/",
    notify: false,
    server: {
        baseDir: release.root,
        index: 'index.html'
    },
    open: false//オプション
};

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
    return gulp.src([
        develop.assets + 'scss/**/*.scss',
        '!' + develop.assets + 'scss/vendor/**/*.scss'
    ])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err.messageFormatted);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(pleeease({
            autoprefixer: {"browsers": AUTOPREFIXER_BROWSERS},
            minifier: true,
        }))
        .pipe(gulp.dest(release.css))
        .pipe(gulp.dest(theme.css));
});


gulp.task('pug', function () {
    // JSONファイルの読み込み。
    var locals = {
        'site': JSON.parse(fs.readFileSync(develop.root + '_data/' + 'site.json')),
        'data': JSON.parse(fs.readFileSync(develop.root + '_data/' + 'data.json'))
    }
    return gulp.src([develop.root + '**/*.pug', '!' + develop.root + '**/_*.pug'])
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(data(function (file) {
            // 各ページごとの`/`を除いたルート相対パスを取得します。
            locals.relativePath = path.relative(file.base, file.path.replace(/.pug$/, '.html'));
            return locals;
        }))
        .pipe(pug({
            // JSONファイルをPugに渡します。
            locals: locals,
            // Pugファイルのルートディレクトリを指定します。
            // `/assets/pug/_layout`のようにルート相対パスを使います。
            basedir: 'static/src',
            // Pugファイルの整形。
            pretty: '    '
        }))
        .pipe(gulp.dest(release.root))
});


//画像を圧縮
gulp.task('image-min', function () {
    console.log('--------- image-min task ----------');
    return gulp.src(develop.assets + 'images/**/*.+(jpg|jpeg|png|gif|svg)')
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            use: [pngquant({quality: '65-80', speed: 1})]
        }))
        .pipe(gulp.dest(release.images))
        .pipe(gulp.dest(theme.images));
});

// jsを圧縮
gulp.task('uglify', function () {
    console.log('--------- uglify task ----------');
    return gulp.src(develop.assets + '**/*.js')
    .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(release.root))
        .pipe(gulp.dest(theme.root));
});

//開発環境のコンパイル
gulp.task('copy', function () {
    console.log('--------- output task ----------');
    gulp.src(
        [develop.root + '',
            '!' + develop.root + '**/*.pug',
            '!' + develop.root + '**/_include/*',
            '!' + develop.root + '**/_include',
            '!' + develop.root + '**/_data/*',
            '!' + develop.root + '**/_data',
            '!' + develop.assets,
            '!' + develop.assets + '**/*',
            //develop.assets + '**/*.html',
            //develop.assets + '**/*.css',
            //develop.assets + '**/js/*.js',
            develop.assets + '**/fonts/*.{eot,oft,ttf,woff,woff2}'
            //develop.assets + '**/images/*.{png,jpg,gif,svg}',
        ],

        {base: develop.root}
    )
        .pipe(gulp.dest(release.root))
        .pipe(gulp.dest(theme.root));

});


// browserSync
gulp.task('browser-sync', function () {
    browserSync.init(browserSyncWatchFiles, browserSyncOptions);
});

gulp.task('bs-reload', function () {
    console.log('--------- bs-reload task ----------');
    browserSync.reload();
});


////////////////////////////////////////////////
// スタイルガイドを生成
////////////////////////////////////////////////
gulp.task('aigis', function () {
    return gulp.src(paths.guide + 'aigis_config.yml')
        .pipe(aigis());
});

////////////////////////////////////////////////
// スタイルガイドディレクトリを削除
////////////////////////////////////////////////
gulp.task('clean-styleguide', function () {
    console.log('--------- clean-styleguide task ----------');
    return del(paths.guide + '**/*', '!.gitkeep');
});


////////////////////////////////////////////////
//スタイルガイドを生成
////////////////////////////////////////////////

gulp.task('styleguide', ['clean-styleguide'], function (callback) {
    return runSequence(
        'sass',
        'aigis',
        callback
    );
});
gulp.task('re-styleguide', function (callback) {
    return runSequence(
        'styleguide',
        'bs-reload',
        callback
    );
});


////////////////////////////////////////////////
//venderのコピー
////////////////////////////////////////////////
gulp.task('copy-vendor', function () {
    console.log('--------- copy-vender task ----------');
    // Copy uikit
    var stream = gulp.src(paths.node + 'uikit/src/scss/**/*.scss')
        .pipe(gulp.dest(develop.assets + '/scss/vendor/uikit'))

    gulp.src(paths.node + 'uikit/dist/js/uikit.js')
        .pipe(gulp.dest(develop.assets + '/js/vendor/uikit'));

    // Copy Skeleton
    gulp.src(paths.node + 'skeleton-scss/scss/**/*.scss')
        .pipe(gulp.dest(develop.assets + '/scss/vendor/skeleton-scss'));

    // Copy Bourbon
    gulp.src(paths.node + 'bourbon/core/**/*.scss')
        .pipe(gulp.dest(develop.assets + '/scss/vendor/bourbon'));

    // Copy Neat
    gulp.src(paths.node + 'bourbon-neat/core/**/*.scss')
        .pipe(gulp.dest(develop.assets + '/scss/vendor/bourbon-neat'));

    // Copy dlex
    gulp.src(paths.node + 'dlex/docs/scss/**/*dlex.scss')
        .pipe(gulp.dest(develop.assets + '/scss/vendor/dlex'));
    gulp.src(paths.node + 'dlex/docs/scss/**/*mixin.scss')
        .pipe(gulp.dest(develop.assets + '/scss/vendor/dlex'));

    return stream;
});

///////////////////////////////////////////////
//HTMLの文法チェック
////////////////////////////////////////////////
gulp.task('check-html', function () {
    console.log('--------- check-html task ----------');
    //opstion ルール
    //https://github.com/yaniswang/HTMLHint/wiki/Rules
    gulp.src(release.root + '/**/*.html')
        .pipe(htmlhint(
            {
                "alt-require": true,
                "attr-lowercase": true,
                "attr-value-double-quotes": true,
                "doctype-first": false,
                "tag-pair": true,
                "tag-self-close": false,
                "spec-char-escape": true,
                "id-unique": true,
                "src-not-empty": true,
                "attr-no-duplication": true,
                "title-require": true,
                "doctype-html5": true,
            }
        ))
        .pipe(htmlhint.reporter());
});

///////////////////////////////////////////////
//その他
////////////////////////////////////////////////
gulp.task('re-sass', function (callback) {
    return runSequence(
        'sass',
        'bs-reload',
        callback
    );
});
gulp.task('re-pug', function (callback) {
    return runSequence(
        'pug',
        'check-html',
        'bs-reload',
        callback
    );
});


// リリースフォルダ内のファイル削除
gulp.task('release-clean', function () {
    console.log('--------- clean task ----------');
    return del(release.root + '**/*', '!.gitkeep');
});
gulp.task('output', function (callback) {
    return runSequence(
        'release-clean',
        'copy',
        ['pug', 'sass', 'image-min', 'uglify'],
        'check-html',
        'bs-reload',
        callback
    );
});

//herokuへのコンパイル
gulp.task('heroku', function (callback) {
    return runSequence(
        'copy',
        ['pug', 'sass', 'image-min', 'uglify'],
        callback
    );
});


// gulpのデフォルト
gulp.task('default', ['output'], function () {
    gulp.watch(develop.root + '**/*.pug', ['re-pug']);
    gulp.watch(develop.assets + 'scss/**/*.scss', ['re-sass']);
    gulp.watch(develop.assets + 'images/**/*', ['image-min']);
    gulp.watch(develop.assets + 'js/**/*', ['uglify']);
    gulp.watch('./**/*.html', ['bs-reload']);
    gulp.watch('./**/*.php', ['bs-reload']);
});

// gulpのデフォルト
gulp.task('sync', ['browser-sync'], function () {
    gulp.watch(develop.root + '**/*.pug', ['re-pug']);
    gulp.watch(develop.assets + 'scss/**/*.scss', ['re-sass']);
    gulp.watch(develop.assets + 'images/**/*', ['image-min']);
    gulp.watch(develop.assets + 'js/**/*', ['uglify']);
    gulp.watch('./**/*.html', ['bs-reload']);
    gulp.watch('./**/*.php', ['bs-reload']);
});
