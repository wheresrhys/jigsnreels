module.exports = function (baseConfig, grunt) {
    return {
        jasmine: {
            automated: {
                src: ['tmp/bundle.src.js'], //'public/src/**/*.js', '!public/src/main.js'],
                options: {
                    outfile: '_specRunner.html',
                    keepRunner: false,
                    //specs: ['tmp/bundle.test.js'],
                    specs: ['test/client/specs/**/*.js'],
                    vendor: ['public/bundle.bower.js'],
                    
                    helpers: [
                        'bower_components/indexeddb-shim/dist/IndexedDBShim.js',
                        'bower_components/angular-mocks/angular-mocks.js',
                        'test/jasmine.jnr.js', 
                        'test/client/helpers/**/*.js'
                    ],
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        replace: false,
                        coverage: 'reports/coverage.json',
                        report: [
                            {
                                type: 'html',
                                options: {
                                    dir: 'reports/coverage'
                                }
                            },
                            {
                                type: 'text-summary'
                            }
                        ]
                    }
                }
            },
            browser: {
                src: ['public/bundle.src.js'], //'public/src/**/*.js', '!public/src/main.js'],
                options: {
                    // run: false, // can just use grunt jasmine:browser:build
                    outfile: 'specRunner.html',
                    keepRunner: true,
                    // specs: ['tmp/bundle.test.js'],
                    specs: ['test/client/specs/**/*.js'],
                    vendor: ['public/bundle.bower.js'],
                    
                    helpers: [
                        'bower_components/angular-mocks/angular-mocks.js',
                        'test/jasmine.jnr.js', 
                        'test/client/helpers/**/*.js'
                    ]
                }
            }
        }   
    };
};