var gulp = require('gulp'), //本地安装gulp所用到的地方
    less = require('gulp-less');//less转换
    uglify = require('gulp-uglify');//
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    cssmin = require('gulp-minify-css'),//css压缩

//定义一个testLess任务（自定义任务名称）
gulp.task('testLess', function () {
    gulp.src('src/less/index.less') //该任务针对的文件
        .pipe(less()) //该任务调用的模块
        .pipe(gulp.dest('project/css')); //将会在src/css下生成index.css
});

//压缩js文件
gulp.task('testJsMin', function () {
    gulp.src('src/js/lib/jquery.js') //该任务针对的文件
        .pipe(uglify()) //该任务调用的模块
        .pipe(gulp.dest('project/js/lib')); //将会在project/js/lib下生成jquery.min.js
});

alert('a')
