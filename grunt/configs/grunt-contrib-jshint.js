module.exports = function (baseConfig, grunt) {
    return {
        jshint: {
            options: grunt.file.readJSON('./.jshintrc'),
            lenient: {
                files: {
                    src: baseConfig.allSrcs
                },
                options: {
                    '-W018': true, // allows things to be defined but not used
                    '-W062': true, // allows !function () {} ()
                    '-W055': true // allows constructors not starting with caps e.g jTune
                    // '-W003': true // allows functions to be defined after used
                }
            },
            strict: {
                files: {
                    src: baseConfig.allSrcs
                },
                options: {
                    unused: true,
                    maxparams: 3
                }
            }
        }
    };
}