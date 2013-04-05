
var di = require('../../lib/ng-di.js');

var App = di.module('App', [])
  .constant('constant', 'It works!');

module.exports = App;