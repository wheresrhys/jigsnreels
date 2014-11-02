module.exports = function (baseConfig, grunt) {

    return {
        browserify: {
            main: {
                options: {
                    debug: true,
                    aliasMappings: [
                        {
                            cwd: './public/src/',      // Src matches are relative to this path.
                            src: ['**/*.js'], // Actual pattern(s) to match.
                            dest: './src/' //jnr/'
                        }
                    ],
                    alias: baseConfig.bower.map(function (item) {
                        return item.name + ':' + item.name;
                    }),
                    transform: ['browserify-shim']
                },
                files: {
                    'public/bundle.js': './public/src/main.js'
                }
            },
            instrumented: {
                options: {
                    debug: false,
                    aliasMappings: [
                        {
                            cwd: './tmp/instrumented/public/src/',      // Src matches are relative to this path.
                            src: ['**/*.js'], // Actual pattern(s) to match.
                            dest: './src/' //jnr/'
                        }
                    ],
                    external: baseConfig.bower.map(function (item) {
                        return item.name;
                    })
                },
                files: {
                    'tmp/bundle.src.js': ['./tmp/instrumented/public/src/**/*.js']//, '!./public/src/main.js'])
                }
            },
            src: {
                options: {
                    debug: true,
                    aliasMappings: [
                        {
                            cwd: './public/src/',      // Src matches are relative to this path.
                            src: ['**/*.js'], // Actual pattern(s) to match.
                            dest: './src/' //jnr/'
                        }
                    ],
                    external: baseConfig.bower.map(function (item) {
                        return item.name;
                    })
                },
                files: {
                    'public/bundle.src.js': ['./public/src/**/*.js', '!./public/src/main.js']
                }
            },
            bower: {
                options: {
                    debug: false,
                    // need to manually alias bower components?
                    alias: baseConfig.bower.map(function (item) {
                        return item.name + ':' + item.name;
                    }),
                    // external: external,
                    transform: ['browserify-shim']
                },
                files: {
                    'public/bundle.bower.js': baseConfig.bower.map(function (item) {
                        return './bower_components/' + item.name + '/' + item.path + '.js';
                    })
                }
            }
        }
    };  
};