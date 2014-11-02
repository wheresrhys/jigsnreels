var allSrcs = ['Gruntfile.js', 'build/**/*.js', 'public/src/**/*.js', 'test/**/*.js', 'server/**/*.js'],
    bower = [
        'angular',
        {abcjs: 'index'},
        {'angular-bootstrap': 'ui-bootstrap-tpls'},
        'angular-animate',
        'angular-cookies',
        'angular-resource',
        'angular-route',
        'liquidmetal',
        {'lodash': 'dist/lodash'}
    ],
    version;
    

bower = bower.map(function (item) {
    var newItem = {};
    if (typeof item === 'string') {
        newItem.name = item;
        newItem.path = item;
        item = newItem;
    } else {
        newItem.name = Object.keys(item)[0];
        newItem.path = item[newItem.name];
    }
    return newItem;
});

module.exports = {
    allSrcs: allSrcs,
    bower: bower,
    version: version
};