(function (modules) {
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
      
            "./src/index.js": (function (module, __webpack_exports__, __webpack_require__) {
                var message =  __webpack_require__("./src/message.js").default;
document.querySelector('#root').innerHTML = message
             }),
      
            "./src/message.js": (function (module, __webpack_exports__, __webpack_require__) {
                const message = 'hello world'

 __webpack_exports__["default"] = message;
             }),
      
  })
  