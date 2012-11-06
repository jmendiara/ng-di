
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! \n* <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* <%= pkg.description %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Adaptation done <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' +
        '* All credits must go to the AngularJS team.\n' +
        '* Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>',
          'lib/prefix.tpl',
          '<file_strip_banner:lib/<%= pkg.name %>.js>',
          'lib/suffix.tpl'],
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
    lint: {
      files: ['grunt.js', '<config:concat.dist.dest>']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint test'
    },
    jshint: {
      options: {
        curly: false,
        eqeqeq: false,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },
      globals: {
        exports: true,
        module: false
      }
    },
    uglify: {},
    testacularServer: {
      unit: {
        options: {
          keepalive: true
        },
        configFile: 'test/testacular.conf.js',
        autoWatch: true,
        runnerPort: 9100
      }
    },
    testacularRun: {
      unit: {
        runnerPort: 9100
      }
    }
  });

  grunt.loadNpmTasks('grunt-testacular');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', 'concat lint min copy:dist');


};
