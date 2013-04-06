'use strict';
var utils = require('../lib/utils');

describe('utils', function() {

  describe('forEach', function(){
    var forEach = utils.forEach;

    it('should iterate over *own* object properties', function() {
      function MyObj() {
        this.bar = 'barVal';
        this.baz = 'bazVal';
      }
      MyObj.prototype.foo = 'fooVal';

      var obj = new MyObj(),
        log = [];

      forEach(obj, function(value, key) {
        log.push(key + ':' + value)}
      );

      expect(log).toEqual(['bar:barVal', 'baz:bazVal']);
    });

    it('should handle arguments objects like arrays', function() {
      var args,
        log = [];

      (function(){ args = arguments}('a', 'b', 'c'));

      forEach(args, function(value, key) {
        log.push(key + ':' + value)}
      );
      expect(log).toEqual(['0:a', '1:b', '2:c']);
    });

    it('should handle objects with length property as objects', function() {
      var obj = {
          'foo' : 'bar',
          'length': 2
        },
        log = [];

      forEach(obj, function(value, key) {
        log.push(key + ':' + value)}
      );
      expect(log).toEqual(['foo:bar', 'length:2']);
    });

    it('should handle objects of custom types with length property as objects', function() {
      function CustomType() {
        this.length = 2;
        this.foo = 'bar'
      }

      var obj = new CustomType(),
        log = [];

      forEach(obj, function(value, key) {
        log.push(key + ':' + value)}
      );
      expect(log).toEqual(['length:2', 'foo:bar']);
    });
  });


  describe('nextUid', function() {
    var nextUid = utils.nextUid;

    it('should return new id per call', function() {
      var seen = {};
      var count = 100;

      while(count--) {
        var current = nextUid();
        expect(current.match(/[\d\w]+/)).toBeTruthy();
        expect(seen[current]).toBeFalsy();
        seen[current] = true;
      }
    });
  });


  describe('reverseParams', function() {
    var reverseParams = utils.reverseParams;

    it('should reverse parameters', function() {
      var key = 'key', value = 'value';
      var iterator = function iterator(key, value){
        expect(key).toBe('key');
        expect(value).toBe('value');
      };
      reverseParams(iterator)(value, key);
    })
  });

  describe('valueFn', function() {
    var valueFn = utils.valueFn;

    it('should return the value', function() {
      var obj = {};
      expect(valueFn(obj)()).toBe(obj);
    });
  });

  describe('isString', function() {
    var isString = utils.isString;

    it('should detect strings', function() {
      expect(isString('')).toBeTruthy();

      expect(isString()).toBeFalsy();
      expect(isString(null)).toBeFalsy();
      expect(isString(function(){})).toBeFalsy();
      expect(isString({})).toBeFalsy();
      expect(isString([])).toBeFalsy();
      expect(isString(1)).toBeFalsy();
      expect(isString(false)).toBeFalsy();

    });
  });

  describe('isArray', function() {
    var isArray = utils.isArray;

    it('should detect strings', function() {
      expect(isArray([])).toBeTruthy();

      expect(isArray()).toBeFalsy();
      expect(isArray(null)).toBeFalsy();
      expect(isArray(function(){})).toBeFalsy();
      expect(isArray({})).toBeFalsy();
      expect(isArray(1)).toBeFalsy();
      expect(isArray('')).toBeFalsy();
      expect(isArray(false)).toBeFalsy();

    });
  });

  describe('isFunction', function() {
    var isFunction = utils.isFunction;

    it('should detect functions', function() {
      expect(isFunction(function(){})).toBeTruthy();

      expect(isFunction()).toBeFalsy();
      expect(isFunction(null)).toBeFalsy();
      expect(isFunction([])).toBeFalsy();
      expect(isFunction({})).toBeFalsy();
      expect(isFunction(1)).toBeFalsy();
      expect(isFunction('')).toBeFalsy();
      expect(isFunction(false)).toBeFalsy();

    });
  });

  describe('isObject', function() {
    var isObject = utils.isObject;

    it('should detect an object', function() {
      var obj = {},
        obj2 = new Object(),
        clazz = function(){};

      expect(isObject(obj)).toBeTruthy();
      expect(isObject(obj2)).toBeTruthy();
      expect(isObject(new clazz())).toBeTruthy();

      expect(isObject(null)).toBeFalsy();
      expect(isObject(1)).toBeFalsy();
      expect(isObject('')).toBeFalsy();
      expect(isObject(false)).toBeFalsy();
    });
  });


});