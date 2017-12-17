/**
 * File: gulpfile.js
 * @desc Gulp configuration
 * @author Vuk Samardžić <samardzic.vuk@gmail.com>
 */

const gulp              = require('gulp');
const browser_sync      = require('browser-sync').create();
const sass              = require('gulp-sass');
const watch             = require('gulp-watch');
const postcss           = require('gulp-postcss');
const sourcemaps        = require('gulp-sourcemaps');
const autoprefixer      = require('autoprefixer');
const concat            = require('gulp-concat');
const uglify            = require('gulp-uglify');
const htmlmin           = require('gulp-htmlmin');
const htmlreplace       = require('gulp-html-replace');
const templatecache     = require('gulp-angular-templatecache');
const surge             = require('gulp-surge');
const clean             = require('gulp-clean');
const babel             = require('gulp-babel');
const ng_annotate        = require('gulp-ng-annotate');
const imagemin          = require('gulp-imagemin');

const scripts =
    [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/angular/angular.min.js',
        'node_modules/@uirouter/angularjs/release/angular-ui-router.min.js'
    ];

/**
 * Development setup
 */

gulp.task('serve', ['vendor', 'compile:templates', 'compile:es6' ,'compile:scss'], function()
{
    browser_sync.init({ server: './' });
    gulp.watch('./scss/**/*.scss', ['compile:scss']);
    gulp.watch('*.html', browser_sync.reload);
    gulp.watch('js/**/*.html', ['compile:templates']);
    gulp.watch('js/**/*.js', ['compile:es6']);
});

gulp.task('compile:scss', function()
{
    return gulp
        .src('./scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true, outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browser_sync.stream());
});

function swallowError (error)
{
    console.log(error.toString());
    this.emit('end')
}

gulp.task('compile:es6',  function()
{
    return gulp.src('js/**/*.js')
        .pipe(ng_annotate())
        .pipe(babel({presets: ['babel-preset-es2015']}))
        .on('error', swallowError)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('compile:templates', function ()
{
    return gulp.src('js/**/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templatecache({module:'app'}))
        .pipe(gulp.dest('./js/'));
});

gulp.task('clean',  function()
{
    return gulp.src('./dist', {read: false})
        .pipe(clean());
});

/**
 * Deploy setup
 */

gulp.task('minify:html', function()
{
    return gulp
        .src('*.html')
        .pipe(htmlreplace({
            'css': './css/main.css',
            'js': ['./js/vendor.js','./js/app.js']
        }))
        .pipe(htmlmin({collapseWhitespace: true, collapseInlineTagWhitespace: true, removeComments: true}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('minify:css', function()
{
    return gulp
        .src('./scss/**/*.scss')
        .pipe(sass({errLogToConsole: true, outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('vendor',  function()
{
    return gulp.src(scripts)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('minify:js', ['compile:templates'],  function()
{
    return gulp.src('js/**/*.js')
        .pipe(ng_annotate())
        .pipe(babel({presets: ['babel-preset-es2015']}))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('minify:image', function ()
{
    return gulp.src('./images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('surge', ['minify:html', 'minify:image', 'minify:css', 'vendor', 'minify:js'], function ()
{
    return surge({
        project: './dist',
        domain: 'vuk.surge.sh'
    })
});

/**
 * Main tasks
 */

gulp.task('deploy', ['surge']);
gulp.task('default', ['serve']);