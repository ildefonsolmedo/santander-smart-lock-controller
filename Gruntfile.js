/*jslint node: true */
'use strict';
module.exports = function (grunt) {

    var SERVER_JS = ['src/server/**/*.js'],
        SERVER_TEST_JS = ['test/server/**/*.js'];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            server: SERVER_JS,
            servertest: SERVER_TEST_JS,
            options: {
                jshintrc: true
            }
        },

        jscs: {
            server: SERVER_JS,
            servertest: SERVER_TEST_JS
        },

        jsdoc : {
            dist : {
                src: [ SERVER_JS, SERVER_TEST_JS],
                options: {
                    destination: 'docs/v1/',
                    template : 'node_modules/ink-docstrap/template',
                    configure : 'jsdoc.conf.json',
                    readme: 'README.md'
                }
            }
        },

        watch: {
            gruntfile: { files: ['gruntfile.js'], tasks: ['default'] },
            serverjs: { files: SERVER_JS, tasks: ['jshint:server', 'jscs:server'] },
            servertestjs: { files: SERVER_TEST_JS, tasks: ['jshint:servertest', 'jscs:servertest'] },
            jscs: { files: ['.jscsrc'], tasks: ['jscs'] },
            jshint: { files: ['.jshintrc'], tasks: ['jshint'] }
        }
    });

    console.log('Grunt node env: ' + process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'production') {
        require('load-grunt-tasks')(grunt, { scope: 'dependencies' });
    } else {
        require('load-grunt-tasks')(grunt);
        grunt.registerTask('default', ['jsdoc']);
    }
};
