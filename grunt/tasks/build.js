module.exports = function (grunt) {

    function copyToDist (folder, extension) {
        if (extension) {
            var extensionRX = new RegExp('\\.' + extension + '$');
        }
        grunt.file.recurse(folder, function (path) {
            if (path.indexOf('DS_Store') === -1) {
                if (!extension || extensionRX.test(path)) {
                    grunt.file.copy(path, './dist/' + path);
                }
            }
        });
    }

    grunt.registerTask('copyBuildFiles', function () {
        copyToDist('./server');
        copyToDist('./public/src', 'html');
        grunt.file.copy('public/bundle.js', './dist/public/bundle.js');
        grunt.file.copy('server.js', './dist/server.js');
        grunt.file.copy('config_prod.js', './dist/config.js');
    });

    grunt.registerTask('testFreeBuild', [
        'clean',
        'browserify:main',
        'htmlmin:dist',
        // 'uglify:dist',
        'sass:dist',
        'copyBuildFiles',
        'shell:restartProd'
    ]);
    grunt.registerTask('build', [
        // 'test', 
        'testFreeBuild'
    ]);
};