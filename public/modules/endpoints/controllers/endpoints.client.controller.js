'use strict';

// Endpoints controller
angular.module('endpoints').controller('EndpointsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Endpoints',
	function($scope, $stateParams, $location, Authentication, Endpoints) {
		$scope.authentication = Authentication;

		$scope.stringReturn = '';

		// Create new Endpoint
		$scope.create = function() {
			var jsonSpec;

			try {
				jsonSpec = JSON.parse(this.return);
			} catch (e) {
				$scope.error = 'Return field contains invalid json.  Try <a href=\"http://jsonlint.com/\">jsonlint</a> for help.';
				return;
			}

			// Create new Endpoint object
			var endpoint = new Endpoints ({
				method: this.method,
				path: this.path,
				return: jsonSpec,
				description: this.description,
				example: this.example
			});

			// Redirect after save
			endpoint.$save(function(response) {
				$location.path('endpoints/' + response._id);

				// Clear form fields
				$scope.method = '';
				$scope.path = '';
				$scope.return = '';
				$scope.description = '';
				$scope.example = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Endpoint
		$scope.remove = function(endpoint) {
			if ( endpoint ) { 
				endpoint.$remove();

				for (var i in $scope.endpoints) {
					if ($scope.endpoints [i] === endpoint) {
						$scope.endpoints.splice(i, 1);
					}
				}
			} else {
				$scope.endpoint.$remove(function() {
					$location.path('endpoints');
				});
			}
		};

		// Update existing Endpoint
		$scope.update = function() {
			var endpoint = $scope.endpoint;

			endpoint.$update(function() {
				$location.path('endpoints/' + endpoint._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Endpoints
		$scope.find = function() {
			$scope.endpoints = Endpoints.query();
		};

		// Find existing Endpoint
		$scope.findOne = function() {
			$scope.endpoint = Endpoints.get({
				endpointId: $stateParams.endpointId
			});
		};

		$scope.$watch('stringReturn', function (newValue) {
			if($scope.endpoint) {
				$scope.endpoint.return = JSON.parse(newValue);
			}
		});

		$scope.$watch('endpoint.return', function (newValue) {
			$scope.stringReturn = JSON.stringify(newValue);
		});
	}
]);
