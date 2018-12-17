/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"exports\", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/harmony-module.js?");

/***/ }),

/***/ "./src/hookajax.js":
/*!*************************!*\
  !*** ./src/hookajax.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nlet ob = {}\nob.hookAjax = function (proxy) {\n    window._ahrealxhr = window._ahrealxhr || XMLHttpRequest\n    XMLHttpRequest = function () {\n        this.xhr = new window._ahrealxhr;\n        for (var attr in this.xhr) {\n            var type = \"\";\n            try {\n                type = typeof this.xhr[attr]\n            } catch (e) {}\n            if (type === \"function\") {\n                this[attr] = hookfun(attr);\n            } else {\n                Object.defineProperty(this, attr, {\n                    get: getFactory(attr),\n                    set: setFactory(attr)\n                })\n            }\n        }\n    }\n\n    function getFactory(attr) {\n        return function () {\n            var v = this.hasOwnProperty(attr + \"_\") ? this[attr + \"_\"] : this.xhr[attr];\n            var attrGetterHook = (proxy[attr] || {})[\"getter\"]\n            return attrGetterHook && attrGetterHook(v, this) || v\n        }\n    }\n\n    function setFactory(attr) {\n        return function (v) {\n            var xhr = this.xhr;\n            var that = this;\n            var hook = proxy[attr];\n            if (typeof hook === \"function\") {\n                xhr[attr] = function () {\n                    proxy[attr](that) || v.apply(xhr, arguments);\n                }\n            } else {\n                //If the attribute isn't writeable, generate proxy attribute\n                var attrSetterHook = (hook || {})[\"setter\"];\n                v = attrSetterHook && attrSetterHook(v, that) || v\n                try {\n                    xhr[attr] = v;\n                } catch (e) {\n                    this[attr + \"_\"] = v;\n                }\n            }\n        }\n    }\n\n    function hookfun(fun) {\n        return function () {\n            var args = [].slice.call(arguments)\n            if (proxy[fun] && proxy[fun].call(this, args, this.xhr)) {\n                return;\n            }\n            return this.xhr[fun].apply(this.xhr, args);\n        }\n    }\n    return window._ahrealxhr;\n}\nob.unHookAjax = function () {\n    if (window._ahrealxhr) XMLHttpRequest = window._ahrealxhr;\n    window._ahrealxhr = undefined;\n}\n//for typescript\nob[\"default\"] = ob;\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (ob);\n\n\n//# sourceURL=webpack:///./src/hookajax.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var _hookajax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hookajax */ \"./src/hookajax.js\");\n\n\nfunction webMonitor(options = {}) {\n  /* -----------------------初始化工具配置--------------------------------------*/\n  let opt = {\n    //项目名称（必填）\n    appId: null,\n    // 上报地址（必填）\n    url: 'http://localhost:3001',\n    // 是否上报页面性能数据\n    isPage: true,\n    // 是否上报ajax性能数据\n    isAjax: true,\n    // 是否上报页面资源数据\n    isResource: true,\n    // 监控警告线，超过即上报\n    limitDutration: 3000,\n    // 网络状况\n    network: null,\n    //延迟请求resource时间（等待请求完成）\n    resourceDelay:6000\n  }\n  opt = Object.assign(opt, options);\n\n  /* -----------------------全局配置-------------------------------------- */\n  // resourceTime资源时间\n  let resourceTime = 0;\n  // onreadystatechange请求的XML信息\n  let urlXMLArr = [];\n  // onload的xml请求信息\n  let urlOnload = [];\n  // 页面ajax数量\n  let ajaxLength = 0\n  // 页面是否有ajax请求\n  let haveAjax = false;\n\n  let timer10, timer11, timer12;\n  let ajaxMsg = [];\n  let userAgent = navigator.userAgent;\n  let networkType = \"WIFI\" //1-WIFI,2-2G,3-3G,4-4G,0-OFFLINE\n  // 拦截ajax\n  _hookajax__WEBPACK_IMPORTED_MODULE_0__[\"default\"].hookAjax({\n    onreadystatechange: function (xhr) {\n      if (xhr.readyState === 4) {\n        urlXMLArr.push(0); // 标记接收的请求数\n        if (urlXMLArr.length === ajaxLength && opt.isAjax) {\n          if (!urlOnload.length) {\n            clearTimeout(timer10)\n            timer10 = setTimeout(() => {\n              console.log('ajaxhook  onreadystatechange ')\n              ajaxLength = 0\n              ReportData();\n            }, 200)\n          }\n        }\n      }\n    },\n    onerror: function () {\n    },\n    //jQurey的ajax会用到onload\n    onload: function (xhr) {\n      urlOnload.push(0);\n      console.log(urlOnload.length + '---' + ajaxLength)\n      if (urlOnload.length === ajaxLength && opt.isAjax) {\n        clearTimeout(timer11)\n        timer11 = setTimeout(() => {\n          console.log('ajaxhook onload ') \n          ajaxLength = 0\n          ReportData();\n        }, 200)\n      }\n    },\n    open: function (arg, xhr) {\n        console.log(\"openXHR\")\n      if (arg[1].indexOf('http://localhost') != -1) return;\n      ajaxMsg.push(arg)\n      haveAjax = true;\n      if (ajaxLength === 0) performance.clearResourceTimings();\n      ajaxLength = ajaxLength + 1; // 标记发出的请求数\n    }\n  })\n\n  // 绑定onload事件\n  window.addEventListener(\"load\", function () {\n    if (!haveAjax) {\n      clearTimeout(timer12)\n      timer12 = setTimeout(() => {\n        // console.log('window onload ')\n        // console.log(performance.getEntries())\n        // performance.clearResourceTimings()\n        ReportData()\n      }, opt.resourceDelay)\n    }\n  }, true);\n\n  /* -----------------------页面性能数据-------------------------------------- */\n  let timing = performance.timing\n  // DNS解析时间\n  let dnsTime = timing.domainLookupEnd - timing.domainLookupStart || 0\n  //TCP建立时间\n  let tcpTime = timing.connectEnd - timing.connectStart || 0\n  // 白屏时间\n  let whiteTime = timing.domLoading - timing.navigationStart || 0\n  //dom渲染完成时间\n  let domTime = timing.domContentLoadedEventEnd - timing.navigationStart || 0\n  //页面onload时间\n  let loadTime = timing.loadEventEnd - timing.navigationStart || 0\n  // 页面准备时间\n  let readyTime = timing.fetchStart - timing.navigationStart || 0\n  // 页面重定向时间\n  let redirectTime = timing.redirectEnd - timing.redirectStart || 0\n  // unload时间\n  let unloadTime = timing.unloadEventEnd - timing.unloadEventStart || 0\n  //request请求耗时\n  let requestTime = timing.responseEnd - timing.requestStart || 0\n  //页面解析dom耗时\n  let analysisDomTime = timing.domComplete - timing.domInteractive || 0\n\n  /* -----------------------数据上报---------------------------------------------*/\n  function ReportData() {\n    ajaxLength = 0\n    urlXMLArr = []\n    urlOnload = []\n    ajaxMsg = []\n    haveAjax = false\n    networkType = \"WIFI\"\n\n    let singleReport = false\n    let appId = opt.appId || null;\n    if (!appId) return;\n\n    /* -----------------------统计网络状况数据--------------------------------------*/\n\n    function networkStates() {\n      \n      let ua = navigator.userAgent\n      //app环境外部传入\n      if (opt.network){\n        networkType = opt.network;\n        return\n      }\n      //离线\n      if (!navigator.onLine){\n        networkType = \"OFFLINE\"\n        return\n      }\n      //可以通过API获取\n      if (navigator.connection && (navigator.connection.effectiveType || navigator.connection.type)) {\n        networkType = navigator.connection.effectiveType || navigator.connection.type\n      } \n      //通过GA获取\n      else if (/NetType/.test(ua)) {\n        var type = ua.match(/NetType\\/(\\S*)/);\n        networkType = type[1];\n      } else {\n        networkType = \"WIFI\"\n      }\n    }\n    // 开始上报\n    function reportMain() {\n        /*---------------------------------资源列表的监控---------------------------------*/\n        if (!window.performance && !window.performance.getEntries) return false;\n        resourceTime = 0\n        if (opt.isResource){\n          let resource = performance.getEntriesByType('resource')\n          console.log(resource)\n          resource.forEach((item) => {\n            //总耗时\n            resourceTime += item.duration\n            //单个资源耗时\n            let costTime = item.responseEnd - item.fetchStart\n            if (costTime > opt.limitDutration) {\n              singleReport = true\n              fenchOrigin(costTime, item.name, 'time')\n            }\n            //fetch传输内容 大于1M\n            if (item.transferSize && item.transferSize > 1024 * 1024) {\n              fenchOrigin(item.transferSize, item.name, 'size')\n            }\n          })\n        }\n        \n\n        /*---------------------------------页面性能的监控-----------------------------------*/\n        if (opt.isPage) {\n          let pageTimes = {\n            dnsTime: dnsTime,\n            tcpTime: tcpTime,\n            whiteTime: whiteTime,\n            domTime: domTime,\n            loadTime: loadTime,\n            readyTime: readyTime,\n            redirectTime: redirectTime,\n            unloadTime: unloadTime,\n            requestTime: requestTime,\n            analysisDomTime: analysisDomTime,\n            allResourceTime: resourceTime,\n          }\n          for (let key in pageTimes) {\n            let costTime = Number(pageTimes[key])\n            if (costTime > opt.limitDutration) {\n              if (key === 'allResourceTime' && singleReport) return\n              //页面时间有超过限制时间的上报\n              fenchOrigin(costTime, key, 'page')\n            }\n          }\n        }\n        \n        /*---------------------------------fenchOrigin-----------------------------------*/\n        function fenchOrigin(value, resource,type) {\n          //判断网络状况\n          networkStates()\n          networkType = networkType.toUpperCase()\n          //网络状况好的情况，才会上报\n          if (networkType === \"WIFI\" || networkType === \"4G\") {\n            let params = {\n              appId: appId,\n              markPage: markUv(),\n              markUser: markUser(),\n              url: encodeURIComponent(location.href),\n              resourceName: resource,\n              userAgent: userAgent,\n            }\n            let arg = type === 'time' ? 'costTime' : type === 'size' ? 'size' : 'pageData'\n            params[arg] = value\n            // 上报ajax\n            let _xhr_ = new XMLHttpRequest()\n            _xhr_.open(\"POST\", `${opt.url}`, true)\n            _xhr_.withCredentials = true;\n            _xhr_.timeout = 60000;\n            _xhr_.onreadystatechange = function (res) {\n                console.log(res)\n            }\n            _xhr_.send(JSON.stringify(params))\n          }\n        }\n    }\n    reportMain()\n  }\n  // 获得markpage\n  function markUser() {\n    let markUser = sessionStorage.getItem('ps_markUser') || '';\n    if (!markUser) {\n      markUser = randomString();\n      sessionStorage.setItem('ps_markUser', markUser);\n    }\n    return markUser;\n  }\n  // 获得Uv\n  function markUv() {\n      const date = new Date();\n      let markUv = localStorage.getItem('ps_markUv') || '';\n      const datatime = localStorage.getItem('ps_markUvTime') || '';\n      const today = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' 23:59:59';\n      if ((!markUv && !datatime) || (date.getTime() > datatime * 1)) {\n          markUv = randomString();\n          localStorage.setItem('ps_markUv', markUv);\n          localStorage.setItem('ps_markUvTime', new Date(today).getTime());\n      }\n      return markUv;\n  }\n\n  function randomString(len) {\n      len = len || 10;\n      var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';\n      var maxPos = $chars.length;\n      var pwd = '';\n      for (let i = 0; i < len; i++) {\n          pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos));\n      }\n      return pwd + new Date().getTime();\n  }\n}\n\nif ( true && typeof exports === \"object\" && typeof module === \"object\") {\n    module.exports = webMonitor\n\n} else {\n    window.webMonitor = webMonitor\n}\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ });