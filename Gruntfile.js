'use strict';
var files = require('./tools/files').files;
var util = require('./tools/grunt/utils.js');


module.exports = function(grunt) {
  //grunt plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadTasks('tools/grunt');



  // Project configuration.
  grunt.initConfig({

    pkg: '<json:package.json>',
    files: '<json:tools/files.json>',

    meta: {
      banner: '/*! \n* <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* <%= pkg.description %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Adaptation done <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
        '* All credits must go to the AngularJS team.\n' +
        '* Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */'
    },
    //VERSION: VERSION,

    jasmine_node: {
      specNameMatcher: "spec", // load only specs containing specNameMatcher
      projectRoot: "./test",
      requirejs: false,
      forceExit: true,
      useHelpers: true
    },

    karma: {
      unit: {
        configFile: 'tools/karma.conf.js',
        singleRun: true
      }
    },

    clean: {build: ['build']},

    concat: {
      dist: {
        src: ['<banner:meta.banner>',
          'tools/wrap/prefix.tpl',
          '<file_strip_banner:lib/<%= pkg.name %>.js>',
          'tools/wrap/suffix.tpl'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    copy: {
      dist: {
        files: {
          'dist/ng-di-mocks.js': 'lib/ng-di-mocks.js'
        }
      }
    },
     /*
    build: {
      ng_di: {
        dest: 'build/ng-di.js',
        src: util.wrap([files['browser'], files['src']], 'pl')
      },
      mocks: {
        dest: 'build/ng-di-mock.js',
        src: ['lib/mock.js']
      }
    },




    compress: {
      build: {
        options: {archive: 'build/' + dist +'.zip'},
        src: ['**'], cwd: 'build', expand: true, dot: true, dest: dist + '/'
      }
    },

    write: {
      versionTXT: {file: 'build/version.txt', val: VERSION.full},
      versionJSON: {file: 'build/version.json', val: JSON.stringify(VERSION)}
    }*/
  });

  grunt.registerTask('test', ['jasmine_node', 'karma']);

};
