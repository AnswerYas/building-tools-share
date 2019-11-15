(function (modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
      var module = installedModules[moduleId] = {
        exports: {}
      };
      // 执行入口函数
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      // 返回
      return module.exports;
    }
    return __webpack_require__("./src/index.js");
  })({
    "./src/index.js": (function (module, __webpack_exports__, __webpack_require__) {
      /* harmony import */
      var _message_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/message.js");
      console.log(_message_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
    }),
    "./src/message.js": (function (module, __webpack_exports__, __webpack_require__) {
      const message = "hello world";
      /* harmony default export */
      __webpack_exports__["default"] = message;
    })
  })
  
  
  
  
  