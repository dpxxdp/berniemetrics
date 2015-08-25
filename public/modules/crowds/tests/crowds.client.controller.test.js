'use strict';

(function() {
	// Crowds Controller Spec
	describe('Crowds Controller Tests', function() {
		// Initialize global variables
		var CrowdsController,
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

			// Initialize the Crowds controller.
			CrowdsController = $controller('CrowdsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Crowd object fetched from XHR', inject(function(Crowds) {
			// Create sample Crowd using the Crowds service
			var sampleCrowd = new Crowds({
				zip: '02110',
				city: 'TestTown',
				state: 'TS',
				crowd_size: '5000',
				event_date: '03/27/2013',
				source: 'https://source.com',
				youtube: 'https://youtube.com',
				image: 'https://image.com',
				link1: 'https://link.com',
				link2: 'https://link2.com',
				link3: 'https://link3.com'
			});

			// Create a sample Crowds array that includes the new Crowd
			var sampleCrowds = [sampleCrowd];

			// Set GET response
			$httpBackend.expectGET('crowds').respond(sampleCrowds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.crowds).toEqualData(sampleCrowds);
		}));

		it('$scope.findOne() should create an array with one Crowd object fetched from XHR using a crowdId URL parameter', inject(function(Crowds) {
			// Define a sample Crowd object
			var sampleCrowd = new Crowds({
				zip: '02110',
				city: 'TestTown',
				state: 'TS',
				crowd_size: '5000',
				event_date: '03/27/2013',
				source: 'https://source.com',
				youtube: 'https://youtube.com',
				image: 'https://image.com',
				link1: 'https://link.com',
				link2: 'https://link2.com',
				link3: 'https://link3.com'
			});

			// Set the URL parameter
			$stateParams.crowdId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/crowds\/([0-9a-fA-F]{24})$/).respond(sampleCrowd);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.crowd).toEqualData(sampleCrowd);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Crowds) {
			// Create a sample Crowd object
			var sampleCrowdPostData = new Crowds({
				zip: '02110',
				city: 'TestTown',
				state: 'TS',
				crowd_size: '5000',
				event_date: '03/27/2013',
				source: 'https://source.com',
				youtube: 'https://youtube.com',
				image: 'https://image.com',
				link1: 'https://link.com',
				link2: 'https://link2.com',
				link3: 'https://link3.com'
			});

			// Create a sample Crowd response
			var sampleCrowdResponse = new Crowds({
				_id: '525cf20451979dea2c000001',
				zip: '02110',
				city: 'TestTown',
				state: 'TS',
				crowd_size: '5000',
				event_date: '03/27/2013',
				source: 'https://source.com',
				youtube: 'https://youtube.com',
				image: 'https://image.com',
				link1: 'https://link.com',
				link2: 'https://link2.com',
				link3: 'https://link3.com'
			});

			// Fixture mock form input values
			scope.zip = '02110';
			scope.city = 'TestTown';
			scope.state = 'TS';
			scope.crowd_size = '5000';
			scope.event_date = '03/27/2013';
			scope.source = 'https://source.com';
			scope.youtube = 'https://youtube.com';
			scope.image = 'https://image.com';
			scope.link1 = 'https://link.com';
			scope.link2 = 'https://link2.com';
			scope.link3 = 'https://link3.com';

			// Set POST response
			$httpBackend.expectPOST('crowds', sampleCrowdPostData).respond(sampleCrowdResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.zip).toEqual('');
			expect(scope.city).toEqual('');
			expect(scope.state).toEqual('');
			expect(scope.crowd_size).toEqual('');
			expect(scope.event_date).toEqual('');
			expect(scope.source).toEqual('');
			expect(scope.youtube).toEqual('');
			expect(scope.image).toEqual('');
			expect(scope.link1).toEqual('');
			expect(scope.link2).toEqual('');
			expect(scope.link3).toEqual('');

			//Test URL redirection after the Crowd was
			expect($location.path()).toBe('/crowds/' + sampleCrowdResponse._id);
		}));

		it('$scope.update() should update a valid Crowd', inject(function(Crowds) {
			// Define a sample Crowd put data
			var sampleCrowdPutData = new Crowds({
				_id: '525cf20451979dea2c000001',
				zip: '02110',
				city: 'TestTown',
				state: 'TS',
				crowd_size: '5000',
				event_date: '03/27/2013',
				source: 'https://source.com',
				youtube: 'https://youtube.com',
				image: 'https://image.com',
				link1: 'https://link.com',
				link2: 'https://link2.com',
				link3: 'https://link3.com'
			});

			// Mock Crowd in scope
			scope.crowd = sampleCrowdPutData;

			// Set PUT response
			$httpBackend.expectPUT(/crowds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/crowds/' + sampleCrowdPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid crowdId and remove the Crowd from the scope', inject(function(Crowds) {
			// Create new Crowd object
			var sampleCrowd = new Crowds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Crowds array and include the Crowd
			scope.crowds = [sampleCrowd];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/crowds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCrowd);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.crowds.length).toBe(0);
		}));
	});
}());
