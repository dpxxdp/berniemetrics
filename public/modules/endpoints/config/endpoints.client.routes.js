'use strict';

//Setting up route
angular.module('endpoints').config(['$stateProvider',
	function($stateProvider) {
		// Endpoints state routing
		$stateProvider.
		state('listEndpoints', {
			url: '/endpoints',
			templateUrl: 'modules/endpoints/views/list-endpoints.client.view.html'
		}).
		state('createEndpoint', {
			url: '/endpoints/create',
			templateUrl: 'modules/endpoints/views/create-endpoint.client.view.html'
		}).
		state('viewEndpoint', {
			url: '/endpoints/:endpointId',
			templateUrl: 'modules/endpoints/views/view-endpoint.client.view.html'
		}).
		state('editEndpoint', {
			url: '/endpoints/:endpointId/edit',
			templateUrl: 'modules/endpoints/views/edit-endpoint.client.view.html'
		});
	}
]);