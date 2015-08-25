'use strict';

//Crowds service used to communicate Crowds REST endpoints
angular.module('crowds').factory('Crowds', ['$resource',
	function($resource) {
		return $resource('crowds/:crowdId', { crowdId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);