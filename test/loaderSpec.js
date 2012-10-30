'use strict';

describe('module loader', function() {
  var window;

  beforeEach(function () {
    window = {};
    setupModuleLoader(window, 'di');
  });


  it('should set up namespace', function() {
    expect(window.di).toBeDefined();
    expect(window.di.module).toBeDefined();
  });


  it('should not override existing namespace', function() {
    var angular = window.di;
    var module = angular.module;

    setupModuleLoader(window, 'di');
    expect(window.di).toBe(angular);
    expect(window.di.module).toBe(module);
  });


  it('should record calls', function() {
    var otherModule = window.di.module('other', []);
    otherModule.config('otherInit');

    var myModule = window.di.module('my', ['other'], 'config');

    expect(myModule.
      provider('sk', 'sv').
      factory('fk', 'fv').
      service('a', 'aa').
      value('k', 'v').
      filter('f', 'ff').
      directive('d', 'dd').
      controller('ctrl', 'ccc').
      config('init2').
      constant('abc', 123).
      run('runBlock')).toBe(myModule);

    expect(myModule.requires).toEqual(['other']);
    expect(myModule._invokeQueue).toEqual([
      ['$provide', 'constant', ['abc', 123] ],
      ['$injector', 'invoke', ['config'] ],
      ['$provide', 'provider', ['sk', 'sv'] ],
      ['$provide', 'factory', ['fk', 'fv'] ],
      ['$provide', 'service', ['a', 'aa'] ],
      ['$provide', 'value', ['k', 'v'] ],
      ['$filterProvider', 'register', ['f', 'ff'] ],
      ['$compileProvider', 'directive', ['d', 'dd'] ],
      ['$controllerProvider', 'register', ['ctrl', 'ccc']],
      ['$injector', 'invoke', ['init2'] ]
    ]);
    expect(myModule._runBlocks).toEqual(['runBlock']);
  });


  it('should allow module redefinition', function() {
    expect(window.di.module('a', [])).not.toBe(window.di.module('a', []));
  });


  it('should complain of no module', function() {
    expect(function() {
      window.di.module('dontExist');
    }).toThrow('No module: dontExist');
  });
});
