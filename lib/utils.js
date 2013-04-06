(function (exports) {
  'use strict';

  var uid = ['0', '0', '0'];


  ////////////////////////////////////

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


  /**
   * @private
   * @param {*} obj
   * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments, ...)
   */
  function isArrayLike(obj) {
    if (!obj || (typeof obj.length !== 'number')) return false;

    // We have on object which has length property. Should we treat it as array?
    if (typeof obj.hasOwnProperty != 'function' &&
      typeof obj.constructor != 'function') {
      // This is here for IE8: it is a bogus object treat it as array;
      return true;
    } else {
      return Object.prototype.toString.call(obj) !== '[object Object]' ||   // some browser native object
        typeof obj.callee === 'function';              // arguments (on IE8 looks like regular obj)
    }
  }


  function forEach(obj, iterator, context) {
    var key;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context);
      } else if (isArrayLike(obj)) {
        for (key = 0; key < obj.length; key++){
          iterator.call(context, obj[key], key);
        }
      } else {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key);
          }
        }
      }
    }
    return obj;
  };

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


  /**
   * when using forEach the params are value, key, but it is often useful to have key, value.
   * @param {function(string, *)} iteratorFn
   * @returns {function(*, string)}
   */
  function reverseParams(iteratorFn) {
    return function(value, key) {
      iteratorFn(key, value)
    };
  }


  /**
   * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
   * characters such as '012ABC'. The reason why we are not using simply a number counter is that
   * the number string gets longer over time, and it can also overflow, where as the nextId
   * will grow much slower, it is a string, and it will never overflow.
   *
   * @returns an unique alpha-numeric string
   */
  function nextUid() {
    var index = uid.length;
    var digit;

    while (index) {
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
  };

  function valueFn(value) {
    return function () {
      return value;
    };
  };

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
  function isObject(value) {
    return value != null && typeof value == 'object';
  };


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
  function isString(value) {
    return typeof value == 'string';
  };


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
    return Object.prototype.toString.apply(value) == '[object Array]';
  };


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
  function isFunction(value) {
    return typeof value == 'function';
  };



  /**
   * throw error of the argument is falsy.
   */
  function assertArg(arg, name, reason) {
    if (!arg) {
      throw new Error("Argument '" + (name || '?') + "' is " + (reason || "required"));
    }
    return arg;
  };

  function assertArgFn(arg, name, acceptArrayAnnotation) {
    if (acceptArrayAnnotation && isArray(arg)) {
      arg = arg[arg.length - 1];
    }

    assertArg(isFunction(arg), name, 'not a function, got ' +
      (arg && typeof arg == 'object' ? arg.constructor.name || 'Object' : typeof arg));
    return arg;
  };

  exports.forEach = forEach;
  exports.reverseParams = reverseParams;
  exports.extend = extend;
  exports.nextUid = nextUid;
  exports.assertArgFn = assertArgFn;
  exports.valueFn = valueFn;
  exports.isString = isString;
  exports.isArray = isArray;
  exports.isFunction = isFunction;
  exports.isObject = isObject;

})(typeof exports === 'undefined' ? require('./utils') : exports);
