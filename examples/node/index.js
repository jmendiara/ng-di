
var App = require('./app'),
  di = require('../../lib/ng-di.js');

di.module('App').run(function (constant){
  console.log(constant);
});

//Once all is loaded, we get the injector to init the App
di.injector(['App']);
