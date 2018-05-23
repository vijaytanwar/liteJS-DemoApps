/**
 * Grunt config file
 */
module.exports = function (grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: '\n',
            },
            appJS: {
                src: [
                    'scripts/templates.js',
                    'app/components/**/*.js'
                ],
                dest: 'scripts/app.js'
            }
        },
        watch: {
            scripts: {
                files: ['app/**/*.js'],
                tasks: ['concat']
            },
            templates: {
                files: ['app/**/*.html'],
                tasks: ['handlebars', 'concat']
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: 'templates',
                    processName: function (filePath) {
                        var pieces = filePath.split('/');
                        return pieces[pieces.length - 1].split(".")[0];
                    }
                },
                files: {
                    'scripts/templates.js': ['app/**/*.html']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['handlebars', 'concat', 'watch']);
};