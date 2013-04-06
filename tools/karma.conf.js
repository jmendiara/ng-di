// Karma configuration
// Generated on Tue Mar 19 2013 17:06:08 GMT+0100 (CET)


// base path, that will be used to resolve files and exclude
basePath = '../';


//TODO: Sync this when Karma allows better configuration process

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'lib/browser.js',
  'lib/utils.js',
  'lib/module.js',
  'lib/hashmap.js',
  'lib/injector.js',
  'lib/ng-di.js',

  'mock/index.js',
  'test/spec_helper.js',
  'test/*.js'
];


// list of files to exclude
exclude = [
  
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['dots'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
