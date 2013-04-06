'use strict';
var di = require('../lib/ng-di');

describe('di', function(){
  it('should be defined', function (){
    expect(di).not.toBeUndefined();
   });
  it('should access module function as starting point', function (){
    expect(di.module).toBeFunction();
  })
  it('should access injector function as starting point', function (){
    expect(di.injector).toBeFunction();
  })
  if (typeof window !== 'undefined'){
    it('should be in window.di while in browser mode', function (){
      expect(window.di).toBe(di);
    })
  }
});