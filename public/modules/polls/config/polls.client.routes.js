'use strict';

//Setting up route
angular.module('polls').config(['$stateProvider',
	function($stateProvider) {
		// Polls state routing
		$stateProvider.
		state('listPolls', {
			url: '/polls',
			templateUrl: 'modules/polls/views/list-polls.client.view.html'
		}).
		state('createPoll', {
			url: '/polls/create',
			templateUrl: 'modules/polls/views/create-poll.client.view.html'
		}).
		state('viewPoll', {
			url: '/polls/:pollId',
			templateUrl: 'modules/polls/views/view-poll.client.view.html'
		}).
		state('editPoll', {
			url: '/polls/:pollId/edit',
			templateUrl: 'modules/polls/views/edit-poll.client.view.html'
		});
	}
]);