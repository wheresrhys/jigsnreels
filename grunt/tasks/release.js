module.exports = function (grunt) {
    var version;
    grunt.registerTask('logCommitMessage', function (type, message) {
        console.log('RELEASE SUCCESS: ' + commitMessage);
    });
    var commitMessage;

    grunt.registerTask('updateGitCommit', function (type, message) {
        var commands = grunt.config('shell');

        commitMessage = '"' + type + (type !== 'patch' ? 'release ' : ' ') + version + ': ' + message.replace(/(^("|')|("|')$)/, '') + '"';
        
        commands.commit.command = 'git commit -m ' + commitMessage;

        console.log(commands.commit.command);
        grunt.config('shell', commands);
    });

    function getVersion (callback) {

        var conf = require('./package.json');
        callback(conf.version.split('.'));

    }

    function setVersion (newVersion, callback) {
        var fs = require('fs'),
            conf = require('./package.json');

        conf.version = newVersion.join('.');

        version = newVersion.join('.');

        fs.writeFile('./package.json', JSON.stringify(conf, null, '\t') , function (err) {
            if (err) {
                throw err;
            }
            callback && callback();
        });
            
    }

    grunt.registerTask('updateVersion', function (type) {
        var done = this.async();
        getVersion(function (version) {

            switch (type) {
            case 'patch' :
                version[2] = +version[2] + 1;
                break;
            case 'minor' :
                version[1] = +version[1] + 1;
                version[2] = 0;
                break;
            case 'major' :
                version[0] = +version[0] + 1;
                version[1] = 0;
                version[2] = 0;
                break;
            }

            setVersion(version, done);
        });
    });

    grunt.registerTask('release', function (type, message) {
        
        if (!type) {
            throw new Error('Specify a type of release please: major, minor or patch');
        }

        if(!message) {
            throw new Error('Please write a message for this release');
        }
        grunt.task.run([
            'testFreeBuild', 
            'updateVersion:' + type, 
            'updateGitCommit:' + type + ':"' + message + '"',
            'stageFiles',
            'shell:commit', 
            'logCommitMessage'
        ]);
    });

    grunt.registerTask('stageFiles', function (type, message) {
        grunt.task.run([
            'shell:status',
            'shell:addFiles', 
            'shell:removeFiles', 
            'shell:status'
        ]);
    });
};