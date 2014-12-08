describe('directives/select-on-click', function () {

	var soc,
		el,
		$scope;

	beforeEach(angular.mock.module('jnr'));

	beforeEach(inject(function ($injector) {
		soc = $injector.get('jSelectOnClickDirective')[0].compile();
		$scope = $injector.get('$rootScope').$new();
		el = angular.element(document.createElement('input'));
		angular.element(document).append(el);
	}));

	afterEach(function () {
		el.remove();
	});

	it('should select the input\'s text', function () {
		el[0].select = jasmine.createSpy('el select');
		soc($scope, el);
		el[0].value = 'letters';
		Helpers.fireEvent(el[0], 'click');
		expect(el[0].select).toHaveBeenCalled();
	});
});