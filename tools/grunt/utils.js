var fs = require('fs');
var shell = require('shelljs');
var grunt = require('grunt');
var spawn = require('child_process').spawn;

module.exports = {

  init: function() {
    shell.exec('npm install');
  },

  build: function(config, fn){
    var files = grunt.file.expand(config.src);
    var styles = config.styles;
    //concat
    var src = files.map(function(filepath){
      return grunt.file.read(filepath);
    }).join(grunt.util.normalizelf('\n'));
    //process
    var processed = this.process(src, grunt.config('NG_VERSION'), config.strict);
    if (styles) processed = this.addStyle(processed, styles.css, styles.minify);
    //write
    grunt.file.write(config.dest, processed);
    grunt.log.ok('File ' + config.dest + ' created.');
    fn();
  },

  min: function(file, done) {
    var minFile = file.replace(/\.js$/, '.min.js');
    shell.exec(
      'java ' +
        this.java32flags() + ' ' +
        '-jar lib/closure-compiler/compiler.jar ' +
        '--compilation_level SIMPLE_OPTIMIZATIONS ' +
        '--language_in ECMASCRIPT5_STRICT ' +
        '--js ' + file + ' ' +
        '--js_output_file ' + minFile,
      function(code) {
        if (code !== 0) grunt.fail.warn('Error minifying ' + file);
        grunt.file.write(minFile, this.singleStrict(grunt.file.read(minFile), '\n'));
        grunt.log.ok(file + ' minified into ' + minFile);
        done();
      }.bind(this));
  },


  //returns the 32-bit mode force flags for java compiler if supported, this makes the build much faster
  java32flags: function(){
    if (process.platform === "win32") return '';
    if (shell.exec('java -version -d32 2>&1', {silent: true}).code !== 0) return '';
    return ' -d32 -client';
  }


};