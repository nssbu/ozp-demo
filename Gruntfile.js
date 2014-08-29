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
  }
  });

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-gh-pages');
	
  // Default task(s).
  grunt.registerTask('default', ['connect']);

};