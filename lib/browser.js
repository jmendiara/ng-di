
function require(moduleName) {
  var whereToStart = moduleName.lastIndexOf('/'), name;

  if (whereToStart === -1){
    throw new Error('Module "' + moduleName + '" not found');
  }
  name = moduleName.substr(whereToStart + 1);

  return require.modules[name] || (require.modules[name] = {});
};

require.modules = {};

window.di = require('./ng-di');
