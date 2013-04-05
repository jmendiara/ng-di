
describe('Sample Test', function(){
  beforeEach(mock.module('App'));
  it('should work in browser', mock.inject(function(constant){
    expect(constant).toBe("It works!");
  }));
});