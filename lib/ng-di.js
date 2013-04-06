/*
 * ng-di
 * https://github.com/jmenidara/ng-di
 *
 * Copyright (c) 2013 Javier Mendiara Cañardo
 * Licensed under the MIT license.
 */
(function(exports){
  'use strict';
  exports.module = require('./module').setupModuleLoader(exports);
  exports.injector = require('./injector').createInjector;

})(typeof exports === 'undefined'? (require('./ng-di')): exports);






