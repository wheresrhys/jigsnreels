describe('services/modals', function () {

	var modals,
		$modal;
	beforeEach(angular.mock.module('jnr'));

	beforeEach(inject(function ($injector) {
		modals = $injector.get('jModals');
		$modal = $injector.get('$modal');
		spyOn($modal, 'open');
	}));

	it('should open a modal window', function () {
		modals.open('tuneViewer');
		expect($modal.open).toHaveBeenCalled();
	});

	it('should pass in a scope if provided', function () {
		var scope = {};
		modals.open('tuneViewer', scope);
		expect($modal.open.mostRecentCall.args[0].scope).toBe(scope);
	});

	describe('modal types', function () {
		it('should provide a tuneViewer modal', function () {
			modals.open('tuneViewer');
			expect($modal.open.mostRecentCall.args[0].templateUrl).toBe('/src/tune/tpl/tune-viewer.html');
		});

		it('should provide a addTune modal', function () {
			modals.open('addTune');
			expect($modal.open.mostRecentCall.args[0].templateUrl).toBe('/src/tune/tpl/add-tune.html');
		});
		it('should provide a performanceEditor modal', function () {
			modals.open('performanceEditor');
			expect($modal.open.mostRecentCall.args[0].templateUrl).toBe('/src/tune/tpl/performance-editor.html');
		});
		it('should provide a arrangementConfirm modal', function () {
			modals.open('arrangementConfirm');
			expect($modal.open.mostRecentCall.args[0].templateUrl).toBe('/src/tune/tpl/arrangement-confirm.html');
		});
	});
});
