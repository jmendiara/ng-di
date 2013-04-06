
var di = require('ng-di');

var App = di.module('App', [])
  .constant('constant', 'It works!');

module.exports = App;