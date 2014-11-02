describe('directives/draw-score', function() { 
    beforeEach(angular.mock.module('jnr'));
    var ABCJS = require('abcjs'),
        $rootScope,
        tune,
        jTune,
        jScoreSnippets,
        prefixAbc = function (abc) {
            return 'X:1' +
            '\nM:1/1'+ 
            '\nL:1/8' + 
            '\nK:Gaeo' + 
            '\n' + abc;
        };

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        jTune = $injector.get('jTune');
        jScoreSnippets = $injector.get('jScoreSnippets');
        $rootScope.tune = new jTune({
            meter: '1/1',
            mode: 'aeo',
            arrangements: [{
                abc: 'abc',
                root: 'G',
                _id: '1'
            }]
        });
        jasmine.Clock.useMock();
        spyOn(ABCJS, 'renderAbc');
    }));
    

    it('should avoid blocking the ui', inject(function ($compile, $rootScope) {
        
        var el = Helpers.applyDirective($compile, $rootScope, '<div j-draw-score tune="{{tune.scoreGenerator}}"></div>');
        $rootScope.$digest();
        expect(ABCJS.renderAbc).not.toHaveBeenCalled();
        jasmine.Clock.tick(101);
        expect(ABCJS.renderAbc).toHaveBeenCalled();
    }));

    it('should abort when no arrangement provided', inject(function ($compile, $rootScope) {
        $rootScope.tune = new jTune({
            meter: '1/1',
            mode: 'aeo',
            arrangements: []
        });
        var el = Helpers.applyDirective($compile, $rootScope, '<div j-draw-score tune="{{tune.scoreGenerator}}"></div>');
        $rootScope.$digest();
        jasmine.Clock.tick(101);
        expect(ABCJS.renderAbc).not.toHaveBeenCalled();
    }));

    it('should abort when no tune provided', inject(function ($compile, $rootScope) {
        var el = Helpers.applyDirective($compile, $rootScope, '<div j-draw-score tune=""></div>');
        $rootScope.$digest();
        jasmine.Clock.tick(101);
        expect(ABCJS.renderAbc).not.toHaveBeenCalled();
    }));

    it('should pass correct details to ABCJS', inject(function ($compile, $rootScope) {
        var el = Helpers.applyDirective($compile, $rootScope, '<div j-draw-score tune="{{tune.scoreGenerator}}"></div>');
        $rootScope.$digest();
        jasmine.Clock.tick(101);
        expect(ABCJS.renderAbc).lastCalledWith(el[0], prefixAbc('abc'));
    }));
    it('should update with new abc when tune gets changed', inject(function ($compile, $rootScope) {
        var el = Helpers.applyDirective($compile, $rootScope, '<div j-draw-score tune="{{tune.scoreGenerator}}"></div>');
        $rootScope.$digest();
        $rootScope.tune.arrangement.abc = 'efg';
        $rootScope.$digest();
        jasmine.Clock.tick(101);
        expect(ABCJS.renderAbc).lastCalledWith(el[0], prefixAbc('efg'));
    }));

    it('should use first arrangement available when none explicitly defined', inject(function ($compile, $rootScope) {
        $rootScope.tune.arrangements = [$rootScope.tune.arrangement];
        delete $rootScope.tune.arrangement;
        var el = Helpers.applyDirective($compile, $rootScope, '<div j-draw-score tune="{{tune.scoreGenerator}}"></div>');
        $rootScope.$digest();
        jasmine.Clock.tick(101);
        expect(ABCJS.renderAbc).lastCalledWith(el[0], prefixAbc('abc'));
    }));    
    

    describe('score snippet', function () {
        var el;

        function runDirective ($compile, callback) {
            el = Helpers.applyDirective($compile, $rootScope, '<div j-draw-score tune="{{tune.scoreGenerator}}" snippet="true"></div>');
            $rootScope.$digest();
            jasmine.Clock.tick(101);
            callback();
        }

        describe('generating a snippet', function () {
            beforeEach(function () {
                spyOn(jScoreSnippets, 'getCachedScore').andCallFake(function (arrangement, existsCallback, notExistsCallback) {
                    notExistsCallback();
                });
            });
            it('should correctly display tunes which have a bar line to start', inject(function ($compile) {
                $rootScope.tune.arrangement.abc = '|abc abc|abc abc|b2c a3|def d2f|abd a3';
                runDirective($compile, function () {
                    expect(ABCJS.renderAbc.mostRecentCall.args[1]).toBe(prefixAbc('abc abc|abc abc|b2c a3'));    
                });
                
            })); 
            it('should correctly display tunes which have a double bar line to start', inject(function ($compile) {
                $rootScope.tune.arrangement.abc = '||abc abc|abc abc|b2c a3|def d2f|abd a3';
                runDirective($compile, function () {
                    expect(ABCJS.renderAbc.mostRecentCall.args[1]).toBe(prefixAbc('abc abc|abc abc|b2c a3'));    
                });
                
            })); 
            it('should correctly display tunes which have a repeat to start', inject(function ($compile) {
                $rootScope.tune.arrangement.abc = ':abc abc|abc abc|b2c a3|def d2f|abd a3';
                runDirective($compile, function () {
                    expect(ABCJS.renderAbc.mostRecentCall.args[1]).toBe(prefixAbc('abc abc|abc abc|b2c a3'));    
                });
                
            })); 

            it('should correctly display tunes which have a half bar to start', inject(function ($compile) {
                $rootScope.tune.arrangement.abc = 'bc|abc abc|b2c a3|def d2f|abd a3';
                runDirective($compile, function () {
                    expect(ABCJS.renderAbc.mostRecentCall.args[1]).toBe(prefixAbc('bc|abc abc|b2c a3|def d2f'));    
                });
                
            })); 

            it('should correctly display tunes which start with a full bar', inject(function ($compile) {
                $rootScope.tune.arrangement.abc = 'abc abc|abc abc|b2c a3|def d2f|abd a3';
                runDirective($compile, function () {
                    expect(ABCJS.renderAbc.mostRecentCall.args[1]).toBe(prefixAbc('abc abc|abc abc|b2c a3'));    
                });
                
            }));
        });

        describe('using a cached snippet', function () {
            beforeEach(function () {
                spyOn(jScoreSnippets, 'getCachedScore').andCallFake(function (arrangement, existsCallback, notExistsCallback) {
                    existsCallback({score: '<svg width="276" id="snippet-test-el"></svg>'});
                });
            });

            it('should insert the score snippet html to the page', inject(function ($compile) {
                $rootScope.tune.arrangement.abc = 'abc';
                runDirective($compile, function () {
                    expect(ABCJS.renderAbc).not.toHaveBeenCalled();
                    expect(el[0].childNodes[0].nodeName).toEqual('svg');
                    expect(el[0].childNodes[0].id).toEqual('snippet-test-el');
                });
            }));

            it('should adjust the width of the container to fit the score', inject(function ($compile) {
                $rootScope.tune.arrangement.abc = 'abc';
                runDirective($compile, function () {
                    expect(el[0].style.width).toEqual('276px');
                });
            }));
        });

    });
    
});