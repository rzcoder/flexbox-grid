module.exports = function (grunt) {
    var config = {
        pkg: require('./package.json'),
        isDev: grunt.option('no-dev')
    };

    grunt.initConfig({
        clean: {
            dist: ['dist/'],
            css: ['dist/**/*.css'],
            html: ['dist/**/*.html']
        },

        stylus: {
            options: {
                linenos: false,
                compress: false,
                use: ["nib"],
                'include css': true
            },
            compile: {
                files: [
                    {expand: true, cwd: 'src/', src: '*.styl', dest: 'dist', ext: '.css'},
                    {expand: true, cwd: 'pages/styles', src: '*.styl', dest: 'dist', ext: '.css'}
                ]
            }
        },

        cssmin: {
            dist: {
                files: [
                    {expand: true, cwd: 'dist/', src: '*.css', dest: 'dist', ext: '.min.css'}
                ]
            }
        },

        jade: {
            options: {
                pretty: true
            },
            pages: {
                files: [
                    {expand: true, cwd: 'pages/', src: '**/*.jade', dest: 'dist', ext: '.html'}
                ]
            }
        },

        watch: {
            styles: {
                files: ['src/**/*.styl', 'pages/styles/**/*.styl'],
                tasks: ['clean:css', 'styles']
            },
            html: {
                files: ['pages/**/*.jade'],
                tasks: ['clean:html', 'html']
            }
        },

        connect: {
            server: {
                options: {
                    port: 9001,
                    keepalive: true,
                    base: 'dist'
                }
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            watch: ['connect', 'watch']
        }

    });

    require('time-grunt')(grunt);
    require('jit-grunt')(grunt);

    grunt.registerTask('html', ['jade:pages']);

    grunt.registerTask('styles',
        config.isDev ? ['stylus:compile'] : ['stylus:compile', 'cssmin:dist']
    );

    grunt.registerTask('default', ['clean:dist', 'styles', 'html']);

    grunt.registerTask('w', ['default', 'concurrent:watch']);
};