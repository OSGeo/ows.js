module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            }
        },
        qunit: {
            files: ['test/index.html']
        },
        strip : {
            main : {
                src : 'src/ows.js',
                dest : 'src/ows.js.built.js'
            }
        },
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 9000,
                    keepalive: true,
                    open: {
                        target : "http://127.0.0.1:9000/examples/"
                    },
                    middleware: function (connect, options) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            // Include the proxy first
                            proxy,
                            // Serve static files.
                            connect.static(options.base[0]),
                            // Make empty directories browsable.
                            connect.directory(options.base[0])
                        ];
                    }
                },
                proxies: [{
                    context: '/csw',
                    host: 'demo.pycsw.org/cite',
                    port: 9000
                }]
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-strip');

    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', 'test task', function() {
        grunt.log.write('hi there');
    });
    grunt.registerTask('test', ['qunit', 'jshint']);
    grunt.registerTask('build', ['strip']);

    grunt.registerTask('serve', [
        'configureProxies:server',
        'connect:server']);
};
