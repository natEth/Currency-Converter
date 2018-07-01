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

/***/ "./node_modules/idb/lib/idb.js":
/*!*************************************!*\
  !*** ./node_modules/idb/lib/idb.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function() {
  function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function promisifyRequest(request) {
    return new Promise(function(resolve, reject) {
      request.onsuccess = function() {
        resolve(request.result);
      };

      request.onerror = function() {
        reject(request.error);
      };
    });
  }

  function promisifyRequestCall(obj, method, args) {
    var request;
    var p = new Promise(function(resolve, reject) {
      request = obj[method].apply(obj, args);
      promisifyRequest(request).then(resolve, reject);
    });

    p.request = request;
    return p;
  }

  function promisifyCursorRequestCall(obj, method, args) {
    var p = promisifyRequestCall(obj, method, args);
    return p.then(function(value) {
      if (!value) return;
      return new Cursor(value, p.request);
    });
  }

  function proxyProperties(ProxyClass, targetProp, properties) {
    properties.forEach(function(prop) {
      Object.defineProperty(ProxyClass.prototype, prop, {
        get: function() {
          return this[targetProp][prop];
        },
        set: function(val) {
          this[targetProp][prop] = val;
        }
      });
    });
  }

  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return this[targetProp][prop].apply(this[targetProp], arguments);
      };
    });
  }

  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyCursorRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function Index(index) {
    this._index = index;
  }

  proxyProperties(Index, '_index', [
    'name',
    'keyPath',
    'multiEntry',
    'unique'
  ]);

  proxyRequestMethods(Index, '_index', IDBIndex, [
    'get',
    'getKey',
    'getAll',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(Index, '_index', IDBIndex, [
    'openCursor',
    'openKeyCursor'
  ]);

  function Cursor(cursor, request) {
    this._cursor = cursor;
    this._request = request;
  }

  proxyProperties(Cursor, '_cursor', [
    'direction',
    'key',
    'primaryKey',
    'value'
  ]);

  proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
    'update',
    'delete'
  ]);

  // proxy 'next' methods
  ['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {
    if (!(methodName in IDBCursor.prototype)) return;
    Cursor.prototype[methodName] = function() {
      var cursor = this;
      var args = arguments;
      return Promise.resolve().then(function() {
        cursor._cursor[methodName].apply(cursor._cursor, args);
        return promisifyRequest(cursor._request).then(function(value) {
          if (!value) return;
          return new Cursor(value, cursor._request);
        });
      });
    };
  });

  function ObjectStore(store) {
    this._store = store;
  }

  ObjectStore.prototype.createIndex = function() {
    return new Index(this._store.createIndex.apply(this._store, arguments));
  };

  ObjectStore.prototype.index = function() {
    return new Index(this._store.index.apply(this._store, arguments));
  };

  proxyProperties(ObjectStore, '_store', [
    'name',
    'keyPath',
    'indexNames',
    'autoIncrement'
  ]);

  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'put',
    'add',
    'delete',
    'clear',
    'get',
    'getAll',
    'getKey',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'openCursor',
    'openKeyCursor'
  ]);

  proxyMethods(ObjectStore, '_store', IDBObjectStore, [
    'deleteIndex'
  ]);

  function Transaction(idbTransaction) {
    this._tx = idbTransaction;
    this.complete = new Promise(function(resolve, reject) {
      idbTransaction.oncomplete = function() {
        resolve();
      };
      idbTransaction.onerror = function() {
        reject(idbTransaction.error);
      };
      idbTransaction.onabort = function() {
        reject(idbTransaction.error);
      };
    });
  }

  Transaction.prototype.objectStore = function() {
    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
  };

  proxyProperties(Transaction, '_tx', [
    'objectStoreNames',
    'mode'
  ]);

  proxyMethods(Transaction, '_tx', IDBTransaction, [
    'abort'
  ]);

  function UpgradeDB(db, oldVersion, transaction) {
    this._db = db;
    this.oldVersion = oldVersion;
    this.transaction = new Transaction(transaction);
  }

  UpgradeDB.prototype.createObjectStore = function() {
    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
  };

  proxyProperties(UpgradeDB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(UpgradeDB, '_db', IDBDatabase, [
    'deleteObjectStore',
    'close'
  ]);

  function DB(db) {
    this._db = db;
  }

  DB.prototype.transaction = function() {
    return new Transaction(this._db.transaction.apply(this._db, arguments));
  };

  proxyProperties(DB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(DB, '_db', IDBDatabase, [
    'close'
  ]);

  // Add cursor iterators
  // TODO: remove this once browsers do the right thing with promises
  ['openCursor', 'openKeyCursor'].forEach(function(funcName) {
    [ObjectStore, Index].forEach(function(Constructor) {
      // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
      if (!(funcName in Constructor.prototype)) return;

      Constructor.prototype[funcName.replace('open', 'iterate')] = function() {
        var args = toArray(arguments);
        var callback = args[args.length - 1];
        var nativeObject = this._store || this._index;
        var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));
        request.onsuccess = function() {
          callback(request.result);
        };
      };
    });
  });

  // polyfill getAll
  [Index, ObjectStore].forEach(function(Constructor) {
    if (Constructor.prototype.getAll) return;
    Constructor.prototype.getAll = function(query, count) {
      var instance = this;
      var items = [];

      return new Promise(function(resolve) {
        instance.iterateCursor(query, function(cursor) {
          if (!cursor) {
            resolve(items);
            return;
          }
          items.push(cursor.value);

          if (count !== undefined && items.length == count) {
            resolve(items);
            return;
          }
          cursor.continue();
        });
      });
    };
  });

  var exp = {
    open: function(name, version, upgradeCallback) {
      var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
      var request = p.request;

      if (request) {
        request.onupgradeneeded = function(event) {
          if (upgradeCallback) {
            upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
          }
        };
      }

      return p.then(function(db) {
        return new DB(db);
      });
    },
    delete: function(name) {
      return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
    }
  };

  if (true) {
    module.exports = exp;
    module.exports.default = module.exports;
  }
  else {}
}());


/***/ }),

/***/ "./src/js/Currency.js":
/*!****************************!*\
  !*** ./src/js/Currency.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Currency = function Currency(id, currencySymbol, currencyName) {
    _classCallCheck(this, Currency);

    this.id = id;
    this.currencySymbol = currencySymbol;
    this.currencyName = currencyName;
};

exports.default = Currency;

/***/ }),

/***/ "./src/js/CurrencyService.js":
/*!***********************************!*\
  !*** ./src/js/CurrencyService.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = __webpack_require__(/*! ./config */ "./src/js/config.js");

var _Currency = __webpack_require__(/*! ./Currency */ "./src/js/Currency.js");

var _Currency2 = _interopRequireDefault(_Currency);

var _LocalStorageService = __webpack_require__(/*! ./LocalStorageService */ "./src/js/LocalStorageService.js");

var _LocalStorageService2 = _interopRequireDefault(_LocalStorageService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ONE_HOUR_IN_MS = 60 * 60 * 1000;

var CurrencyService = function () {
    function CurrencyService() {
        _classCallCheck(this, CurrencyService);
    }

    _createClass(CurrencyService, null, [{
        key: 'getListOfCurrencies',
        value: function getListOfCurrencies() {
            var _this = this;

            return _LocalStorageService2.default.getAllCurrencies().then(function (currencies) {
                if (currencies && 0 !== currencies.length) return new Promise(function (resolve) {
                    return resolve(currencies);
                }); //TODO: again is this the best way to do this

                return _this.fetchCurrenciesFromRemote();
            });
        }
    }, {
        key: 'fetchCurrenciesFromRemote',
        value: function fetchCurrenciesFromRemote() {
            return fetch(_config.LIST_CURRENCIES_API_URL).then(function (fetchResponse) {
                return fetchResponse.json();
            }).then(function (json) {
                var results = [];

                Object.values(json.results).forEach(function (value) {
                    //TODO: find out if this is the best way to pass currencies (we could pass them as is)
                    var currency = new _Currency2.default(value.id, value.currencySymbol, value.currencyName);
                    _LocalStorageService2.default.saveCurrency(currency);
                    results.push(currency);
                });
                return results;
            });
        }
    }, {
        key: 'convert',
        value: function convert(fromCurrency, toCurrency, currentValue) {
            var _this2 = this;

            var conversionQuery = fromCurrency + '_' + toCurrency;
            var reverseConversionQuery = toCurrency + '_' + fromCurrency;

            return _LocalStorageService2.default.findConversionRate(conversionQuery).then(function (currency) {
                //b/c the server refreshes prices every one hour
                if (currency && new Date().getTime() - currency.dateCreated < ONE_HOUR_IN_MS) return currency.rate * currentValue;

                return _this2.convertCurrenciesFromRemote(conversionQuery, reverseConversionQuery, currentValue);
            });
        }
    }, {
        key: 'convertCurrenciesFromRemote',
        value: function convertCurrenciesFromRemote(conversionQuery, reverseConversionQuery, currentValue) {
            var requestUrl = _config.CONVERT_CURRENCIES_API_URL + '?q=' + conversionQuery + ',' + reverseConversionQuery + '&' + _config.COMPACT_QUEARY_PARAM;

            return fetch(requestUrl).then(function (response) {
                return response.json();
            }).then(function (json) {
                _LocalStorageService2.default.saveConversionRate(conversionQuery, json[conversionQuery]);
                _LocalStorageService2.default.saveConversionRate(reverseConversionQuery, json[reverseConversionQuery]);

                var result = json[conversionQuery];
                return result * currentValue;
            });
        }
    }]);

    return CurrencyService;
}();

exports.default = CurrencyService;

/***/ }),

/***/ "./src/js/DomHelper.js":
/*!*****************************!*\
  !*** ./src/js/DomHelper.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomHelper = function () {
    function DomHelper() {
        _classCallCheck(this, DomHelper);
    }

    _createClass(DomHelper, null, [{
        key: 'getElementById',
        value: function getElementById(id) {
            return document.getElementById(id);
        }
    }, {
        key: 'createElement',
        value: function createElement(type) {
            return document.createElement(type);
        }
    }, {
        key: 'addOnClickEventListener',
        value: function addOnClickEventListener(element, listener) {
            element.onclick = listener;
        }
    }, {
        key: 'getInputValue',
        value: function getInputValue(element) {
            return element.value;
        }
    }, {
        key: 'setInputValue',
        value: function setInputValue(element, value) {
            element.value = value;
        }
    }, {
        key: 'populateSelectInput',
        value: function populateSelectInput(element, options) {
            var _this = this;

            var data = options.data,
                textKey = options.textKey,
                valueKey = options.valueKey,
                clearOptions = options.clearOptions;


            if (clearOptions === true) element.innerHTML = '';

            Object.values(data).forEach(function (datum) {
                var opt = _this.createElement('option');
                opt.value = datum[valueKey];
                opt.innerHTML = datum[textKey];
                element.appendChild(opt);
            });
        }
    }]);

    return DomHelper;
}();

exports.default = DomHelper;

/***/ }),

/***/ "./src/js/LocalStorageService.js":
/*!***************************************!*\
  !*** ./src/js/LocalStorageService.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _idb = __webpack_require__(/*! idb */ "./node_modules/idb/lib/idb.js");

var _idb2 = _interopRequireDefault(_idb);

var _config = __webpack_require__(/*! ./config */ "./src/js/config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalStorageService = function () {
    function LocalStorageService() {
        _classCallCheck(this, LocalStorageService);
    }

    _createClass(LocalStorageService, null, [{
        key: 'open',
        value: function open() {
            return _idb2.default.open(_config.DATABASE_NAME, 1, function (upgradeDB) {
                //TODO: use key path
                switch (upgradeDB.oldVersion) {
                    case 0:
                        upgradeDB.createObjectStore(_config.CURRENCIES_STORE_NAME, { keyPath: 'id' });
                        upgradeDB.createObjectStore(_config.CONVERSION_RATES_STORE_NAME, { keyPath: 'id' });

                }
            });
        }
    }, {
        key: 'saveCurrency',
        value: function saveCurrency(currency) {
            var db = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


            return (db ? db : this.open()).then(function (db) {
                var tx = db.transaction(_config.CURRENCIES_STORE_NAME, _config.IDB_TRANSACTION_TYPE_READ_WRITE);
                var currencyStore = tx.objectStore(_config.CURRENCIES_STORE_NAME);
                currencyStore.put(currency);
                return tx.complete;
            });
        }
    }, {
        key: 'getAllCurrencies',
        value: function getAllCurrencies() {
            var db = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;


            return (db ? db : this.open()).then(function (db) {
                var tx = db.transaction(_config.CURRENCIES_STORE_NAME, _config.IDB_TRANSACTION_TYPE_READ_ONLY);
                var currencyStore = tx.objectStore(_config.CURRENCIES_STORE_NAME);
                return currencyStore.getAll();
            });
        }
    }, {
        key: 'saveConversionRate',
        value: function saveConversionRate(coversionString, conversionRate) {
            var db = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


            return (db ? db : this.open()).then(function (db) {
                var tx = db.transaction(_config.CONVERSION_RATES_STORE_NAME, _config.IDB_TRANSACTION_TYPE_READ_WRITE);
                var conversionStore = tx.objectStore(_config.CONVERSION_RATES_STORE_NAME);

                var conversionDbObject = { dateCreated: new Date(), rate: conversionRate, id: coversionString };
                conversionStore.put(conversionDbObject);

                return tx.complete;
            });
        }
    }, {
        key: 'findConversionRate',
        value: function findConversionRate(coversionString) {
            var db = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


            return (db ? db : this.open()).then(function (db) {
                var tx = db.transaction(_config.CONVERSION_RATES_STORE_NAME, _config.IDB_TRANSACTION_TYPE_READ_ONLY);
                var conversionStore = tx.objectStore(_config.CONVERSION_RATES_STORE_NAME);

                return conversionStore.get(coversionString);
            });
        }
    }]);

    return LocalStorageService;
}();

exports.default = LocalStorageService;

/***/ }),

/***/ "./src/js/config.js":
/*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});


//API
// export const API_URL = 'http://localhost:3000/'
var API_URL = exports.API_URL = 'https://free.currencyconverterapi.com/';
var LIST_CURRENCIES_API_URL = exports.LIST_CURRENCIES_API_URL = API_URL + 'api/v5/currencies';
var CONVERT_CURRENCIES_API_URL = exports.CONVERT_CURRENCIES_API_URL = API_URL + 'api/v5/convert';
var COMPACT_QUEARY_PARAM = exports.COMPACT_QUEARY_PARAM = 'compact=ultra';

//DOM IDS
var FROM_CURRENCY_VALUE_INPUT_ID = exports.FROM_CURRENCY_VALUE_INPUT_ID = 'fromCurrencyValue';
var FROM_CURRENCY_SELECT_ID = exports.FROM_CURRENCY_SELECT_ID = 'fromCurrency';
var CONVERT_BUTTON_ID = exports.CONVERT_BUTTON_ID = 'convert';
var TO_CURRENCY_VALUE_INPUT_ID = exports.TO_CURRENCY_VALUE_INPUT_ID = 'toCurrencyValue';
var TO_CURRENCY_SELECT_ID = exports.TO_CURRENCY_SELECT_ID = 'toCurrency';

//IDB
var DATABASE_NAME = exports.DATABASE_NAME = 'currencyDB';
var CURRENCIES_STORE_NAME = exports.CURRENCIES_STORE_NAME = 'currencies';
var CONVERSION_RATES_STORE_NAME = exports.CONVERSION_RATES_STORE_NAME = 'conversionRate';

var IDB_TRANSACTION_TYPE_READ_ONLY = exports.IDB_TRANSACTION_TYPE_READ_ONLY = 'readonly';
var IDB_TRANSACTION_TYPE_READ_WRITE = exports.IDB_TRANSACTION_TYPE_READ_WRITE = 'readwrite';

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _CurrencyService = __webpack_require__(/*! ./CurrencyService */ "./src/js/CurrencyService.js");

var _CurrencyService2 = _interopRequireDefault(_CurrencyService);

var _config = __webpack_require__(/*! ./config */ "./src/js/config.js");

var _DomHelper = __webpack_require__(/*! ./DomHelper */ "./src/js/DomHelper.js");

var _DomHelper2 = _interopRequireDefault(_DomHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetchingListOfCurrencies() {
    //TODO: show loading screen..
}

function listOfCurrenciesFetched(currencies) {
    var selectOptions = {
        data: currencies.sort(function (c1, c2) {
            return c1.currencyName.trim() > c2.currencyName.trim();
        }),
        valueKey: 'id',
        textKey: 'currencyName',
        clearOptions: true
    };

    _DomHelper2.default.populateSelectInput(_DomHelper2.default.getElementById(_config.FROM_CURRENCY_SELECT_ID), selectOptions);
    _DomHelper2.default.populateSelectInput(_DomHelper2.default.getElementById(_config.TO_CURRENCY_SELECT_ID), selectOptions);
}

function getListOfCurrenciesFailed(error) {
    //TODO: handle this
    console.error('Fetch Currency list failed b/c of error: ' + error);
}

function trackInstalling(serviceWorker) {
    serviceWorker.addEventListener('statechange', function () {
        //just update no need to bother the user now
        if (serviceWorker.state == 'installed') serviceWorker.postMessage({ action: 'skipWaiting' });
    });
}

function registerServiceWorker() {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function (reg) {

            if (navigator.serviceWorker.controller) return;

            if (reg.installing) {
                trackInstalling(reg.installing);
                return;
            }

            reg.addEventListener('updatefound', function () {
                trackInstalling(reg.installing);
            });
        }).catch(function (error) {
            return console.error('Service worker failed with error: ' + error);
        });

        navigator.serviceWorker.addEventListener('controllerchange', function () {
            window.location.reload();
        });
    }
}

//fetch list of currencies
function main() {
    fetchingListOfCurrencies();

    _CurrencyService2.default.getListOfCurrencies().then(function (currencies) {
        return listOfCurrenciesFetched(currencies);
    }).catch(function (error) {
        return getListOfCurrenciesFailed(error);
    });

    _DomHelper2.default.addOnClickEventListener(_DomHelper2.default.getElementById(_config.CONVERT_BUTTON_ID), function () {
        var fromCurrency = _DomHelper2.default.getInputValue(_DomHelper2.default.getElementById(_config.FROM_CURRENCY_SELECT_ID));
        var toCurrency = _DomHelper2.default.getInputValue(_DomHelper2.default.getElementById(_config.TO_CURRENCY_SELECT_ID));
        var currentValue = _DomHelper2.default.getInputValue(_DomHelper2.default.getElementById(_config.FROM_CURRENCY_VALUE_INPUT_ID));

        _CurrencyService2.default.convert(fromCurrency, toCurrency, currentValue).then(function (result) {
            return _DomHelper2.default.setInputValue(_DomHelper2.default.getElementById(_config.TO_CURRENCY_VALUE_INPUT_ID), result);
        }).catch(function (error) {
            console.error(error); /*TODO: handle error*/
        });
    });

    registerServiceWorker();
}

main();

/***/ })

/******/ });
//# sourceMappingURL=main.js.map