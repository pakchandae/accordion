import path from 'path';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';


/**
 * config
 */
const config = {
    gulpLoadPlugins: {
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    },
    browserSync: {
        notify: true,
        server: 'public',
        port: 3000,
        reloadDelay: 300,
        startPath: './',
    },
    webpack: {
        mode: 'production',
        entry: path.resolve(__dirname, 'src/js/import.js'),
        output: {
            path: path.resolve(__dirname, 'public/assets/js'),
            filename: 'app.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                }
            ]
        }
    },
    sass: {
        outputStyle: 'compressed'
    },
    autoPrefixer: [
        'ie >= 9',
        'last 3 version',
        'ios >= 7',
        'android >= 4.2'
    ],
    dir: {
        dev: {
            base: 'src/',
            pug: 'src/pug/root/',
            sass: 'src/scss/root/',
            js: 'src/js/'
        },
        prod: {
            base: 'public/',
            sass: 'public/assets/css/',
            js: 'public/assets/js/'
        }
    }
}

const $ = gulpLoadPlugins(config.gulpLoadPlugins);



/**
 * task: webpack
 */
gulp.task('webpack', ()=>{
    return webpackStream(config.webpack, webpack).on('error', function(){
        this.emit('end');
    })
    .pipe(gulp.dest(config.dir.prod.js));
});



/**
 * task: pug
 */
gulp.task('pug', () => {
    return gulp
        .src([
            `${config.dir.dev.pug}**/*.pug`,
            `!${config.dir.dev.pug}**/_*.pug`,
        ])
        .pipe($.plumber({
            errorHandler: $.notify.onError('<%= error.message %>')
        }))
        .pipe($.pug({
            pretty: true,
            options: {
                root: config.dir.dev.pug,
                ext: '.pug',
                open: '[%', close: '%]'
            },
        }))
        .pipe(gulp.dest(config.dir.prod.base));
});



/**
 * task: sass
 */
gulp.task('sass', () => {
    return gulp
        .src([
            `${config.dir.dev.sass}**/*.{scss, sass}`,
            `!${config.dir.dev.sass}**/_*.{scss, sass}`,
        ])
        .pipe($.plumber({
            errorHandler: $.notify.onError('<%= error.message %>')
        }))
        .pipe($.sassGlob())
        .pipe($.sass(config.sass))
        .pipe($.autoprefixer(config.autoPrefixer))
        .pipe(gulp.dest(config.dir.prod.sass));
});



/**
 * task: default
 */
gulp.task('default', ['pug', 'sass', 'webpack'], () => {
    browserSync(config.browserSync);

    gulp.watch(
        [`${config.dir.dev.base}**/*.pug`],
        ['pug', browserSync.reload]
    );

    gulp.watch(
        [`${config.dir.dev.base}**/*.{scss, sass}`],
        ['sass', browserSync.reload]
    );

    gulp.watch(
        [`${config.dir.dev.js}**/*.js`],
        ['webpack', browserSync.reload]
    );
});