'use strict';


angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication',
	function($scope, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		$scope.go = function ( path ) {
			$location.url( path );
		};

		$scope.viewState = {
			'apiCategory': 'crowds'
		};

		$scope.setViewState = function(key, value) {
			viewState[key] = value;
		};


		$scope.apiContentByCategory = {
			'crowds' : {
				'GET': ['/crowds', '/crowds/:id']
			},
			'old_media': {
				'GET': ['/old_media', '/old_media/:id']
			},
			'new_media': {
				'GET': ['/new_media', '/new_media/:id']
			},
			'polls': {
				'GET': ['/polls', '/polls/:id']
			},
			'campaign': {
				'GET': ['/campaign', '/campaign/:id']
			},
			'money': {
				'GET': ['/money', '/money/:id']
			}
		}
	}
]);
