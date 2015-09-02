'use strict';

(function() {
	// Polls Controller Spec
	describe('Polls Controller Tests', function() {
		// Initialize global variables
		var PollsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Polls controller.
			PollsController = $controller('PollsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Poll object fetched from XHR', inject(function(Polls) {
			// Create sample Poll using the Polls service
			var samplePoll = new Polls({
				name: 'New Poll'
			});

			// Create a sample Polls array that includes the new Poll
			var samplePolls = [samplePoll];

			// Set GET response
			$httpBackend.expectGET('polls').respond(samplePolls);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.polls).toEqualData(samplePolls);
		}));

		it('$scope.findOne() should create an array with one Poll object fetched from XHR using a pollId URL parameter', inject(function(Polls) {
			// Define a sample Poll object
			var samplePoll = new Polls({
				name: 'New Poll'
			});

			// Set the URL parameter
			$stateParams.pollId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/polls\/([0-9a-fA-F]{24})$/).respond(samplePoll);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.poll).toEqualData(samplePoll);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Polls) {
			// Create a sample Poll object
			var samplePollPostData = new Polls({
				name: 'New Poll'
			});

			// Create a sample Poll response
			var samplePollResponse = new Polls({
				_id: '525cf20451979dea2c000001',
				name: 'New Poll'
			});

			// Fixture mock form input values
			scope.name = 'New Poll';

			// Set POST response
			$httpBackend.expectPOST('polls', samplePollPostData).respond(samplePollResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Poll was created
			expect($location.path()).toBe('/polls/' + samplePollResponse._id);
		}));

		it('$scope.update() should update a valid Poll', inject(function(Polls) {
			// Define a sample Poll put data
			var samplePollPutData = new Polls({
				_id: '525cf20451979dea2c000001',
				name: 'New Poll'
			});

			// Mock Poll in scope
			scope.poll = samplePollPutData;

			// Set PUT response
			$httpBackend.expectPUT(/polls\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/polls/' + samplePollPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid pollId and remove the Poll from the scope', inject(function(Polls) {
			// Create new Poll object
			var samplePoll = new Polls({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Polls array and include the Poll
			scope.polls = [samplePoll];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/polls\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePoll);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.polls.length).toBe(0);
		}));
	});
}());