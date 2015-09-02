'use strict';

// Polls controller
angular.module('polls').controller('PollsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Polls',
	function($scope, $stateParams, $location, Authentication, Polls) {
		$scope.authentication = Authentication;

		// Create new Poll
		$scope.create = function() {
			// Create new Poll object
			var poll = new Polls ({
				name: this.name
			});

			// Redirect after save
			poll.$save(function(response) {
				$location.path('polls/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Poll
		$scope.remove = function(poll) {
			if ( poll ) { 
				poll.$remove();

				for (var i in $scope.polls) {
					if ($scope.polls [i] === poll) {
						$scope.polls.splice(i, 1);
					}
				}
			} else {
				$scope.poll.$remove(function() {
					$location.path('polls');
				});
			}
		};

		// Update existing Poll
		$scope.update = function() {
			var poll = $scope.poll;

			poll.$update(function() {
				$location.path('polls/' + poll._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Polls
		$scope.find = function() {
			$scope.polls = Polls.query();
		};

		// Find existing Poll
		$scope.findOne = function() {
			$scope.poll = Polls.get({ 
				pollId: $stateParams.pollId
			});
		};
	}
]);