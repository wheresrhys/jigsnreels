module.exports = {
    instrument: {
        files: ['./public/src/**/*.js', '!./public/src/main.js'],
        options: {
            lazy: false,
            basePath: 'tmp/instrumented/'
        }
    }
};