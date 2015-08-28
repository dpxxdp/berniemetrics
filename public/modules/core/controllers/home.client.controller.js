'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Endpoints',
	function($scope, $location, Authentication, Endpoints) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.go = function ( path ) {
			$location.url( path );
		};

		$scope.init = function() {
			$scope.endpoints = Endpoints.query();
		};

		$scope.viewState = 'crowds';

		$scope.setViewState = function(value) {
			$scope.viewState = value;
		};
	}
]);
