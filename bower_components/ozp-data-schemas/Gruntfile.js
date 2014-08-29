module.exports = function(grunt) {
    
    var config={
      jsonlint: {
          sample: {
              src: ['mock/**/*.json']
          }
      }  
    };
    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    grunt.initConfig(config);

    // Default task(s).
    grunt.registerTask('default', ['jsonlint']);

};
