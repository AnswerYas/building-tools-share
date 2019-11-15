const fs = require('fs')
const { join } = require('path')
// 转成ast的包
const parser = require('babylon')
// 解析ast的包
const traverse = require('@babel/traverse').default
// 一个能吧字符串魔化的一个库，用来替换字符串
const MaginSting = require('magic-string')
// 入口文件
const entryPoint = './src/index.js'
// js模板库
const ejs = require('ejs')
// 收集所有依赖
let dependencies = []
// 解析文件的函数
function parse(filename) {
	// 定义了一个依赖数组
	let depsArr = []
	// 读取文件
	const content = fs.readFileSync(filename, 'utf-8')
	// 拿到文件字符串
	const code = new MaginSting(content)
	//转成Ast语法树
	const ast = parser.parse(content, {
		sourceType: 'module',
	})
	console.log(ast)
	// 解析ast语法树
	traverse(ast, {
		// 拦截到声明export的节点
		ExportDeclaration({ node }) {
			const { start, end, declaration } = node
			/**
			 * 替换掉文件中相对应位置的字符成我们想要的
			 * 此处替换掉了export default message 为 __webpack_exports__["default"] = message;
			 */
			code.overwrite(
				start,
				end,
				` __webpack_exports__["default"] = ${declaration.name};`,
			)
		},
		// 拦截到声明import的节点
		ImportDeclaration({ node }) {
			const { start, end, specifiers, source } = node
			const newFile = './src/' + join(node.source.value)
			/**
			 * 此处替换掉了import message from './message.js' 为 var message = __webpack_require__('./src/message.js').default
			 * __webpack_require__('./src/message.js').default的值正好就是message也就是hello world
			 * 这里的specifiers之所以是个数组，是因为import的时候也有可能是import {message, tips} from './message.js'这种情况
			 */
			code.overwrite(
				start,
				end,
				`var ${specifiers[0].local.name} =  __webpack_require__("${newFile}").default;`,
			)
			// 吧所有的import文件放入依赖数组，循环递归解析
			depsArr.push(newFile)
		},
	})
	// 拿到文件的代码字符串
	const _code = code.toString()
	// 放到依赖树里
	dependencies.push({
		filename,
		_code,
	})
	return depsArr
}
const depsArr = parse(entryPoint)
// 循环解析所有依赖，没有使用递归，嗯，因为递归有个栈记录保存，如果使用不当，会有一个爆栈的情况。
for (let item of depsArr) {
	parse(item)
}
//吧所有依赖循环放到我们的IIFE的参数里，形成一个输出模板
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
  })
  `

let result = ejs.render(template, {
	dependencies,
})
// 写入到目标文件夹
fs.writeFileSync('./dist/index.js', result)
console.log('✨ Done')
