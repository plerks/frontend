前端框架脚手架打包时如何实现模块隔离的问题。

Angular和Vue的cli都是基于webpack的。Vite在开发态时似乎不一样，似乎是用到了ES6的模块机制，浏览器会在遇到import时触发http请求，然后Vite启动的node的server返回编译完成的脚本，这样实现懒汉式的加载，不需要像使用webpack时那样`npm run dev`时需要先完全打包(<https://blog.csdn.net/majing0520/article/details/114893365>)。ES6的模块是在`<script>`标签上加上type="module"，然后对应的js文件就成为一个模块，在模块内部可以使用import和export导入导出。CommonJS，AMD的规范也定义了对模块的导入导出，不过写法有些不同，此外CommonJS，AMD是Node的规范，脱离浏览器环境，所以它们可以对`A folder with a package.json file containing a "main" field`进行导入，不止是一个js文件(参考npm官网对[module的定义](<https://docs.npmjs.com/about-packages-and-modules#about-modules>))。不管怎么样，至少在build的时候应该都需要把各个代码打包到一个js文件里，然后就有一个问题，如果不同的组件的js中都命名了同名变量，如果单纯把这些js按依赖的拓扑图顺序整合到一起，那么变量就都处在一个作用域下，就会出现变量名冲突。所以webpack这类工具在打包时必然都需要生成浏览器里能生效的js，实现CommonJS，AMD这种规范中定义的import，export语义，让不同模块代码处在不同命名空间下。

看到了[这个](https://webpack.toobug.net/zh-cn/chapter2/amd.html)文档。这个里面有例子，示范了webpack是如何把CommonJS，AMD规范定义的模块机制在浏览器中实现。

以webpack打包CommonJS的例子来看：

---

入口文件`example1.1.js`：

```javascript
var example2 = require('./example1.2');
example2.sayHello();
```

被依赖的`example1.2.js`：

```javascript
var me = {
    sayHello:function(){
        alert('hello world!');
    }
};
module.exports = me;
```

使用webpack编译后的代码为(<https://github.com/TooBug/webpack-guide/blob/master/examples/chapter2/commonjs/bundle1.1.js>)：

```javascript
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var example2 = __webpack_require__(1);
	example2.sayHello();

/***/ },
/* 1 */
/***/ function(module, exports) {

	var me = {
	    sayHello:function(){
	        alert('hello world!');
	    }
	};

	module.exports = me;

/***/ }
/******/ ]);
```

---

总结一下我对这个打包产物的理解，主体是一个立即执行函数，所有模块都放在这个立即执行函数的参数里，每个模块通过包裹在function里实现了变量隔离，这个立即执行函数通过`return __webpack_require__(0);`调用了入口模块(模块ID为0的)，调用入口模块时又会加载入口模块依赖的模块`var example2 = __webpack_require__(1);`，这样就能一直下去加载所有模块。此外，通过将已经加载了的模块缓存在`installedModules`变量里，能够防止同一模块被重复加载。

参考文档里还有一个webpack打包AMD的例子：

---

一个入口文件`example2.1.js`，一个被依赖的模块`example2.2.js`。

`example2.1.js`：

```javascript
define([
    './example2.2'
],function(example2){
    example2.sayHello();
});
```

`example2.2.js`：

```javascript
define([
],function(){
    return {
        sayHello:function(){
            alert('hello world!');
        }
    };
});
```

同样使用webpack打包，只需要指定入口文件即可，webpack会处理处理好依赖：

```sh
webpack example2.1.js bundle2.1.js
```

生成的bundle2.1.js内容(<https://github.com/TooBug/webpack-guide/blob/master/examples/chapter2/amd/bundle2.1.js>)：

```javascript
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(example2){
	    example2.sayHello();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
	    return {
	        sayHello:function(){
	            alert('hello world!');
	        }
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ]);
```

---

《深入浅出Node.js》(ISBN-9787115335500)第19页，Node也是把模块的代码放到一个函数里实现隔离的。

webpack应该是从入口开始，通过模块中的require和import构建模块间的依赖关系的(估计最终把模块排成一个拓扑序，放到打包后的参数里)，这样一来，猜测一个包在项目的package.json的dependencies还是devDependecies里对webpack的打包没有影响，只要下载下来了，就算把某个dependency写到了devDependencies里，webpack都能正确打包。不过如果是个纯正的Node项目的话，部署的时候应该要用`npm install --production`下载包，这时候如果写错到devDependencies里会导致包缺失。(参考<https://blog.csdn.net/qq_17794813/article/details/117264569>)