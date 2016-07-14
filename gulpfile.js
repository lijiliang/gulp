/**
 * gulp
 */
const gulp = require('gulp');
const watch = require('gulp-watch');
const fileinclude = require('gulp-file-include');  // 合并按模块引入html文件
const browserSync = require('browser-sync').create();  // 实时刷新页面
const imagemin = require('gulp-imagemin');    //图片压缩
const pngquant = require('imagemin-pngquant');  // 深度压缩png图片
const cache = require('gulp-cache');    //缓存，只对修改的内容进行处理

/*设置相关*/
const config = require('./config.json');
const srcDir = config.path.src;
const distDir = config.path.dist;

/* 凡是以_开关的文件或者以_开关的文件夹下的文件都不执行编译 */
const _htmlSrcPath = srcDir+'/html/';
const _htmlDistPath = distDir + '/html';   // dist文件输出
const _htmlFile = [
    _htmlSrcPath + '*.html',
    _htmlSrcPath + '**/*.html',
    `!${_htmlSrcPath}/**/_*/*.html`,
    `!${_htmlSrcPath}/**/_*/**/*.html`,
    `!${_htmlSrcPath}/**/_*.html`
]

/**
 * 监听html
 */
gulp.task('html:dev',['browserSync'], ()=>{
    watch(_htmlFile,{event:['add','change']},(file)=>{
        console.log(file.path + ' complite！');
    })
    .pipe(fileinclude('@@'))
    .pipe(gulp.dest(_htmlDistPath));
});
/**
 * 编译html
*/
gulp.task('html:build', ()=>{
    gulp.src(_htmlFile)
    .pipe(fileinclude('@@'))
    .pipe(gulp.dest(_htmlDistPath))
    .on('end', ()=>{
        console.log('html 编译完成！');
    });
});

/* 实时更新浏览器页面 */
gulp.task('browserSync', ()=>{
    var files = [
        '**/*.html',
        '**/*.css',
        '**/*.js'
    ]
    browserSync.init(files,{
        server: {
            baseDir: distDir
        }
    });
});

/* 图片压缩 */
gulp.task('image:min', ()=>{
    gulp.src(srcDir + '/img/**/*.{png,jpg,gif,ico}')
    .pipe(cache(imagemin({
        optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true,  //类型：Boolean 默认：false 无损压缩jpg图片
        svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
        use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件,不过好像没有什么效果
    })))
    .pipe(gulp.dest(distDir + '/img'))
})

/*dev环境编译执行*/
gulp.task('dev', ['html:build','html:dev','image:min','browserSync'])
