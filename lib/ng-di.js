/*
 * ng-di
 * https://github.com/jmendiara/ng-di
 *
 * Copyright (c) 2012 Javier Mendiara
 * Licensed under the MIT license.
 */

  /**
   * Where must be published the library. In Angular is 'angular'
   * @type {String}
   */
  var nameToExport = 'di';

  /**
   * jmendiara
   * From Angular.js
   */

  ////////////////////////////////////

  /**
   * @ngdoc function
   * @name angular.lowercase
   * @function
   *
   * @description Converts the specified string to lowercase.
   * @param {string} string String to be converted to lowercase.
   * @returns {string} Lowercased string.
   */
  var lowercase = function(string){return isString(string) ? string.toLowerCase() : string;};

  function fromCharCode(code) {
    return String.fromCharCode(code);
  }

  function int(str) {
    return parseInt(str, 10);
  }
  /**
   * @ngdoc function
   * @name angular.uppercase
   * @function
   *
   * @description Converts the specified string to uppercase.
   * @param {string} string String to be converted to uppercase.
   * @returns {string} Uppercased string.
   */
  var uppercase = function(string){return isString(string) ? string.toUpperCase() : string;};


  var manualLowercase = function(s) {
    return isString(s) ?
        s.replace(/[A-Z]/g, function(ch) {return fromCharCode(ch.charCodeAt(0) | 32);}) :
        s;
  };
  var manualUppercase = function(s) {
    return isString(s) ?
        s.replace(/[a-z]/g, function(ch) {return fromCharCode(ch.charCodeAt(0) & ~32);}) :
        s;
  };


// String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods
// with correct but slower alternatives.
  if ('i' !== 'I'.toLowerCase()) {
    lowercase = manualLowercase;
    uppercase = manualUppercase;
  }


  var Error             = window.Error,
      slice             = [].slice,
      push              = [].push,
      toString          = Object.prototype.toString,

      /** @name angular */
      di           = window[nameToExport] || (window[nameToExport] = {}),
      angularModule,
      uid               = ['0', '0', '0'];

  /**
   * @ngdoc function
   * @name angular.forEach
   * @function
   *
   * @description
   * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
   * object or an array. The `iterator` function is invoked with `iterator(value, key)`, where `value`
   * is the value of an object property or an array element and `key` is the object property key or
   * array element index. Specifying a `context` for the function is optional.
   *
   * Note: this function was previously known as `angular.foreach`.
   *
   <pre>
   var values = {name: 'misko', gender: 'male'};
   var log = [];
   angular.forEach(values, function(value, key){
       this.push(key + ': ' + value);
     }, log);
   expect(log).toEqual(['name: misko', 'gender:male']);
   </pre>
   *
   * @param {Object|Array} obj Object to iterate over.
   * @param {Function} iterator Iterator function.
   * @param {Object=} context Object to become context (`this`) for the iterator function.
   * @returns {Object|Array} Reference to `obj`.
   */
  function forEach(obj, iterator, context) {
    var key;
    if (obj) {
      if (isFunction(obj)){
        for (key in obj) {
          if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context);
      } else if (isObject(obj) && isNumber(obj.length)) {
        for (key = 0; key < obj.length; key++)
          iterator.call(context, obj[key], key);
      } else {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key);
          }
        }
      }
    }
    return obj;
  }

  function sortedKeys(obj) {
    var keys = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys.sort();
  }

  function forEachSorted(obj, iterator, context) {
    var keys = sortedKeys(obj);
    for ( var i = 0; i < keys.length; i++) {
      iterator.call(context, obj[keys[i]], keys[i]);
    }
    return keys;
  }


  /**
   * when using forEach the params are value, key, but it is often useful to have key, value.
   * @param {function(string, *)} iteratorFn
   * @returns {function(*, string)}
   */
  function reverseParams(iteratorFn) {
    return function(value, key) { iteratorFn(key, value); };
  }

  /**
   * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
   * characters such as '012ABC'. The reason why we are not using simply a number counter is that
   * the number string gets longer over time, and it can also overflow, where as the the nextId
   * will grow much slower, it is a string, and it will never overflow.
   *
   * @returns an unique alpha-numeric string
   */
  function nextUid() {
    var index = uid.length;
    var digit;

    while(index) {
      index--;
      digit = uid[index].charCodeAt(0);
      if (digit == 57 /*'9'*/) {
        uid[index] = 'A';
        return uid.join('');
      }
      if (digit == 90  /*'Z'*/) {
        uid[index] = '0';
      } else {
        uid[index] = String.fromCharCode(digit + 1);
        return uid.join('');
      }
    }
    uid.unshift('0');
    return uid.join('');
  }

  /**
   * @ngdoc function
   * @name angular.extend
   * @function
   *
   * @description
   * Extends the destination object `dst` by copying all of the properties from the `src` object(s)
   * to `dst`. You can specify multiple `src` objects.
   *
   * @param {Object} dst Destination object.
   * @param {...Object} src Source object(s).
   */
  function extend(dst) {
    forEach(arguments, function(obj){
      if (obj !== dst) {
        forEach(obj, function(value, key){
          dst[key] = value;
        });
      }
    });
    return dst;
  }

  function inherit(parent, extra) {
    return extend(new (extend(function() {}, {prototype:parent}))(), extra);
  }


  /**
   * @ngdoc function
   * @name angular.noop
   * @function
   *
   * @description
   * A function that performs no operations. This function can be useful when writing code in the
   * functional style.
   <pre>
   function foo(callback) {
       var result = calculateResult();
       (callback || angular.noop)(result);
     }
   </pre>
   */
  function noop() {}
  noop.$inject = [];


  /**
   * @ngdoc function
   * @name angular.identity
   * @function
   *
   * @description
   * A function that returns its first argument. This function is useful when writing code in the
   * functional style.
   *
   <pre>
   function transformer(transformationFn, value) {
       return (transformationFn || identity)(value);
     };
   </pre>
   */
  function identity($) {return $;}
  identity.$inject = [];


  function valueFn(value) {return function() {return value;};}

  /**
   * @ngdoc function
   * @name angular.isUndefined
   * @function
   *
   * @description
   * Determines if a reference is undefined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is undefined.
   */
  function isUndefined(value){return typeof value == 'undefined';}


  /**
   * @ngdoc function
   * @name angular.isDefined
   * @function
   *
   * @description
   * Determines if a reference is defined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is defined.
   */
  function isDefined(value){return typeof value != 'undefined';}


  /**
   * @ngdoc function
   * @name angular.isObject
   * @function
   *
   * @description
   * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
   * considered to be objects.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Object` but not `null`.
   */
  function isObject(value){return value != null && typeof value == 'object';}


  /**
   * @ngdoc function
   * @name angular.isString
   * @function
   *
   * @description
   * Determines if a reference is a `String`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `String`.
   */
  function isString(value){return typeof value == 'string';}


  /**
   * @ngdoc function
   * @name angular.isNumber
   * @function
   *
   * @description
   * Determines if a reference is a `Number`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Number`.
   */
  function isNumber(value){return typeof value == 'number';}


  /**
   * @ngdoc function
   * @name angular.isDate
   * @function
   *
   * @description
   * Determines if a value is a date.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Date`.
   */
  function isDate(value){
    return toString.apply(value) == '[object Date]';
  }


  /**
   * @ngdoc function
   * @name angular.isArray
   * @function
   *
   * @description
   * Determines if a reference is an `Array`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Array`.
   */
  function isArray(value) {
    return toString.apply(value) == '[object Array]';
  }


  /**
   * @ngdoc function
   * @name angular.isFunction
   * @function
   *
   * @description
   * Determines if a reference is a `Function`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Function`.
   */
  function isFunction(value){return typeof value == 'function';}


  /**
   * Checks if `obj` is a window object.
   *
   * @private
   * @param {*} obj Object to check
   * @returns {boolean} True if `obj` is a window obj.
   */
  function isWindow(obj) {
    return obj && obj.document && obj.location && obj.alert && obj.setInterval;
  }


  function isScope(obj) {
    return obj && obj.$evalAsync && obj.$watch;
  }


  function isFile(obj) {
    return toString.apply(obj) === '[object File]';
  }


  function isBoolean(value) {
    return typeof value == 'boolean';
  }


  function trim(value) {
    return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value;
  }

  /**
   * @ngdoc function
   * @name angular.isElement
   * @function
   *
   * @description
   * Determines if a reference is a DOM element (or wrapped jQuery element).
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a DOM element (or wrapped jQuery element).
   */
  function isElement(node) {
    return node &&
        (node.nodeName || // we are a direct element
            (node.bind && node.find));  // we have a bind and find method part of jQuery API
  }

  /**
   * @param str 'key1,key2,...'
   * @returns {object} in the form of {key1:true, key2:true, ...}
   */
  function makeMap(str){
    var obj = {}, items = str.split(","), i;
    for ( i = 0; i < items.length; i++ )
      obj[ items[i] ] = true;
    return obj;
  }

  function map(obj, iterator, context) {
    var results = [];
    forEach(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  }


  /**
   * @description
   * Determines the number of elements in an array, the number of properties an object has, or
   * the length of a string.
   *
   * Note: This function is used to augment the Object type in Angular expressions. See
   * {@link angular.Object} for more information about Angular arrays.
   *
   * @param {Object|Array|string} obj Object, array, or string to inspect.
   * @param {boolean} [ownPropsOnly=false] Count only "own" properties in an object
   * @returns {number} The size of `obj` or `0` if `obj` is neither an object nor an array.
   */
  function size(obj, ownPropsOnly) {
    var objSize = 0, key;

    if (isArray(obj) || isString(obj)) {
      return obj.length;
    } else if (isObject(obj)){
      for (key in obj)
        if (!ownPropsOnly || obj.hasOwnProperty(key))
          objSize++;
    }

    return objSize;
  }


  function includes(array, obj) {
    return indexOf(array, obj) != -1;
  }

  function indexOf(array, obj) {
    if (array.indexOf) return array.indexOf(obj);

    for ( var i = 0; i < array.length; i++) {
      if (obj === array[i]) return i;
    }
    return -1;
  }

  function arrayRemove(array, value) {
    var index = indexOf(array, value);
    if (index >=0)
      array.splice(index, 1);
    return value;
  }

  function isLeafNode (node) {
    if (node) {
      switch (node.nodeName) {
        case "OPTION":
        case "PRE":
        case "TITLE":
          return true;
      }
    }
    return false;
  }

  /**
   * @ngdoc function
   * @name angular.copy
   * @function
   *
   * @description
   * Creates a deep copy of `source`, which should be an object or an array.
   *
   * * If no destination is supplied, a copy of the object or array is created.
   * * If a destination is provided, all of its elements (for array) or properties (for objects)
   *   are deleted and then all elements/properties from the source are copied to it.
   * * If  `source` is not an object or array, `source` is returned.
   *
   * Note: this function is used to augment the Object type in Angular expressions. See
   * {@link ng.$filter} for more information about Angular arrays.
   *
   * @param {*} source The source that will be used to make a copy.
   *                   Can be any type, including primitives, `null`, and `undefined`.
   * @param {(Object|Array)=} destination Destination into which the source is copied. If
   *     provided, must be of the same type as `source`.
   * @returns {*} The copy or updated `destination`, if `destination` was specified.
   */
  function copy(source, destination){
    if (isWindow(source) || isScope(source)) throw new Error("Can't copy Window or Scope");
    if (!destination) {
      destination = source;
      if (source) {
        if (isArray(source)) {
          destination = copy(source, []);
        } else if (isDate(source)) {
          destination = new Date(source.getTime());
        } else if (isObject(source)) {
          destination = copy(source, {});
        }
      }
    } else {
      if (source === destination) throw new Error("Can't copy equivalent objects or arrays");
      if (isArray(source)) {
        while(destination.length) {
          destination.pop();
        }
        for ( var i = 0; i < source.length; i++) {
          destination.push(copy(source[i]));
        }
      } else {
        forEach(destination, function(value, key){
          delete destination[key];
        });
        for ( var key in source) {
          destination[key] = copy(source[key]);
        }
      }
    }
    return destination;
  }

  /**
   * Create a shallow copy of an object
   */
  function shallowCopy(src, dst) {
    dst = dst || {};

    for(var key in src) {
      if (src.hasOwnProperty(key) && key.substr(0, 2) !== '$$') {
        dst[key] = src[key];
      }
    }

    return dst;
  }


  /**
   * @ngdoc function
   * @name angular.equals
   * @function
   *
   * @description
   * Determines if two objects or two values are equivalent. Supports value types, arrays and
   * objects.
   *
   * Two objects or values are considered equivalent if at least one of the following is true:
   *
   * * Both objects or values pass `===` comparison.
   * * Both objects or values are of the same type and all of their properties pass `===` comparison.
   * * Both values are NaN. (In JavasScript, NaN == NaN => false. But we consider two NaN as equal)
   *
   * During a property comparision, properties of `function` type and properties with names
   * that begin with `$` are ignored.
   *
   * Scope and DOMWindow objects are being compared only be identify (`===`).
   *
   * @param {*} o1 Object or value to compare.
   * @param {*} o2 Object or value to compare.
   * @returns {boolean} True if arguments are equal.
   */
  function equals(o1, o2) {
    if (o1 === o2) return true;
    if (o1 === null || o2 === null) return false;
    if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
    var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
    if (t1 == t2) {
      if (t1 == 'object') {
        if (isArray(o1)) {
          if ((length = o1.length) == o2.length) {
            for(key=0; key<length; key++) {
              if (!equals(o1[key], o2[key])) return false;
            }
            return true;
          }
        } else if (isDate(o1)) {
          return isDate(o2) && o1.getTime() == o2.getTime();
        } else {
          if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2)) return false;
          keySet = {};
          for(key in o1) {
            if (key.charAt(0) !== '$' && !isFunction(o1[key]) && !equals(o1[key], o2[key])) {
              return false;
            }
            keySet[key] = true;
          }
          for(key in o2) {
            if (!keySet[key] && key.charAt(0) !== '$' && !isFunction(o2[key])) return false;
          }
          return true;
        }
      }
    }
    return false;
  }


  function concat(array1, array2, index) {
    return array1.concat(slice.call(array2, index));
  }

  function sliceArgs(args, startIndex) {
    return slice.call(args, startIndex || 0);
  }


  /**
   * @ngdoc function
   * @name angular.bind
   * @function
   *
   * @description
   * Returns a function which calls function `fn` bound to `self` (`self` becomes the `this` for
   * `fn`). You can supply optional `args` that are are prebound to the function. This feature is also
   * known as [function currying](http://en.wikipedia.org/wiki/Currying).
   *
   * @param {Object} self Context which `fn` should be evaluated in.
   * @param {function()} fn Function to be bound.
   * @param {...*} args Optional arguments to be prebound to the `fn` function call.
   * @returns {function()} Function that wraps the `fn` with all the specified bindings.
   */
  function bind(self, fn) {
    var curryArgs = arguments.length > 2 ? sliceArgs(arguments, 2) : [];
    if (isFunction(fn) && !(fn instanceof RegExp)) {
      return curryArgs.length ?
        function() {
          return arguments.length ?
            fn.apply(self, curryArgs.concat(slice.call(arguments, 0))) :
            fn.apply(self, curryArgs);
        } :
        function() {
          return arguments.length ?
            fn.apply(self, arguments) :
            fn.call(self);
        };
    } else {
      // in IE, native methods are not functions so they cannot be bound (note: they don't need to be)
      return fn;
    }
  }


  function toJsonReplacer(key, value) {
    var val = value;

    if (/^\$+/.test(key)) {
      val = undefined;
    } else if (isWindow(value)) {
      val = '$WINDOW';
    } else if (value && window.document && window.document === value) {
      val = '$DOCUMENT';
    } else if (isScope(value)) {
      val = '$SCOPE';
    }

    return val;
  }


  /**
   * @ngdoc function
   * @name angular.toJson
   * @function
   *
   * @description
   * Serializes input into a JSON-formatted string.
   *
   * @param {Object|Array|Date|string|number} obj Input to be serialized into JSON.
   * @param {boolean=} pretty If set to true, the JSON output will contain newlines and whitespace.
   * @returns {string} Jsonified string representing `obj`.
   */
  function toJson(obj, pretty) {
    return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
  }


  /**
   * @ngdoc function
   * @name angular.fromJson
   * @function
   *
   * @description
   * Deserializes a JSON string.
   *
   * @param {string} json JSON string to deserialize.
   * @returns {Object|Array|Date|string|number} Deserialized thingy.
   */
  function fromJson(json) {
    return isString(json) ?
        JSON.parse(json) :
        json;
  }


  function toBoolean(value) {
    if (value && value.length !== 0) {
      var v = lowercase("" + value);
      value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
    } else {
      value = false;
    }
    return value;
  }


/////////////////////////////////////////////////

  /**
   * throw error of the argument is falsy.
   */
  function assertArg(arg, name, reason) {
    if (!arg) {
      throw new Error("Argument '" + (name || '?') + "' is " + (reason || "required"));
    }
    return arg;
  }

  function assertArgFn(arg, name, acceptArrayAnnotation) {
    if (acceptArrayAnnotation && isArray(arg)) {
      arg = arg[arg.length - 1];
    }

    assertArg(isFunction(arg), name, 'not a function, got ' +
        (arg && typeof arg == 'object' ? arg.constructor.name || 'Object' : typeof arg));
    return arg;
  }

   /**
   * jmendiara
   * from loader.js
   */

  /**
   * @ngdoc interface
   * @name angular.Module
   * @description
   *
   * Interface for configuring angular {@link angular.module modules}.
   */

  /**
   *
   * @author jmendiara
   * @param window  Where to put the module
   * @param as name to be attached
   * @return {*}
   */
  function setupModuleLoader(window, as) {

    function ensure(obj, name, factory) {
      return obj[name] || (obj[name] = factory());
    }

    /**
     * jmendiara
     * Modification: replace 'angular' for as
     */
    return ensure(ensure(window, as, Object), 'module', function() {
      /** @type {Object.<string, angular.Module>} */
      var modules = {};

      /**
       * @ngdoc function
       * @name angular.module
       * @description
       *
       * The `angular.module` is a global place for creating and registering Angular modules. All
       * modules (angular core or 3rd party) that should be available to an application must be
       * registered using this mechanism.
       *
       *
       * # Module
       *
       * A module is a collocation of services, directives, filters, and configure information. Module
       * is used to configure the {@link AUTO.$injector $injector}.
       *
       * <pre>
       * // Create a new module
       * var myModule = angular.module('myModule', []);
       *
       * // register a new service
       * myModule.value('appName', 'MyCoolApp');
       *
       * // configure existing services inside initialization blocks.
       * myModule.config(function($locationProvider) {
     *   // Configure existing providers
     *   $locationProvider.hashPrefix('!');
     * });
       * </pre>
       *
       * Then you can create an injector and load your modules like this:
       *
       * <pre>
       * var injector = angular.injector(['ng', 'MyModule'])
       * </pre>
       *
       * However it's more likely that you'll just use
       * {@link ng.directive:ngApp ngApp} or
       * {@link angular.bootstrap} to simplify this process for you.
       *
       * @param {!string} name The name of the module to create or retrieve.
       * @param {Array.<string>=} requires If specified then new module is being created. If unspecified then the
       *        the module is being retrieved for further configuration.
       * @param {Function} configFn Option configuration function for the module. Same as
       *        {@link angular.Module#config Module#config()}.
       * @returns {module} new module with the {@link angular.Module} api.
       */
      return function module(name, requires, configFn) {
        if (requires && modules.hasOwnProperty(name)) {
          modules[name] = null;
        }
        return ensure(modules, name, function() {
          /**
           * @param {string} provider
           * @param {string} method
           * @param {String=} insertMethod
           * @returns {angular.Module}
           */
          function invokeLater(provider, method, insertMethod) {
            return function() {
              invokeQueue[insertMethod || 'push']([provider, method, arguments]);
              return moduleInstance;
            };
          }

          if (!requires) {
            throw new Error('No module: ' + name);
          }

          /** @type {!Array.<Array.<*>>} */
          var invokeQueue = [];

          /** @type {!Array.<Function>} */
          var runBlocks = [];

          var config = invokeLater('$injector', 'invoke');

          /** @type {angular.Module} */
          var moduleInstance = {
            // Private state
            _invokeQueue: invokeQueue,
            _runBlocks: runBlocks,

            /**
             * @ngdoc property
             * @name angular.Module#requires
             * @propertyOf angular.Module
             * @returns {Array.<string>} List of module names which must be loaded before this module.
             * @description
             * Holds the list of modules which the injector will load before the current module is loaded.
             */
            requires: requires,

            /**
             * @ngdoc property
             * @name angular.Module#name
             * @propertyOf angular.Module
             * @returns {string} Name of the module.
             * @description
             */
            name: name,


            /**
             * @ngdoc method
             * @name angular.Module#provider
             * @methodOf angular.Module
             * @param {string} name service name
             * @param {Function} providerType Construction function for creating new instance of the service.
             * @description
             * See {@link AUTO.$provide#provider $provide.provider()}.
             */
            provider: invokeLater('$provide', 'provider'),

            /**
             * @ngdoc method
             * @name angular.Module#factory
             * @methodOf angular.Module
             * @param {string} name service name
             * @param {Function} providerFunction Function for creating new instance of the service.
             * @description
             * See {@link AUTO.$provide#factory $provide.factory()}.
             */
            factory: invokeLater('$provide', 'factory'),

            /**
             * @ngdoc method
             * @name angular.Module#service
             * @methodOf angular.Module
             * @param {string} name service name
             * @param {Function} constructor A constructor function that will be instantiated.
             * @description
             * See {@link AUTO.$provide#service $provide.service()}.
             */
            service: invokeLater('$provide', 'service'),

            /**
             * @ngdoc method
             * @name angular.Module#value
             * @methodOf angular.Module
             * @param {string} name service name
             * @param {*} object Service instance object.
             * @description
             * See {@link AUTO.$provide#value $provide.value()}.
             */
            value: invokeLater('$provide', 'value'),

            /**
             * @ngdoc method
             * @name angular.Module#constant
             * @methodOf angular.Module
             * @param {string} name constant name
             * @param {*} object Constant value.
             * @description
             * Because the constant are fixed, they get applied before other provide methods.
             * See {@link AUTO.$provide#constant $provide.constant()}.
             */
            constant: invokeLater('$provide', 'constant', 'unshift'),

            /**
             * @ngdoc method
             * @name angular.Module#filter
             * @methodOf angular.Module
             * @param {string} name Filter name.
             * @param {Function} filterFactory Factory function for creating new instance of filter.
             * @description
             * See {@link ng.$filterProvider#register $filterProvider.register()}.
             */
            filter: invokeLater('$filterProvider', 'register'),

            /**
             * @ngdoc method
             * @name angular.Module#controller
             * @methodOf angular.Module
             * @param {string} name Controller name.
             * @param {Function} constructor Controller constructor function.
             * @description
             * See {@link ng.$controllerProvider#register $controllerProvider.register()}.
             */
            controller: invokeLater('$controllerProvider', 'register'),

            /**
             * @ngdoc method
             * @name angular.Module#directive
             * @methodOf angular.Module
             * @param {string} name directive name
             * @param {Function} directiveFactory Factory function for creating new instance of
             * directives.
             * @description
             * See {@link ng.$compileProvider#directive $compileProvider.directive()}.
             */
            directive: invokeLater('$compileProvider', 'directive'),

            /**
             * @ngdoc method
             * @name angular.Module#config
             * @methodOf angular.Module
             * @param {Function} configFn Execute this function on module load. Useful for service
             *    configuration.
             * @description
             * Use this method to register work which needs to be performed on module loading.
             */
            config: config,

            /**
             * @ngdoc method
             * @name angular.Module#run
             * @methodOf angular.Module
             * @param {Function} initializationFn Execute this function after injector creation.
             *    Useful for application initialization.
             * @description
             * Use this method to register work which needs to be performed when the injector with
             * with the current module is finished loading.
             */
            run: function(block) {
              runBlocks.push(block);
              return this;
            }
          };

          if (configFn) {
            config(configFn);
          }

          return  moduleInstance;

        });
      };
    });


    /**
     * jmendiara
     * from AngularPublic.js
     */

    /**
     * @ngdoc property
     * @name angular.version
     * @description
     * An object that contains information about the current AngularJS version. This object has the
     * following properties:
     *
     * - `full` – `{string}` – Full version string, such as "0.9.18".
     * - `major` – `{number}` – Major version number, such as "0".
     * - `minor` – `{number}` – Minor version number, such as "9".
     * - `dot` – `{number}` – Dot version number, such as "18".
     * - `codeName` – `{string}` – Code name of the release, such as "jiggling-armfat".
     */
  }
  var version = {
    full: '1.0.2',
    major: 1,
    minor: 0,
    dot: 2,
    codeName: 'debilitating-awesomeness'
  };


  function publishExternalAPI(angular){
    var $utils = extend(angular, {
      'copy': copy,
      'extend': extend,
      'equals': equals,
      'forEach': forEach,
      'injector': createInjector,
      'noop':noop,
      'bind':bind,
      'toJson': toJson,
      'fromJson': fromJson,
      'identity':identity,
      'isUndefined': isUndefined,
      'isDefined': isDefined,
      'isString': isString,
      'isFunction': isFunction,
      'isObject': isObject,
      'isNumber': isNumber,
      'isElement': isElement,
      'isArray': isArray,
      'version': version,
      'isDate': isDate,
      'lowercase': lowercase,
      'uppercase': uppercase,
      'callbacks': {counter: 0}
    });

    angularModule = setupModuleLoader(window, nameToExport);

    angularModule(nameToExport, [], ['$provide',
      function diModule($provide) {
        $provide.constant('$utils', $utils);
      }
    ]);
  }


  /**
   * jmendiara
   * From apis.js
   */


  /**
   * Computes a hash of an 'obj'.
   * Hash of a:
   *  string is string
   *  number is number as string
   *  object is either result of calling $$hashKey function on the object or uniquely generated id,
   *         that is also assigned to the $$hashKey property of the object.
   *
   * @param obj
   * @returns {string} hash string such that the same input will have the same hash string.
   *         The resulting string key is in 'type:hashKey' format.
   */
  function hashKey(obj) {
    var objType = typeof obj,
        key;

    if (objType == 'object' && obj !== null) {
      if (typeof (key = obj.$$hashKey) == 'function') {
        // must invoke on object to keep the right this
        key = obj.$$hashKey();
      } else if (key === undefined) {
        key = obj.$$hashKey = nextUid();
      }
    } else {
      key = obj;
    }

    return objType + ':' + key;
  }

  /**
   * HashMap which can use objects as keys
   */
  function HashMap(array){
    forEach(array, this.put, this);
  }
  HashMap.prototype = {
    /**
     * Store key value pair
     * @param key key to store can be any type
     * @param value value to store can be any type
     */
    put: function(key, value) {
      this[hashKey(key)] = value;
    },

    /**
     * @param key
     * @returns the value for the key
     */
    get: function(key) {
      return this[hashKey(key)];
    },

    /**
     * Remove the key/value pair
     * @param key
     */
    remove: function(key) {
      var value = this[key = hashKey(key)];
      delete this[key];
      return value;
    }
  };

  /**
   * A map where multiple values can be added to the same key such that they form a queue.
   * @returns {HashQueueMap}
   */
  function HashQueueMap() {}
  HashQueueMap.prototype = {
    /**
     * Same as array push, but using an array as the value for the hash
     */
    push: function(key, value) {
      var array = this[key = hashKey(key)];
      if (!array) {
        this[key] = [value];
      } else {
        array.push(value);
      }
    },

    /**
     * Same as array shift, but using an array as the value for the hash
     */
    shift: function(key) {
      var array = this[key = hashKey(key)];
      if (array) {
        if (array.length == 1) {
          delete this[key];
          return array[0];
        } else {
          return array.shift();
        }
      }
    },

    /**
     * return the first item without deleting it
     */
    peek: function(key) {
      var array = this[key = hashKey(key)];
      if (array) {
        return array[0];
      }
    }
  };


  /**
   * jmendiara
   * from injector.js
   */


  /**
   * @ngdoc function
   * @name angular.injector
   * @function
   *
   * @description
   * Creates an injector function that can be used for retrieving services as well as for
   * dependency injection (see {@link guide/di dependency injection}).
   *

   * @param {Array.<string|Function>} modules A list of module functions or their aliases. See
   *        {@link angular.module}. The `ng` module must be explicitly added.
   * @returns {function()} Injector function. See {@link AUTO.$injector $injector}.
   *
   * @example
   * Typical usage
   * <pre>
   *   // create an injector
   *   var $injector = angular.injector(['ng']);
   *
   *   // use the injector to kick of your application
   *   // use the type inference to auto inject arguments, or use implicit injection
   *   $injector.invoke(function($rootScope, $compile, $document){
*     $compile($document)($rootScope);
*     $rootScope.$digest();
*   });
   * </pre>
   */


  /**
   * @ngdoc overview
   * @name AUTO
   * @description
   *
   * Implicit module which gets automatically added to each {@link AUTO.$injector $injector}.
   */

  var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  var FN_ARG_SPLIT = /,/;
  var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  function annotate(fn) {
    var $inject,
        fnText,
        argDecl,
        last;

    if (typeof fn == 'function') {
      if (!($inject = fn.$inject)) {
        $inject = [];
        fnText = fn.toString().replace(STRIP_COMMENTS, '');
        argDecl = fnText.match(FN_ARGS);
        forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){
          arg.replace(FN_ARG, function(all, underscore, name){
            $inject.push(name);
          });
        });
        fn.$inject = $inject;
      }
    } else if (isArray(fn)) {
      last = fn.length - 1;
      assertArgFn(fn[last], 'fn');
      $inject = fn.slice(0, last);
    } else {
      assertArgFn(fn, 'fn', true);
    }
    return $inject;
  }

///////////////////////////////////////

  /**
   * @ngdoc object
   * @name AUTO.$injector
   * @function
   *
   * @description
   *
   * `$injector` is used to retrieve object instances as defined by
   * {@link AUTO.$provide provider}, instantiate types, invoke methods,
   * and load modules.
   *
   * The following always holds true:
   *
   * <pre>
   *   var $injector = angular.injector();
   *   expect($injector.get('$injector')).toBe($injector);
   *   expect($injector.invoke(function($injector){
*     return $injector;
*   }).toBe($injector);
   * </pre>
   *
   * # Injection Function Annotation
   *
   * JavaScript does not have annotations, and annotations are needed for dependency injection. The
   * following ways are all valid way of annotating function with injection arguments and are equivalent.
   *
   * <pre>
   *   // inferred (only works if code not minified/obfuscated)
   *   $inject.invoke(function(serviceA){});
   *
   *   // annotated
   *   function explicit(serviceA) {};
   *   explicit.$inject = ['serviceA'];
   *   $inject.invoke(explicit);
   *
   *   // inline
   *   $inject.invoke(['serviceA', function(serviceA){}]);
   * </pre>
   *
   * ## Inference
   *
   * In JavaScript calling `toString()` on a function returns the function definition. The definition can then be
   * parsed and the function arguments can be extracted. *NOTE:* This does not work with minification, and obfuscation
   * tools since these tools change the argument names.
   *
   * ## `$inject` Annotation
   * By adding a `$inject` property onto a function the injection parameters can be specified.
   *
   * ## Inline
   * As an array of injection names, where the last item in the array is the function to call.
   */

  /**
   * @ngdoc method
   * @name AUTO.$injector#get
   * @methodOf AUTO.$injector
   *
   * @description
   * Return an instance of the service.
   *
   * @param {string} name The name of the instance to retrieve.
   * @return {*} The instance.
   */

  /**
   * @ngdoc method
   * @name AUTO.$injector#invoke
   * @methodOf AUTO.$injector
   *
   * @description
   * Invoke the method and supply the method arguments from the `$injector`.
   *
   * @param {!function} fn The function to invoke. The function arguments come form the function annotation.
   * @param {Object=} self The `this` for the invoked method.
   * @param {Object=} locals Optional object. If preset then any argument names are read from this object first, before
   *   the `$injector` is consulted.
   * @returns {*} the value returned by the invoked `fn` function.
   */

  /**
   * @ngdoc method
   * @name AUTO.$injector#instantiate
   * @methodOf AUTO.$injector
   * @description
   * Create a new instance of JS type. The method takes a constructor function invokes the new operator and supplies
   * all of the arguments to the constructor function as specified by the constructor annotation.
   *
   * @param {function} Type Annotated constructor function.
   * @param {Object=} locals Optional object. If preset then any argument names are read from this object first, before
   *   the `$injector` is consulted.
   * @returns {Object} new instance of `Type`.
   */

  /**
   * @ngdoc method
   * @name AUTO.$injector#annotate
   * @methodOf AUTO.$injector
   *
   * @description
   * Returns an array of service names which the function is requesting for injection. This API is used by the injector
   * to determine which services need to be injected into the function when the function is invoked. There are three
   * ways in which the function can be annotated with the needed dependencies.
   *
   * # Argument names
   *
   * The simplest form is to extract the dependencies from the arguments of the function. This is done by converting
   * the function into a string using `toString()` method and extracting the argument names.
   * <pre>
   *   // Given
   *   function MyController($scope, $route) {
*     // ...
*   }
   *
   *   // Then
   *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
   * </pre>
   *
   * This method does not work with code minfication / obfuscation. For this reason the following annotation strategies
   * are supported.
   *
   * # The `$injector` property
   *
   * If a function has an `$inject` property and its value is an array of strings, then the strings represent names of
   * services to be injected into the function.
   * <pre>
   *   // Given
   *   var MyController = function(obfuscatedScope, obfuscatedRoute) {
*     // ...
*   }
   *   // Define function dependencies
   *   MyController.$inject = ['$scope', '$route'];
   *
   *   // Then
   *   expect(injector.annotate(MyController)).toEqual(['$scope', '$route']);
   * </pre>
   *
   * # The array notation
   *
   * It is often desirable to inline Injected functions and that's when setting the `$inject` property is very
   * inconvenient. In these situations using the array notation to specify the dependencies in a way that survives
   * minification is a better choice:
   *
   * <pre>
   *   // We wish to write this (not minification / obfuscation safe)
   *   injector.invoke(function($compile, $rootScope) {
*     // ...
*   });
   *
   *   // We are forced to write break inlining
   *   var tmpFn = function(obfuscatedCompile, obfuscatedRootScope) {
*     // ...
*   };
   *   tmpFn.$inject = ['$compile', '$rootScope'];
   *   injector.invoke(tempFn);
   *
   *   // To better support inline function the inline annotation is supported
   *   injector.invoke(['$compile', '$rootScope', function(obfCompile, obfRootScope) {
*     // ...
*   }]);
   *
   *   // Therefore
   *   expect(injector.annotate(
   *      ['$compile', '$rootScope', function(obfus_$compile, obfus_$rootScope) {}])
   *    ).toEqual(['$compile', '$rootScope']);
   * </pre>
   *
   * @param {function|Array.<string|Function>} fn Function for which dependent service names need to be retrieved as described
   *   above.
   *
   * @returns {Array.<string>} The names of the services which the function requires.
   */




  /**
   * @ngdoc object
   * @name AUTO.$provide
   *
   * @description
   *
   * Use `$provide` to register new providers with the `$injector`. The providers are the factories for the instance.
   * The providers share the same name as the instance they create with the `Provider` suffixed to them.
   *
   * A provider is an object with a `$get()` method. The injector calls the `$get` method to create a new instance of
   * a service. The Provider can have additional methods which would allow for configuration of the provider.
   *
   * <pre>
   *   function GreetProvider() {
*     var salutation = 'Hello';
*
*     this.salutation = function(text) {
*       salutation = text;
*     };
*
*     this.$get = function() {
*       return function (name) {
*         return salutation + ' ' + name + '!';
*       };
*     };
*   }
   *
   *   describe('Greeter', function(){
*
*     beforeEach(module(function($provide) {
*       $provide.provider('greet', GreetProvider);
*     });
*
*     it('should greet', inject(function(greet) {
*       expect(greet('angular')).toEqual('Hello angular!');
*     }));
*
*     it('should allow configuration of salutation', function() {
*       module(function(greetProvider) {
*         greetProvider.salutation('Ahoj');
*       });
*       inject(function(greet) {
*         expect(greet('angular')).toEqual('Ahoj angular!');
*       });
*     )};
*
*   });
   * </pre>
   */

  /**
   * @ngdoc method
   * @name AUTO.$provide#provider
   * @methodOf AUTO.$provide
   * @description
   *
   * Register a provider for a service. The providers can be retrieved and can have additional configuration methods.
   *
   * @param {string} name The name of the instance. NOTE: the provider will be available under `name + 'Provider'` key.
   * @param {(Object|function())} provider If the provider is:
   *
   *   - `Object`: then it should have a `$get` method. The `$get` method will be invoked using
   *               {@link AUTO.$injector#invoke $injector.invoke()} when an instance needs to be created.
   *   - `Constructor`: a new instance of the provider will be created using
   *               {@link AUTO.$injector#instantiate $injector.instantiate()}, then treated as `object`.
   *
   * @returns {Object} registered provider instance
   */

  /**
   * @ngdoc method
   * @name AUTO.$provide#factory
   * @methodOf AUTO.$provide
   * @description
   *
   * A short hand for configuring services if only `$get` method is required.
   *
   * @param {string} name The name of the instance.
   * @param {function()} $getFn The $getFn for the instance creation. Internally this is a short hand for
   * `$provide.provider(name, {$get: $getFn})`.
   * @returns {Object} registered provider instance
   */


  /**
   * @ngdoc method
   * @name AUTO.$provide#service
   * @methodOf AUTO.$provide
   * @description
   *
   * A short hand for registering service of given class.
   *
   * @param {string} name The name of the instance.
   * @param {Function} constructor A class (constructor function) that will be instantiated.
   * @returns {Object} registered provider instance
   */


  /**
   * @ngdoc method
   * @name AUTO.$provide#value
   * @methodOf AUTO.$provide
   * @description
   *
   * A short hand for configuring services if the `$get` method is a constant.
   *
   * @param {string} name The name of the instance.
   * @param {*} value The value.
   * @returns {Object} registered provider instance
   */


  /**
   * @ngdoc method
   * @name AUTO.$provide#constant
   * @methodOf AUTO.$provide
   * @description
   *
   * A constant value, but unlike {@link AUTO.$provide#value value} it can be injected
   * into configuration function (other modules) and it is not interceptable by
   * {@link AUTO.$provide#decorator decorator}.
   *
   * @param {string} name The name of the constant.
   * @param {*} value The constant value.
   * @returns {Object} registered instance
   */


  /**
   * @ngdoc method
   * @name AUTO.$provide#decorator
   * @methodOf AUTO.$provide
   * @description
   *
   * Decoration of service, allows the decorator to intercept the service instance creation. The
   * returned instance may be the original instance, or a new instance which delegates to the
   * original instance.
   *
   * @param {string} name The name of the service to decorate.
   * @param {function()} decorator This function will be invoked when the service needs to be
   *    instanciated. The function is called using the {@link AUTO.$injector#invoke
   *    injector.invoke} method and is therefore fully injectable. Local injection arguments:
   *
   *    * `$delegate` - The original service instance, which can be monkey patched, configured,
   *      decorated or delegated to.
   */


  function createInjector(modulesToLoad) {


    ////////////////////////////////////
    // $provider
    ////////////////////////////////////

    function supportObject(delegate) {
      return function(key, value) {
        if (isObject(key)) {
          forEach(key, reverseParams(delegate));
        } else {
          return delegate(key, value);
        }
      };
    }

    function provider(name, provider_) {
      if (isFunction(provider_)) {
        provider_ = providerInjector.instantiate(provider_);
      }
      if (!provider_.$get) {
        throw new Error('Provider ' + name + ' must define $get factory method.');
      }
      return providerCache[name + providerSuffix] = provider_;
    }

    function factory(name, factoryFn) { return provider(name, { $get: factoryFn }); }

    function service(name, constructor) {
      return factory(name, ['$injector', function($injector) {
        return $injector.instantiate(constructor);
      }]);
    }

    function value(name, theValue) {
      return factory(name, valueFn(theValue));
    }

    function constant(name, value) {
      providerCache[name] = value;
      instanceCache[name] = value;
    }

    function decorator(serviceName, decorFn) {
      var origProvider = providerInjector.get(serviceName + providerSuffix),
          orig$get = origProvider.$get;

      origProvider.$get = function() {
        var origInstance = instanceInjector.invoke(orig$get, origProvider);
        return instanceInjector.invoke(decorFn, null, {$delegate: origInstance});
      };
    }

    ////////////////////////////////////
    // Module Loading
    ////////////////////////////////////
    function loadModules(modulesToLoad){
      var runBlocks = [];
      forEach(modulesToLoad, function(module) {
        if (loadedModules.get(module)) return;
        loadedModules.put(module, true);
        if (isString(module)) {
          var moduleFn = angularModule(module);
          runBlocks = runBlocks.concat(loadModules(moduleFn.requires)).concat(moduleFn._runBlocks);

          try {
            for(var invokeQueue = moduleFn._invokeQueue, i = 0, ii = invokeQueue.length; i < ii; i++) {
              var invokeArgs = invokeQueue[i],
                  provider = providerInjector.get(invokeArgs[0]);

              provider[invokeArgs[1]].apply(provider, invokeArgs[2]);
            }
          } catch (e) {
            if (e.message) e.message += ' from ' + module;
            throw e;
          }
        } else if (isFunction(module)) {
          try {
            runBlocks.push(providerInjector.invoke(module));
          } catch (e) {
            if (e.message) e.message += ' from ' + module;
            throw e;
          }
        } else if (isArray(module)) {
          try {
            runBlocks.push(providerInjector.invoke(module));
          } catch (e) {
            if (e.message) e.message += ' from ' + String(module[module.length - 1]);
            throw e;
          }
        } else {
          assertArgFn(module, 'module');
        }
      });
      return runBlocks;
    }

    ////////////////////////////////////
    // internal Injector
    ////////////////////////////////////

    function createInternalInjector(cache, factory) {

      function getService(serviceName) {
        if (typeof serviceName !== 'string') {
          throw new Error('Service name expected');
        }
        if (cache.hasOwnProperty(serviceName)) {
          if (cache[serviceName] === INSTANTIATING) {
            throw new Error('Circular dependency: ' + path.join(' <- '));
          }
          return cache[serviceName];
        } else {
          try {
            path.unshift(serviceName);
            cache[serviceName] = INSTANTIATING;
            return cache[serviceName] = factory(serviceName);
          } finally {
            path.shift();
          }
        }
      }

      function invoke(fn, self, locals){
        var args = [],
            $inject = annotate(fn),
            length, i,
            key;

        for(i = 0, length = $inject.length; i < length; i++) {
          key = $inject[i];
          args.push(
              locals && locals.hasOwnProperty(key) ?
                  locals[key] :
                  getService(key, path)
          );
        }
        if (!fn.$inject) {
          // this means that we must be an array.
          fn = fn[length];
        }


        // Performance optimization: http://jsperf.com/apply-vs-call-vs-invoke
        switch (self ? -1 : args.length) {
          case  0: return fn();
          case  1: return fn(args[0]);
          case  2: return fn(args[0], args[1]);
          case  3: return fn(args[0], args[1], args[2]);
          case  4: return fn(args[0], args[1], args[2], args[3]);
          case  5: return fn(args[0], args[1], args[2], args[3], args[4]);
          case  6: return fn(args[0], args[1], args[2], args[3], args[4], args[5]);
          case  7: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
          case  8: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
          case  9: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
          case 10: return fn(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
          default: return fn.apply(self, args);
        }
      }

      function instantiate(Type, locals) {
        var Constructor = function() {},
            instance, returnedValue;

        Constructor.prototype = (isArray(Type) ? Type[Type.length - 1] : Type).prototype;
        instance = new Constructor();
        returnedValue = invoke(Type, instance, locals);

        return isObject(returnedValue) ? returnedValue : instance;
      }

      return {
        invoke: invoke,
        instantiate: instantiate,
        get: getService,
        annotate: annotate
      };
    }

    var INSTANTIATING = {},
        providerSuffix = 'Provider',
        path = [],
        loadedModules = new HashMap(),
        providerCache = {
          $provide: {
            provider: supportObject(provider),
            factory: supportObject(factory),
            service: supportObject(service),
            value: supportObject(value),
            constant: supportObject(constant),
            decorator: decorator
          }
        },
        providerInjector = (providerCache.$injector =
          createInternalInjector(providerCache, function() {
            throw new Error("Unknown provider: " + path.join(' <- '));
          })
        ),
        instanceCache = {},
        instanceInjector = (instanceCache.$injector =
          createInternalInjector(instanceCache, function(servicename) {
            var provider = providerInjector.get(servicename + providerSuffix);
            return instanceInjector.invoke(provider.$get, provider);
          }
        ));


    forEach(loadModules(modulesToLoad), function(fn) { instanceInjector.invoke(fn || noop); });

    return instanceInjector;

  }


  /**
   * jmendiara
   * from publishExternalApis.js
   */
  publishExternalAPI(window[nameToExport]);

