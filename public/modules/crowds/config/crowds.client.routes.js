'use strict';

//Setting up route
angular.module('crowds').config(['$stateProvider',
	function($stateProvider) {
		// Crowds state routing
		$stateProvider.
		state('listCrowds', {
			url: '/crowds',
			templateUrl: 'modules/crowds/views/list-crowds.client.view.html'
		}).
		state('createCrowd', {
			url: '/crowds/create',
			templateUrl: 'modules/crowds/views/create-crowd.client.view.html'
		}).
		state('viewCrowd', {
			url: '/crowds/:crowdId',
			templateUrl: 'modules/crowds/views/view-crowd.client.view.html'
		}).
		state('editCrowd', {
			url: '/crowds/:crowdId/edit',
			templateUrl: 'modules/crowds/views/edit-crowd.client.view.html'
		});
	}
]);