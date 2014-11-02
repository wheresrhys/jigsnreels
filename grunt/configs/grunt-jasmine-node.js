module.exports = {
    jasmine_node: {
        // specNameMatcher: "./specs", // load only specs containing specNameMatcher
        projectRoot: './test/server/specs',
        requirejs: false,
        forceExit: true,
        verbose: true, 
        jUnit: {
            report: false,
            savePath : './build/reports/jasmine/',
            useDotNotation: true,
            consolidate: true
        }
    }
};