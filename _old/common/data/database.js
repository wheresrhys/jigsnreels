module.exports = function($rootScope, $resource, $http) {
    var tables = {},
        resources = {},
        updateFromTheSession = function() {
            $http({
                method: 'GET',
                url: '/rest/scraper'
            })
                .success(function(data, status, headers, config) {
                    data.map(function(item) {
                        tables.tunes.push(new resources.tunes(item));
                    });
                    if (data.length) {
                        $rootScope.$broadcast('newTunesFetched');
                    }
                });
        },

        initResource = function(resourceName, asTable) {
            resources[resourceName] = $resource('/rest/' + resourceName + '/:id', {
                id: '@_id'
            }, {
                'get': {
                    method: 'GET',
                    cache: true
                },
                'update': {
                    method: 'PUT'
                }
                // 'query' : { method:'GET', cache: true, isArray: true }
            });
            if (asTable) {
                tables[resourceName] = resources[resourceName].query(function(result) {
                    $rootScope.$broadcast('jDataLoaded', resourceName);
                });

                if (resourceName === 'tunes') {
                    updateFromTheSession();
                }
                return tables[resourceName];
            }

            return resources[resourceName];
            // },

            // init = function () {
            //     var resourceNames = Array.prototype.slice.apply(arguments);

            //     for (var i = resourceNames.length; --i; i>-1) {
            //         if (!resources[resourceNames[i]]) {
            //             initResource(resourceNames[i]);
            //         }
            //     }
        };

    return {
        getTable: function(name) {
            return tables[name] || initResource(name, 'table');
        },
        getResource: function(name) {
            return resources[name] || initResource(name);
        } //,
        // init: init

    };
};