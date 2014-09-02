module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
		connect: {
			app: {        
				options:{ 
					port: 8080,base: "app", 
					keepalive: true,
					debug: true
				}
			}
		},
    'gh-pages': {
    options: {
      base: 'app'
    },
    src: ['**']
  },
  copy: {
    mockapi: {
      files: [
        {
          src: ['api/**'],
          dest: 'app/bower_components/ozp-iwc/dist/',
          cwd: 'app/bower_components/ozp-data-schemas/mock',
          expand: true,
          rename: function(dest, src) {
            return dest + src.replace(/index\.json$/, "index.html");
          }
        }
      ]
    }
  },
  clean: {
    mockapi: ['app/bower_components/ozp-iwc/dist/api']
  }
  });

	grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-gh-pages');
	
  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'connect']);

  grunt.registerTask('build', ['clean', 'copy']);

};