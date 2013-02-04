
/**
 * @license AngularJS v1.0.2
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 *
 */

/**
 * @ngdoc overview
 * @name angular.mock
 * @description
 *
 * Namespace from 'angular-mocks.js' which contains testing related code.
 */

void function(window){
  var window = window || {}
  var jasmine = window.jasmine
  var angular = window.angular || require('./ng-di')
  if (!jasmine || !angular) {
    throw Error('Jasmine and Amgular should be available globally'
      + ' when you init these mocks.')
  }

  angular.mock = {};
  window.afterEach(function() {
    var spec = getCurrentSpec();
    var injector = spec.$injector;

    spec.$injector = null;
    spec.$modules = null;

    angular.forEach(angular.callbacks, function(val, key) {
      delete angular.callbacks[key];
    });
    angular.callbacks.counter = 0;
  });

  function getCurrentSpec() {
    return jasmine.getEnv().currentSpec;
  }

  function isSpecRunning() {
    var spec = getCurrentSpec();
    return spec && spec.queue.running;
  }

  /**
   * @ngdoc function
   * @name angular.mock.module
   * @description
   *
   * *NOTE*: This is function is also published on window for easy access.<br>
   * *NOTE*: Only available with {@link http://pivotal.github.com/jasmine/ jasmine}.
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
  window.module = angular.mock.module = function() {
    /////////////////////
    function workFn() {
      var spec = getCurrentSpec();
      if (spec.$injector) {
        throw new Error('Injector already created, can not register a module!');
      } else {
        var modules = spec.$modules || (spec.$modules = []);
        angular.forEach(moduleFns, function(module) {
          modules.push(module);
        });
      }
    }
    var moduleFns = Array.prototype.slice.call(arguments, 0);
    return isSpecRunning() ? workFn() : workFn;

  };

  /**
   * @ngdoc function
   * @name angular.mock.inject
   * @description
   *
   * *NOTE*: This is function is also published on window for easy access.<br>
   * *NOTE*: Only available with {@link http://pivotal.github.com/jasmine/ jasmine}.
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
  window.inject = angular.mock.inject = function() {
    var blockFns = Array.prototype.slice.call(arguments, 0);
    var errorForStack = new Error('Declaration Location');

    /////////////////////
    function workFn() {
      var spec = getCurrentSpec();
      var modules = spec.$modules || [];
      var injector = spec.$injector;
      if (!injector) {
        injector = spec.$injector = angular.injector(modules);
      }

      for(var i = 0, ii = blockFns.length; i < ii; i++) {
        try {
          injector.invoke(blockFns[i] || angular.noop, this);
        } catch (e) {
          if(e.stack) e.stack +=  '\n' + errorForStack.stack;
          throw e;
        } finally {
          errorForStack = null;
        }
      }
    }
    return isSpecRunning() ? workFn() : workFn;
  };
}(typeof global == 'object' ? global : this);
