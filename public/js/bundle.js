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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/Currency.js":
/*!****************************!*\
  !*** ./src/js/Currency.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar Currency = function Currency(id, currencySymbol, currencyName) {\n    _classCallCheck(this, Currency);\n\n    this.id = id;\n    this.currencySymbol = currencySymbol;\n    this.currencyName = currencyName;\n};\n\nexports.default = Currency;\n\n//# sourceURL=webpack:///./src/js/Currency.js?");

/***/ }),

/***/ "./src/js/CurrencyService.js":
/*!***********************************!*\
  !*** ./src/js/CurrencyService.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _config = __webpack_require__(/*! ./config */ \"./src/js/config.js\");\n\nvar _Currency = __webpack_require__(/*! ./Currency */ \"./src/js/Currency.js\");\n\nvar _Currency2 = _interopRequireDefault(_Currency);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar CurrencyService = function () {\n    function CurrencyService() {\n        _classCallCheck(this, CurrencyService);\n    }\n\n    _createClass(CurrencyService, null, [{\n        key: 'getListOfCurrencies',\n        value: function getListOfCurrencies() {\n            return new Promise(function (resolve, reject) {\n                fetch(_config.LIST_CURRENCIES_API_URL).then(function (fetchResponse) {\n                    return fetchResponse.json();\n                }).catch(function (error) {\n                    return reject(error);\n                }).then(function (json) {\n                    var results = [];\n\n                    Object.values(json.results).forEach(function (value) {\n                        //TODO: find out if this is the best way to pass currencies\n                        results.push(new _Currency2.default(value.id, value.currencySymbol, value.currencyName));\n                    });\n                    resolve(results);\n                }).catch(function (error) {\n                    return reject(error);\n                });\n            });\n        }\n    }, {\n        key: 'convert',\n        value: function convert(fromCurrency, toCurrency, currentValue) {\n\n            var conversionKey = fromCurrency + '_' + toCurrency;\n\n            var requestUrl = _config.CONVERT_CURRENCIES_API_URL + '?q=' + conversionKey;\n\n            return new Promise(function (resolve, reject) {\n                fetch(requestUrl).then(function (response) {\n                    return response.json();\n                }).catch(function (error) {\n                    return reject(error);\n                }).then(function (json) {\n                    var result = parseFloat(json.results[conversionKey].val);\n                    resolve(result);\n                }).catch(function (error) {\n                    return reject(error);\n                });\n            });\n        }\n    }]);\n\n    return CurrencyService;\n}();\n\nexports.default = CurrencyService;\n\n//# sourceURL=webpack:///./src/js/CurrencyService.js?");

/***/ }),

/***/ "./src/js/config.js":
/*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar API_URL = exports.API_URL = 'http://localhost:3000/';\n// export const API_URL = 'https://free.currencyconverterapi.com/'\nvar LIST_CURRENCIES_API_URL = exports.LIST_CURRENCIES_API_URL = API_URL + 'api/v5/currencies';\nvar CONVERT_CURRENCIES_API_URL = exports.CONVERT_CURRENCIES_API_URL = API_URL + 'api/v5/convert';\n\n//DOM IDS\nvar FROM_CURRENCY_VALUE_INPUT_ID = exports.FROM_CURRENCY_VALUE_INPUT_ID = 'fromCurrencyValue';\nvar FROM_CURRENCY_SELECT_ID = exports.FROM_CURRENCY_SELECT_ID = 'fromCurrency';\nvar CONVERT_BUTTON_ID = exports.CONVERT_BUTTON_ID = 'convert';\nvar TO_CURRENCY_VALUE_INPUT_ID = exports.TO_CURRENCY_VALUE_INPUT_ID = 'toCurrencyValue';\nvar TO_CURRENCY_SELECT_ID = exports.TO_CURRENCY_SELECT_ID = 'toCurrency';\n\n//# sourceURL=webpack:///./src/js/config.js?");

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _CurrencyService = __webpack_require__(/*! ./CurrencyService */ \"./src/js/CurrencyService.js\");\n\nvar _CurrencyService2 = _interopRequireDefault(_CurrencyService);\n\nvar _config = __webpack_require__(/*! ./config */ \"./src/js/config.js\");\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n//TODO: START: abastract out to dom related class\nfunction getElementById(id) {\n    return document.getElementById(id);\n}\n\nfunction createElement(type) {\n    return document.createElement(type);\n}\n\nfunction addOnClickEventListener(element, listener) {\n    element.onclick = listener;\n}\n\nfunction getInputValue(element) {\n    return element.value;\n}\n\nfunction setInputValue(element, value) {\n    element.value = value;\n}\n\nfunction populateSelectInput(element, data, optionName, valueName) {\n    Object.values(data).forEach(function (datum) {\n        var opt = createElement('option');\n        opt.value = datum[optionName];\n        opt.innerHTML = datum[valueName];\n        element.appendChild(opt);\n    });\n}\n\n//END: abastract out to dom related class\n\nfunction fetchingListOfCurrencies() {\n    //TODO: show loading screen..\n}\n\nfunction listOfCurrenciesFetched(currencies) {\n    populateSelectInput(getElementById(_config.FROM_CURRENCY_SELECT_ID), currencies, 'id', 'currencyName');\n    populateSelectInput(getElementById(_config.TO_CURRENCY_SELECT_ID), currencies, 'id', 'currencyName');\n}\n\nfunction getListOfCurrenciesFailed(error) {}\n//TODO: handle this\n\n\n//fetch list of currencies\nfetchingListOfCurrencies();\n\n_CurrencyService2.default.getListOfCurrencies().then(function (currencies) {\n    return listOfCurrenciesFetched(currencies);\n}).catch(function (error) {\n    return getListOfCurrenciesFailed(error);\n});\n\naddOnClickEventListener(getElementById(_config.CONVERT_BUTTON_ID), function () {\n    var fromCurrency = getInputValue(getElementById(_config.FROM_CURRENCY_SELECT_ID));\n    var toCurrency = getInputValue(getElementById(_config.TO_CURRENCY_SELECT_ID));\n    var currentValue = getInputValue(getElementById(_config.FROM_CURRENCY_VALUE_INPUT_ID));\n\n    _CurrencyService2.default.convert(fromCurrency, toCurrency, currentValue).then(function (result) {\n        return setInputValue(getElementById(_config.TO_CURRENCY_VALUE_INPUT_ID), result);\n    }).catch(function (error) {\n        console.log(error); /*TODO: handle error*/\n    });\n});\n\n//# sourceURL=webpack:///./src/js/index.js?");

/***/ })

/******/ });