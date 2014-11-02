module.exports = {
    watch: {
        sass: {
            files: ['public/styles/**/*.scss'],
            tasks: 'sass:dev'
        },
        src: {
            files: ['public/src/**/*.js'],
            tasks: ['browserify:main', 'browserify:src']
        },
        bower: {
            files: ['bower_components/**/*.js'],
            tasks: ['browserify:main', 'browserify:bower']
        },
        test: {
            files: ['test/client/specs/**/*.js', 'test/client/helpers/**/*.js', 'test/*.js'],
            tasks: 'jasmine:browser:build'
        }
    }
};