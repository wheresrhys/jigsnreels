describe('filters/capitalise', function () {

    beforeEach(angular.mock.module('jnr'));

    it('should capitalise the first letter of a string', inject(function ($injector) {
        var capitalise = $injector.get('capitaliseFilter');
        expect(capitalise('rabbit rabbit')).toBe('Rabbit rabbit');
    }));
});