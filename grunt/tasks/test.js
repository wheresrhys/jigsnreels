module.exports = function (grunt) {

    grunt.registerTask('test', ['jshint:lenient', 'checkSpecExistence', 'test-client', 'test-server']);

    grunt.registerTask('test-server', [
        'jasmine_node'
    ]);
    grunt.registerTask('lint', [
        'jshint:strict'
    ]);

    grunt.registerTask('test-client', [
        'instrument',
        'browserify:bower',
        'browserify:instrumented',
        'jasmine:automated',
        'browserify:src',
        'jasmine:browser:build', 
        'checkCoverage'
    ]);


    grunt.registerTask('checkSpecExistence', function () {
        var fs = require('fs'),
            tpl = 'describe(\'{{module}}\', function () {\n\t\n});',
            missingClient = examineSpecs('client', 'public/src/', require('../istanbul-excludes')),
            missingServer = examineSpecs('server', 'server/', ['migrate']);
            
        function examineSpecs (env, srcPrefix, excludes) {
            var rx = new RegExp('(^' + srcPrefix.replace('\\', '\\\\\\') + '|\\.js$)', 'g'),
                missing = [];

            grunt.file.expand(srcPrefix + '**/*.js').forEach(function (file) {
                var module = file.replace(rx, ''),
                    specPath = 'test/' + env + '/specs/' + module + '_spec.js',
                    defaultContent = tpl.replace('{{module}}', module);

                if (excludes.indexOf(module) === -1) {
                    if (!fs.existsSync(specPath)) {
                        missing.push(module);
                        grunt.file.write(specPath, defaultContent);
                    } else if (grunt.file.read(specPath) === defaultContent) {
                        grunt.verbose.errorlns('No specs written for client module: ' + module);        
                    }
                }
            });    
            return missing;       
        }

        if (missingClient.length) {
            missingClient.forEach(function (module) {
                grunt.log.errorlns('No specs written for client module: ' + module);        
            });
        }
        if (missingServer.length) {
            missingServer.forEach(function (module) {
                grunt.log.errorlns('No specs written for server module: ' + module);        
            });
        }

        if (missingClient.length || missingServer.length) {
            throw grunt.util.error('Review missing specs');
        }

    });

    grunt.registerTask('checkCoverage', function () {
        var istanbulUtils = require('../../node_modules/istanbul/lib/object-utils'),
            coverage = require('../../reports/coverage.json'),
            excludes = require('../istanbul-excludes'),
            errors = [];

        var fileSummary = [];
        Object.keys(coverage).forEach(function (file) {
            var summary = istanbulUtils.summarizeFileCoverage(coverage[file]),
                error = false;
            if (excludes.indexOf(file.replace(/(^\.\/public\/src\/|\.js$)/g, '')) > -1) {
                return;
            }

            Object.keys(summary).forEach(function (expressionType) {
                if (summary[expressionType].total - summary[expressionType].covered > 0) {
                    error = true;
                }
            });
            if (error) {
                errors.push(file);
            }

        });
        if (errors.length) {
            grunt.log.subhead('Insufficient unit test coverage');
            grunt.log.errorlns(grunt.log.wordlist(errors, {separator: '\n'}));
            throw grunt.util.error();
        }
        
    });

    grunt.registerTask('atomisedCoverage', function () {
        var originalJasmineConfig = JSON.stringify(grunt.config.get('jasmine'));

        grunt.config('jasmine.automated.options.specs', []);
        grunt.config('jasmine.automated.options.templateOptions.coverage', 'tmp/coverage.json');
        grunt.config('jasmine.automated.options.templateOptions.report', []);

        var allFiles, 
            baseReport,
            file;

        grunt.registerTask('continueAtomisedCoverage', function () {
            baseReport = require('../../tmp/coverage.json');
            allFiles = grunt.file.expand('test/client/specs/**/*.js');
            grunt.task.run(['recurseAtomisedCoverage']);
        });

        grunt.registerTask('recurseAtomisedCoverage', function () {
            if (file) {
                // do some analysis
            }
            file = allFiles.pop();
            if (file) {
                grunt.config('jasmine.automated.options.specs', [file]);
                grunt.config('jasmine.automated.options.templateOptions.coverage', 'tmp/coverage/' + file + '.json');
                grunt.task.run(['jasmine:automated', 'recurseAtomisedCoverage']);
            } else {
                //generate final report
            }
        });

        grunt.task.run(['jasmine:automated', 'continueAtomisedCoverage']);


       
    });
  
};