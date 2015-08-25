'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.go = function ( path ) {
			console.log(path);
			console.log($location.url());
			$location.url( path );
		};
	}
]);
