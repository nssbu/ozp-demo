
// Export to the Grunt CLI
module.exports = function(grunt) {

  // Load plugins
  require('load-grunt-tasks')(grunt);
  var iwcConfigOverides={
      apiRootUrl:"https://www.owfgoss.org/ng/dev-alpha/mp/api",
  };
  var config = {
    pkg: grunt.file.readJSON('package.json'),

    // variables
    iwcJs: 'bower_components/ozp-iwc/dist/js',

    clean: {
      dist: ['./dist/']
    },

    concat: {
      bus: {
        options: {
          banner: 'angular.module(\'ozpIwcBus\', []).factory(\'iwcBus\', function () {\n',
          footer: '\n//Return the ozpIwc object\nreturn ozpIwc;\n});'
        },
        src: '<%= iwcJs %>/ozpIwc-bus.js',
        dest: 'dist/js/ozpIwc-bus-angular.js'
      },
      client: {
        options: {
          banner: 'angular.module(\'ozpIwcClient\', []).factory(\'iwcClient\', function () {\n',
          footer: '\n//Return the ozpIwc object\nreturn ozpIwc;\n});'
        },
        src: '<%= iwcJs %>/ozpIwc-client.js',
        dest: 'dist/js/ozpIwc-client-angular.js'
      },
      metrics: {
        options: {
          banner: 'angular.module(\'ozpIwcMetrics\', []).factory(\'iwcMetrics\', function () {\n',
          footer: '\n//Return the ozpIwc object\nreturn ozpIwc;\n});'
        },
        src: '<%= iwcJs %>/ozpIwc-metrics.js',
        dest: 'dist/js/ozpIwc-metrics-angular.js'
      }
    },

    uglify: {
      bus: {
        src: 'dist/js/ozpIwc-bus-angular.js',
        dest: 'dist/js/ozpIwc-bus-angular.min.js'
      },
      client: {
        src: 'dist/js/ozpIwc-client-angular.js',
        dest: 'dist/js/ozpIwc-client-angular.min.js'
      },
      metrics: {
        src: 'dist/js/ozpIwc-metrics-angular.js',
        dest: 'dist/js/ozpIwc-metrics-angular.min.js'
      }
    },

    copy: {
      iframepeer: {
        files: [
          {
            src: [ '<%= iwcJs %>/../*.html' ],
            dest: 'dist_iwc/',
            cwd: '.',
            expand: true,
            flatten: true,
          }
        ],
        options: {
          process: function (content, srcPath) {
              console.log("Filtering " + srcPath);
              if (srcPath.match(/\.html/)) {
                  console.log("Filtering " + srcPath);
                  return content.replace(/ozpIwc\.(.*)=.*;/g, function (match, field) {
                      if (field in iwcConfigOverides) {
                          console.log("   Setting " + field + " to " + iwcConfigOverides[field]);
                          return "ozpIwc." + field + '="' + iwcConfigOverides[field] + '";';
                      } else {
                          console.log("   Ignoring " + match);
                          return match;
                      }
                  });
              }
              return content;
          }
        }

      },
      iwcbus: {
        files: [
          {
            src: [ '<%= iwcJs %>/ozpIwc-bus.js', '<%= iwcJs %>/debugger.js', '<%= iwcJs %>/ozpIwc-client.js'  ],
            dest: 'dist_iwc/js/',
            cwd: '.',
            expand: true,
            flatten: true
          }
        ]
      }
    },

    // NOTE: must be running 'grunt test' in ozp-iwc first!!
    // Then manually run grunt connect:sender in one terminal and
    //    grunt connect:receiver in another
    connect: {
      ozonebus: {
        options: {
          port: 9001,
          base: ['dist_iwc', 'bower_components/ozp-data-schemas/mock'],
          hostname: 'localhost',
          keepalive: true
        }
      },
      sender: {
        options: {
          port: 9002,
          base: ['dist', 'dist_iwc', 'demo/sender'],
          hostname: 'localhost',
          keepalive: true
        }
      },
      receiver: {
        options: {
          port: 9003,
          base: ['dist', 'dist_iwc', 'demo/receiver'],
          hostname: 'localhost',
          keepalive: true
        }
      }
    }

  };
    grunt.initConfig(config);

    grunt.registerTask('default', ['clean', 'concat', 'uglify', 'copy']);
};
