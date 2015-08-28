'use strict';

(function() {
	// Endpoints Controller Spec
	describe('Endpoints Controller Tests', function() {
		// Initialize global variables
		var EndpointsController,
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

			// Initialize the Endpoints controller.
			EndpointsController = $controller('EndpointsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Endpoint object fetched from XHR', inject(function(Endpoints) {
			// Create sample Endpoint using the Endpoints service
			var sampleEndpoint = new Endpoints({
				method: 'GET',
				path: '/crowds',
				return: {
					'user': 'name',
					'crowd' : [ {'user': 'id'}, 'endpoint' ]
				},
				description: 'blah blah blah',
				example: 'this is an example'
			});

			// Create a sample Endpoints array that includes the new Endpoint
			var sampleEndpoints = [sampleEndpoint];

			// Set GET response
			$httpBackend.expectGET('endpoints').respond(sampleEndpoints);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.endpoints).toEqualData(sampleEndpoints);
		}));

		it('$scope.findOne() should create an array with one Endpoint object fetched from XHR using a endpointId URL parameter', inject(function(Endpoints) {
			// Define a sample Endpoint object
			var sampleEndpoint = new Endpoints({
				method: 'GET',
				path: '/crowds',
				return: {
					'user': 'name',
					'crowd' : [ {'user': 'id'}, 'endpoint' ]
				},
				description: 'blah blah blah',
				example: 'this is an example'
			});

			// Set the URL parameter
			$stateParams.endpointId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/endpoints\/([0-9a-fA-F]{24})$/).respond(sampleEndpoint);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.endpoint).toEqualData(sampleEndpoint);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Endpoints) {
			// Create a sample Endpoint object
			var sampleEndpointPostData = new Endpoints({
				method: 'GET',
				path: '/crowds',
				return: {
					'user': 'name',
					'crowd' : [ {'user': 'id'}, 'endpoint' ]
				},
				description: 'blah blah blah',
				example: 'this is an example'
			});

			// Create a sample Endpoint response
			var sampleEndpointResponse = new Endpoints({
				_id: '525cf20451979dea2c000001',
				method: 'GET',
				path: '/crowds',
				return: {
					'user': 'name',
					'crowd' : [ {'user': 'id'}, 'endpoint' ]
				},
				description: 'blah blah blah',
				example: 'this is an example'
			});

			// Fixture mock form input values
			scope.method = 'GET';
			scope.path = '/crowds';
			scope.return = '{\'user\': \'name\',\'crowd\' : [ {\'user\': \'id\'}, \'endpoint\' ]}';
			scope.description = 'blah blah blah';
			scope.example = 'this is an example';

			// Set POST response
			$httpBackend.expectPOST('endpoints', sampleEndpointPostData).respond(sampleEndpointResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.method).toEqual('');

			// Test URL redirection after the Endpoint was created
			expect($location.path()).toBe('/endpoints/' + sampleEndpointResponse._id);
		}));

		it('$scope.update() should update a valid Endpoint', inject(function(Endpoints) {
			// Define a sample Endpoint put data
			var sampleEndpointPutData = new Endpoints({
				_id: '525cf20451979dea2c000001',
				method: 'GET',
				path: '/crowds',
				return: {
					'user': 'name',
					'crowd' : [ {'user': 'id'}, 'endpoint' ]
				},
				description: 'blah blah blah',
				example: 'this is an example'
			});

			// Mock Endpoint in scope
			scope.endpoint = sampleEndpointPutData;

			// Set PUT response
			$httpBackend.expectPUT(/endpoints\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/endpoints/' + sampleEndpointPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid endpointId and remove the Endpoint from the scope', inject(function(Endpoints) {
			// Create new Endpoint object
			var sampleEndpoint = new Endpoints({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Endpoints array and include the Endpoint
			scope.endpoints = [sampleEndpoint];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/endpoints\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEndpoint);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.endpoints.length).toBe(0);
		}));
	});
}());
