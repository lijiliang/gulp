# gulp
本构建工具主要应用于多静态页面的开发，基于gulp文件流实现了对less,img,html一系列的操作，开发环境下能实现浏览器自动刷新加载功能。

## 使用说明

### 安装
```shell
$ git clone https://github.com/lijiliang/gulp.git
$ cd gulp
$ npm install
$ npm i gulp -g
```
### 新建并配置`config.json`
```json
{
    "path": {
        "src": "src",
        "dist": "dist",
        "debug": "debug"
    }
}

```
### 开发模式
```shell
gulp dev
```

### 构建模式
```shell
gulp build
```

教程：
-- 压缩图片：http://www.ydcss.com/archives/26

http://www.oschina.net/code/snippet_1453775_53261

http://www.oschina.net/code/snippet_2672029_57916

https://segmentfault.com/a/1190000002932998

less http://www.ydcss.com/archives/34
