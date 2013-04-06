
var mock = require('../.'),
  App = require('./app');

describe('Sample Test', function(){
  beforeEach(mock.module('App'));
  it('should work in node', mock.inject(function(constant){
    expect(constant).toBe("It works!");
  }));
});