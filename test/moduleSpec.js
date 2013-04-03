'use strict';

var setupModuleLoader = require('../lib/module').setupModuleLoader,
  di = require('../lib/ng-di');

describe('module loader', function() {
  var window;

  beforeEach(function () {
    window = {};
    setupModuleLoader(window);
  });

  it('should not override existing namespace', function() {
    var module = window.module;

    setupModuleLoader(window);
    expect(window.module).toBe(module);
  });


  it('should record calls', function() {
    var otherModule = di.module('other', []);
    otherModule.config('otherInit');

    var myModule = di.module('my', ['other'], 'config');

    expect(myModule.
      provider('sk', 'sv').
      factory('fk', 'fv').
      service('a', 'aa').
      value('k', 'v').
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
      ['$injector', 'invoke', ['init2'] ]
    ]);
    expect(myModule._runBlocks).toEqual(['runBlock']);
  });


  it('should allow module redefinition', function() {
    expect(di.module('a', [])).not.toBe(di.module('a', []));
  });


  it('should complain of no module', function() {
    expect(function() {
      di.module('dontExist');
    }).toThrow('No module: dontExist');
  });
});