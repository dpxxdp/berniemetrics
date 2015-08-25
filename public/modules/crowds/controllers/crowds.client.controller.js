'use strict';

// Crowds controller
angular.module('crowds').controller('CrowdsController', ['$scope', '$filter', '$stateParams', '$location', 'Authentication', 'Crowds',
	function($scope, $filter, $stateParams, $location, Authentication, Crowds) {
		$scope.authentication = Authentication;

		// Create new Crowd
		$scope.create = function() {
			// Create new Crowd object
			var crowd = new Crowds ({
				zip: this.zip,
				city: this.city,
				state: this.state,
				crowd_size: this.crowd_size,
				event_date: this.event_date,
				source: this.source,
				youtube: this.youtube,
				image: this.image,
				link1: this.link1,
				link2: this.link2,
				link3: this.link3
			});

			// Redirect after save
			crowd.$save(function(response) {
				$location.path('crowds/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.zip = '';
				$scope.city = '';
				$scope.state = '';
				$scope.crowd_size = '';
				$scope.event_date = '';
				$scope.source = '';
				$scope.youtube = '';
				$scope.image = '';
				$scope.link1 = '';
				$scope.link2 = '';
				$scope.link3 = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Crowd
		$scope.remove = function(crowd) {
			if ( crowd ) { 
				crowd.$remove();

				for (var i in $scope.crowds) {
					if ($scope.crowds [i] === crowd) {
						$scope.crowds.splice(i, 1);
					}
				}
			} else {
				$scope.crowd.$remove(function() {
					$location.path('crowds');
				});
			}
		};

		// Update existing Crowd
		$scope.update = function() {
			console.log('Test');
			var crowd = $scope.crowd;

			crowd.$update(function() {
				$location.path('crowds/' + crowd._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Crowds
		$scope.find = function() {
			$scope.crowds = Crowds.query();
		};

		// Find existing Crowd
		$scope.findOne = function() {
			$scope.crowd = Crowds.get({ 
				crowdId: $stateParams.crowdId
			});
		};

		$scope.viewState = {
			warning: true
		};

		$scope.toggleViewState = function(view){
			$scope.viewState[view] = !$scope.viewState[view];
		};

		$scope.$watch('ui_event_date', function (newValue) {
			if($scope.crowd) {
				$scope.crowd.event_date = $filter('date')(newValue, 'yyyy-MM-dd');
			}
		});

		$scope.$watch('crowd.event_date', function (newValue) {
			$scope.ui_event_date = $filter('date')(newValue, 'yyyy-MM-dd');
		});

	}
]);
