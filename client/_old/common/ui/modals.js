'use strict';

module.exports = function ($modal) {
    
    var configs = {
        tuneViewer: {
            templateUrl: '/src/tune/tpl/tune-viewer.html',
            controller: 'tuneViewer',
            windowClass:  'tune-viewer fade'
        },
        addTune: {
            templateUrl: '/src/tune/tpl/add-tune.html',
            controller: 'addTune',
            windowClass:  'add-tune fade'
        },
        performanceEditor: {
            templateUrl: '/src/tune/tpl/performance-editor.html',
            windowClass:  'fade'
        },
        arrangementConfirm: {
            templateUrl: '/src/tune/tpl/arrangement-confirm.html',
            windowClass:  'fade'
        },
        abcConfirm: {
            templateUrl: '/src/tune/tpl/abc-confirm.html',
            windowClass:  'fade'
        }
    };

    return {
        open: function (type, scope) {
            var conf = configs[type] || /* istanbul ignore next: paranoid fallback */ {};
            scope && (conf.scope = scope);
            
            return $modal.open(conf);

        }
    };
};
