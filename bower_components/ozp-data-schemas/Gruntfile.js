module.exports = function(grunt) {
    var makeTv4Options=function(baseSchema) {
        var fs=require('fs');
        return { 
                  root: grunt.file.readJSON(baseSchema),
                  multi: true,
                  add: grunt.file.expand("schema/*.json").map(function(d) { return grunt.file.readJSON(d);})
//                  schemas: {
//                      "http://ozoneplatform.org/jsonschema/hal-schema.json" : grunt.file.readJSON('schema/hal-schema.json'),
//                      "http://ozoneplatform.org/jsonschema/ozp-iwc-base.json" : grunt.file.readJSON('schema/ozp-iwc-base.json')
//                  }
              };
    };
    var config={
      jsonlint: {
          sample: {
              src: ['mock/**/*.json','schema/**/*.json']
          }
      },
      tv4: {
          applicationSchema: {
              options: makeTv4Options('schema/vnd.ozp-application-v1+json.json'),
              src: 'mock/api/application/v1/*/*.json'
          },
          dataSchema: {
              options: makeTv4Options('schema/vnd.ozp-iwc-data-object-v1+json.json'),
              src: ['mock/api/data/**/*.json','!mock/api/data/v1/exampleUser/index.json']
          },
          intentSchema: {
              options: makeTv4Options('schema/vnd.ozp-intent-description-v1+json.json'),
              src: ['mock/api/intents/v1/*/*/*/index.json']
          }
      }
    };
    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    grunt.initConfig(config);

    // Default task(s).
    grunt.registerTask('default', ['jsonlint','tv4']);

};
