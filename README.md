### 前端构建工具使用心路历程
我做前端也四年多了，接触到的构建工具有grunt、gulp、webpack。从陌生到熟悉。一开始可能就是机械的跑一下命令，至于它干了些什么都不知道，
只知道这样就可以去部署了，到后来慢慢了解和熟悉。构建工具的发展过程其实也让我们前端从零零散散到了一个工程级别的，

##### 我们为什么需要构建工具？
简单来说就是自动化，他做了些什么？

* 性能优化
代码压缩 文件合并 死代码删除 无用代码删除 autofix cdn加速

* 预处理
less sass coffeescript typescript

* 风格与测试
tslint git hook

* 模块化
之前的前端开发我们可能缺乏一种模块的开发方式，最早我们采用闭包（IIFE）以至于有了后来的，amd(commonjs)，cmd(seajs)等等模块化解决方案,
nodejs的commonjs,还有umd（amd+commonjs）,到后面的es6的Module，

##### 我用过的构建工具
一开始参与前端开发并没有使用到构建工具，但是总会有些需求，比如一些js代码的压缩，代码混淆（源码暴露），文件合并，可能一开始会粗暴的做一些手工处理，
后来接触到了grunt，为什么要用它，最简单的一句话就是自动化，替代了我们很多手工工作，也避免了很多低级失误（所以说偷懒能使人类文明进步），它的使用基本就是任务式的（配置驱动），以下是我之前使用项目的一个`grunt`任务注册
```js
     grunt.registerTask(
        'build', [
            'clean:all',        //清除数据
            'copy:build',       //拷贝数据
            'abs',              //处理绝对路径问题
            'imagemin',         //压缩图片
            'useminPrepare',    //useminPrepare的功能是进行一些前期工作
            'less',             //处理less文件
            'concat',           //合并文件
            'uglify',           //压缩js 文件
            'cssmin',           //压缩css 文件
            'filerev:images',   //图片文件增加MD5
            'usemin:css',       //更新css 中图片的名称
            'cdn:css',          //css 中静态文件加 cdn 前缀
            'filerev:css',      //css 文件加 MD5
            'filerev:js',       //js  文件加 MD5
            'usemin:html',      //更新html 静态资源名称
            'cdn:html',         //html 中静态文件加 cdn 前缀
            'oss'               //上传oss
        ]
    )
```
看起来一目了然，要干些什么很清楚，然后它就会一个个任务的跑下来，看着控制台一行行的代码跑过，感觉还是可以的，但随着打包次数的增多就会觉得它很慢，特别是紧急部署的时候，等的很着急，而且他是串行的，而且是I/O非常频繁，读文件，写文件。以至于电脑内存会告警，特别遇到大文件，电脑风扇呼呼的响。

后来也解除了`gulp`，总体上感觉跟`grunt`差不多，但是看起来可能更舒服，个人感觉它的出现也得益于node的发展，像node中的stream，pipe就得到了很好的应用
它的配置基本就跟写node代码一样，很输入，下面是一段gulp的配置。
```js
    gulp.task('html', function(){
    return gulp.src('client/templates/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('build/html'))
    });

    gulp.task('css', function(){
    return gulp.src('client/templates/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('build/css'))
    });

    gulp.task('default', [ 'html', 'css' ]);
```
它相对于`grunt`效率要快很多，一次I/O可以处理多个任务，但这两兄弟都没解决一个问题就是`module`（模块化）

再后面就接触到`webpack`了，它是一个模块化的打包工具，一开始接触觉得它很复杂，但又会觉得很简单很神奇，简单神奇：装了一个cli工具，init一个项目，`npm run dev`
就能看到`hello world`了，太舒服了，但回头去看它的配置却又很复杂，觉得很懵逼，它是怎么处理这些东西？也会猜测一下它的内部机制，他怎么就能把我们的es6module变成
了commonjs规范了？等等一系列疑问。
它的意义与grunt，gulp决然不同了，它不仅仅只是作为一个工具，更是我们前端工程化自动化的一个开端，像我们现在的cyber-scripts就很棒，整个前端从开发到部署一气呵成，帮助我们省去了很多精力，让我们前端真正成为了一个工程，让我们前端也有自己的话语权，像我们以前做的很多前端项目，可能都是以各种模板的方式出现在各种语言里，我们的分量看起来很低，别人说起前端，前端有啥啊，不就是调个ajax渲染一下数据。虽然心有不服，可好像还真是如此，但现在的前端足以让人重视起来了，我们也会嘲讽下后台，
你们后台有什么啊不就是写个增删改查吗，有那么难吗。确实到了现在前端的分量足够重了，很多公司都采用bff架构，像我们也有使用的微前端解决方案也越来越多，还有各种大数据可视化。severless等等慢慢把我们推上了一个高峰，不再是之前那个jq一把梭的时代了（不过jq是真香）。

下面我们来看下`webpack`的基本配置文件，基本就是由`mode` `entry` `output` `loader` `plugin`几个部分组成。
* mode 环境
* entry 入口
* output 出口
* loader 加载器
* plugin 插件

webpack的构建过程大概有四个阶段
* compiler 初始化compiler实例，开始构建
* compilation 以开发模式运行时，每当检测到文件变化，一次新的 Compilation 将被创建。一个 Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。Compilation 对象也提供了很多事件回调供插件做扩展。
* chunk Parser从chunk开始解析依赖，使用module和dependency管理代码相互关系
* template 输出到dist的模板
简单概括下就是通过entry入口文件，开始解析文件构建AST语法树，依赖递归，然后在依赖递归的解析过程中，根据不同的文件类型采用不同的loader进行转换，然后生成代码块`chunk`,然后根据`template` 使用Template基于Compilation的数据生成结果输出到文件系统，当然webpack也是有生命周期的，在不同的阶段它会广播出一些事件，让一开始注册的plugin监听到对ast进行处理覆盖之前的结果。

##### 什么是AST
abstract syntax tree 中文就是抽象语法树，是源代码语法结构的一种抽象标识，它以树状的形式表现变成语言的语法结构，树上的每个节点都标识源代码中的一种结构。
##### AST可以干什么
* 我们常用的eslint就是基于AST
* IDE的错误提示，代码格式化，高亮，自动补全等。
* Babel等解析工具
* webpack的打包

下面主要看看webpack怎么通过Parser解析chunk再到template输出，怎么通过ast来进行打包的。

首先递归识别依赖，构建依赖图谱，将代码转化成ast
```js
    const fs = require("fs")
    const { join } = require("path")
    const parser = require("babylon")
    const entryPoint = "./src/index.js"

    const content = fs.readFileSync(entryPoint, "utf-8");
    //转成Ast语法树
    const ast = parser.parse(content, {
        sourceType: "module"
    });
    console.log(ast)
```
ast 大概就长这样子，我们的js代码经过词法分析和语法分析变成了下面的ast，显示词法拆解，`import message from ./message.js`就被拆成了一个个的单词，然后语法分析就是确定这些词语之前的关系，
和他们最终表达的含义。
```js
    Node {
    type: 'File',
    start: 0,
    end: 86,
    loc: SourceLocation {
        start: Position { line: 1, column: 0 },
        end: Position { line: 2, column: 51 }
    },
    program: Node {
        type: 'Program',
        start: 0,
        end: 86,
        loc: SourceLocation { start: [Position], end: [Position] },
        sourceType: 'module',
        body: [ [Node], [Node] ],
        directives: []
    },
    comments: [],
    tokens: [
        Token {
            type: [KeywordTokenType],
            value: 'import',
            start: 0,
            end: 6,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: 'message',
            start: 7,
            end: 14,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: 'from',
            start: 15,
            end: 19,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: './message.js',
            start: 20,
            end: 34,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: 'document',
            start: 35,
            end: 43,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: undefined,
            start: 43,
            end: 44,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: 'querySelector',
            start: 44,
            end: 57,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: undefined,
            start: 57,
            end: 58,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: '#root',
            start: 58,
            end: 65,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: undefined,
            start: 65,
            end: 66,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: undefined,
            start: 66,
            end: 67,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: 'innerHTML',
            start: 67,
            end: 76,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: '=',
            start: 77,
            end: 78,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: 'message',
            start: 79,
            end: 86,
            loc: [SourceLocation]
        },
        Token {
            type: [TokenType],
            value: undefined,
            start: 86,
            end: 86,
            loc: [SourceLocation]
        }
    ]
}
```
然后我们可以通过一个解析ast的工具来分析下ast，此处我们用的是`@babel/traverse`
```js
    const MaginSting = require('magic-string')
    const content = fs.readFileSync(filename, 'utf-8')
    const code = new MaginSting(content)

    traverse(ast, {
        ExportDeclaration({ node }) {
            const { start, end, declaration } = node;
            code.overwrite(
                start,
                end,
                ` __webpack_exports__["default"] = ${declaration.name};`
            );
        },
        ImportDeclaration({ node }) {
            const { start, end, specifiers, source } = node;
            code.overwrite(
                start,
                end,
                `var ${specifiers[0].local.name} =  __webpack_require__("${newFile}").default;`
            );
        }
    });
```
这里主要通过两个声明的钩子捕获到import与export然后覆盖相关的节点代码。
接下来我们就要输出模板代码，就是把所有的依赖循环输出，此处用了ejs来渲染模板。
```js
    let template = `(function (modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        return module.exports;
        }
        return __webpack_require__("./src/index.js");
    })({
        <% for(var i=0;i<dependencies.length;i++){ %>
                "<%- dependencies[i]["filename"] %>": (function (module, __webpack_exports__, __webpack_require__) {
                    <%- dependencies[i]["_code"] %>
                }),
        <%}%>
    })`
```

共勉：希望我们能掌握javascript语言的核心和本质，不在众多的框架和工具中迷失自我。