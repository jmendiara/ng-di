'use strict';

module.exports = function(grunt) {
  //grunt plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-jasmine-node');


  var files = grunt.file.readJSON('tools/files.json'),
    filesMain = [].concat(
      ['tools/wrap/prefix.tpl'],
      files.browser,
      files.src,
      ['tools/wrap/suffix.tpl']
    );

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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

    clean: {dist: ['dist']},

    concat: {
      options: {
        stripBanners: true,
        banner: grunt.file.read('tools/banner.tpl')
      },
      dist: {
        src: filesMain,
        dest: 'dist/<%= pkg.name %>.js'
      },
      mock: {
        src: files.mock,
        dest: 'dist/mock.js'
      }

    },

    uglify: {
      options: {
        banner: grunt.file.read('tools/banner.tpl')
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
        }
      }
    },

    compress: {
      dist: {
        options: {archive: 'dist/<%= pkg.name %>.zip'},
        src: ['**'], cwd: 'dist', expand: true, dot: true, dest: 'dist/'
      }
    }
  });

  grunt.registerTask('test', ['jasmine_node', 'karma']);
  grunt.registerTask('build', ['clean:dist', 'concat', 'uglify:dist', 'compress:dist']);

  grunt.registerTask('default', ['test', 'build']);
};
