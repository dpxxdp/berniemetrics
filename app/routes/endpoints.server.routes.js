'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var endpoints = require('../../app/controllers/endpoints.server.controller');

	// Endpoints Routes
	app.route('/endpoints')
		.get(endpoints.list)
		.post(users.requiresLogin, endpoints.create);

	app.route('/endpoints/:endpointId')
		.get(endpoints.read)
		.put(users.requiresLogin, endpoints.update)
		.delete(users.requiresLogin, endpoints.delete);

	// Finish by binding the Endpoint middleware
	app.param('endpointId', endpoints.endpointByID);
};
