'use strict';

//Endpoints service used to communicate Endpoints REST endpoints
angular.module('endpoints').factory('Endpoints', ['$resource',
	function($resource) {
		return $resource('endpoints/:endpointId', { endpointId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);