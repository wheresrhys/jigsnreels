describe('filters/tune-stat-summary', function () {
    var dropdowns;

    beforeEach(angular.mock.module('jnr'));

    // beforeEach(inject(function ($injector) {
    //     dropdowns = $injector.get('jDropDowns');
    // }));
    
    it('should sensibly handle lack of popularity or rating', inject(function ($injector) {
        var tuneStatSummary = $injector.get('tuneStatSummaryFilter');
        expect(tuneStatSummary({rating: -1, popularity: -1})).toBe('');
    }));

    it('should use rating when present', inject(function ($injector) {
        var tuneStatSummary = $injector.get('tuneStatSummaryFilter');
        expect(tuneStatSummary({rating: 4, popularity: -1})).toBe('A really nice tune');
    }));

    it('should use popularity when present', inject(function ($injector) {
        var tuneStatSummary = $injector.get('tuneStatSummaryFilter');
        expect(tuneStatSummary({rating: -1, popularity: 2})).toBe('A common tune');
    }));

	it('should use popularity and rating when present', inject(function ($injector) {
        var tuneStatSummary = $injector.get('tuneStatSummaryFilter');
        expect(tuneStatSummary({rating: 3, popularity: 1})).toBe('A pretty good rare tune');
    }));

});