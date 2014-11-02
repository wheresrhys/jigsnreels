module.exports = function ($rootScope, $cookies) {
    var params = {};
    $rootScope.pageState = params;
    return {
        set: function (data) {
            // params = data;
            for (var key in data) {
                params[key] = data[key];
                if (key === 'instrument') {
                    $cookies.instrument = data.instrument;
                }
                
            }
        },
        get: function (prop) {
            return prop ? params[prop] : params;
        }
    };
};
