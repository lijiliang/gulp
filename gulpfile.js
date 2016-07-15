/**
 * gulp
 */
const gulp = require('gulp');
const watch = require('gulp-watch');
const fileinclude = require('gulp-file-include');     // 合并按模块引入html文件
const less = require('gulp-less');
const cssmin = require('gulp-minify-css');
const concat = require('gulp-concat');                 // 连接插件
const uglify = require('gulp-uglify');                 // 压缩js文件
const plumber = require('gulp-plumber');               // 防止出错崩溃的插件
const sourcemaps = require('gulp-sourcemaps');         //生成map
const browserSync = require('browser-sync').create();  //实时刷新页面
const imagemin = require('gulp-imagemin');             //图片压缩
const pngquant = require('imagemin-pngquant');         // 深度压缩png图片
const cache = require('gulp-cache');                   // 缓存，只对修改的内容进行处理
const rev = require('gulp-rev');                       // 对文件名加MD5后缀
const revCollector = require('gulp-rev-collector');    // 路径替换

/*设置相关*/
const config = require('./config.json');
const srcDir = config.path.src;
const distDir = config.path.dist;

/* 凡是以_开关的文件或者以_开关的文件夹下的文件都不执行编译 */

// html
const _htmlSrcPath = srcDir+'/html/';
const _htmlDistPath = distDir + '/html';   // dist文件输出html
const _htmlFile = [
    _htmlSrcPath + '*.html',
    _htmlSrcPath + '**/*.html',
    `!${_htmlSrcPath}/**/_*/*.html`,
    `!${_htmlSrcPath}/**/_*/**/*.html`,
    `!${_htmlSrcPath}/**/_*.html`
]

// css
const _cssSrcPath = srcDir+'/less/';
const _cssDistPath = distDir + '/css';   // dist文件输出css
const _cssFile = [
    _cssSrcPath + '*.less',
    _cssSrcPath + '**/*.less',
    `!${_cssSrcPath}/**/_*/*.less`,
    `!${_cssSrcPath}/**/_*/**/*.less`,
    `!${_cssSrcPath}/**/_*.less`
]

//js
const _jsSrcPath = srcDir + '/js/';
const _jsDistPath = distDir + '/js';
const _jsFile = [
    _jsSrcPath + '*.js'
]
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

/**
 * 编译less
*/
gulp.task('css:dev', ()=>{
    gulp.src(_cssFile)
    .pipe(sourcemaps.init())
    .pipe(plumber())   // 防止less编译出错崩溃
    .pipe(less())
    .pipe(cssmin())
    //.pipe(rev())       // 文件名加MD5后缀
    .pipe(sourcemaps.write('./'))  //'../map'
    .pipe(gulp.dest(_cssDistPath))
    // .pipe(rev.manifest('cssmap.json', {
    //     merge: true
    // }))       //- 生成一个cssmap.json
    //.pipe(gulp.dest(distDir + '/map'))  //- 将 rev-manifest.json 保存到 map 目录内
    .on('end', ()=>{
        console.log('css 编译完成！')
    })
})

/**
 * 压缩js
 */
gulp.task('js:dev', ()=>{
    gulp.src(_jsFile)
    .pipe(uglify({
        mangle: true,
        compress: true,//类型：Boolean 默认：true 是否完全压缩
        //mangle: {except: ['require' ,'exports' ,'module' ,'$']}//排除混淆关键字
    }))
    .pipe(gulp.dest(_jsDistPath))
    .on('end', ()=>{
        console.log('js 编译完成！')
    })
})

/* 实时更新浏览器页面 */
gulp.task('browserSync', ()=>{
    var files = [
        '**/*.html',
        '**/*.css',
        '**/*.js'
    ]
    browserSync.init(files,{
        server: {
            baseDir: distDir    // 实时更新页面的目录文件
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

// dev 监听任务
gulp.task('dev:watch',['browserSync'],()=>{
    // watch html
    watch(_htmlFile,{event:['add','change']},(file)=>{
        console.log(file.path + ' complite！');
    })
    .pipe(fileinclude('@@'))
    .pipe(gulp.dest(_htmlDistPath));

    // watch less css
    watch(_cssFile, {event:['add','change']}, (file)=>{
        console.log(file.path + ' complite！');
    })
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(less())
    .pipe(cssmin())
    .pipe(sourcemaps.write('./'))  //'../map'
    .pipe(gulp.dest(_cssDistPath));

    // watch js

})

/*dev环境编译执行*/
gulp.task('dev', ['html:build','css:dev','js:dev','image:min','dev:watch','browserSync'])
