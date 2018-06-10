var gulp = require('gulp');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var md5 = require('gulp-rev');
var rev = require('gulp-rev-collector');
var htmlmin = require('gulp-htmlmin');
var copy = require('gulp-changed');
var url = require('url');
var path = require('path');
var fs = require('fs');
var datacity = require('./data/city');
console.log('aaa');

gulp.task('server', function() {
    gulp.src('dist')
        .pipe(webserver({
            host: 'localhost',
            port: 6060,
            livereload: true,
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    return false
                }
                var pathname = url.parse(req.url, true).pathname;
                pathname = pathname === '/' ? '/index.html' : pathname;
                if (pathname === '/api/city') {
                    res.end(JSON.stringify(datacity));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
})

gulp.task('sass', function() {
    gulp.watch('src/scss/style.scss', function() {
        gulp.src('src/scss/style.scss')
            .pipe(sass())
            .pipe(gulp.dest('src/css'))
    })
})

gulp.task('md5', function() {
    gulp.src('src/css/*.css')
        .pipe(md5())
        .pipe(gulp.dest('dist/css'))
        .pipe(md5.manifest())
        .pipe(gulp.dest('view/css'));
    gulp.src('src/js/*.js')
        .pipe(md5())
        .pipe(gulp.dest('dist/js'))
        .pipe(md5.manifest())
        .pipe(gulp.dest('view/js'));
    gulp.src('src/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true, //压缩html
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulp.dest('dist'))
    gulp.src(['view/css/rev-manifest.json', 'dist/*.html'])
        .pipe(rev({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist'));
    gulp.src(['view/js/rev-manifest.json', 'dist/*.html'])
        .pipe(rev({
            replaceReved: true
        }))
        .pipe(gulp.dest('dist'));
})

// gulp.task('copy', function() {
//     gulp.src('src/js/lib')
//         .pipe(copy())
//         .pipe(gulp.dest('dist/js'))
// })

gulp.task('default', ['server', 'sass']);