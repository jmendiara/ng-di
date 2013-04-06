(function (exports){

  var di;
  if (typeof window !== 'undefined'){
    if (typeof require !== 'undefined'){
      exports = require('./mock');
    }
    else {
      window.mock = exports;
    }
    di = window.di;
  }
  else {
    di = require('./../lib/ng-di');
  }

  var currentSpec = null;

  beforeEach(function() {
    currentSpec = this;
  });

  afterEach(function() {
    currentSpec.$injector = null;
    currentSpec.$modules = null;
    currentSpec = null;
  });

  function isSpecRunning() {
    return currentSpec && currentSpec.queue.running;
  }

  /**
   * @ngdoc function
   * @name angular.mock.module
   * @description
   *
   * *NOTE*: This is function is also published on window for easy access.<br>
   *
   * This function registers a module configuration code. It collects the configuration information
   * which will be used when the injector is created by {@link angular.mock.inject inject}.
   *
   * See {@link angular.mock.inject inject} for usage example
   *
   * @param {...(string|Function)} fns any number of modules which are represented as string
   *        aliases or as anonymous module initialization functions. The modules are used to
   *        configure the injector. The 'ng' and 'ngMock' modules are automatically loaded.
   */
  exports.module = function() {
    var moduleFns = Array.prototype.slice.call(arguments, 0), i, l;
    return isSpecRunning() ? workFn() : workFn;
    /////////////////////
    function workFn() {
      if (currentSpec.$injector) {
        throw Error('Injector already created, can not register a module!');
      } else {
        var modules = currentSpec.$modules || (currentSpec.$modules = []);
        for (i = 0, l = moduleFns.length; i < l; i++){
          modules.push(moduleFns[i]);
        }
      }
    }
  };

  /**
   * @ngdoc function
   * @name angular.mock.inject
   * @description
   *
   * *NOTE*: This is function is also published on window for easy access.<br>
   *
   * The inject function wraps a function into an injectable function. The inject() creates new
   * instance of {@link AUTO.$injector $injector} per test, which is then used for
   * resolving references.
   *
   * See also {@link angular.mock.module module}
   *
   * Example of what a typical jasmine tests looks like with the inject method.
   * <pre>
   *
   *   angular.module('myApplicationModule', [])
   *       .value('mode', 'app')
   *       .value('version', 'v1.0.1');
   *
   *
   *   describe('MyApp', function() {
   *
   *     // You need to load modules that you want to test,
   *     // it loads only the "ng" module by default.
   *     beforeEach(module('myApplicationModule'));
   *
   *
   *     // inject() is used to inject arguments of all given functions
   *     it('should provide a version', inject(function(mode, version) {
   *       expect(version).toEqual('v1.0.1');
   *       expect(mode).toEqual('app');
   *     }));
   *
   *
   *     // The inject and module method can also be used inside of the it or beforeEach
   *     it('should override a version and test the new version is injected', function() {
   *       // module() takes functions or strings (module aliases)
   *       module(function($provide) {
   *         $provide.value('version', 'overridden'); // override version here
   *       });
   *
   *       inject(function(version) {
   *         expect(version).toEqual('overridden');
   *       });
   *     ));
   *   });
   *
   * </pre>
   *
   * @param {...Function} fns any number of functions which will be injected using the injector.
   */
  exports.inject = function() {
    var blockFns = Array.prototype.slice.call(arguments, 0);
    var errorForStack = new Error('Declaration Location');
    return isSpecRunning() ? workFn() : workFn;
    /////////////////////
    function workFn() {
      var modules = currentSpec.$modules || [];

      var injector = currentSpec.$injector;
      if (!injector) {
        injector = currentSpec.$injector = di.injector(modules);
      }
      for(var i = 0, ii = blockFns.length; i < ii; i++) {
        try {
          injector.invoke(blockFns[i] || (function(){}), this);
        } catch (e) {
          if(e.stack){
            e.stack +=  '\n' + errorForStack.stack;
          }
          throw e;
        } finally {
          errorForStack = null;
        }
      }
    }
  };

})(typeof exports === 'undefined'? this: exports);
