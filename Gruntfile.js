module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    jshint: {
      lib: {
        src: ['Gruntfile.js', 'lib/*.js', 'index.js']
      }
    },
    watch: {
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint']);
};
