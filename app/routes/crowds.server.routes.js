'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var crowds = require('../../app/controllers/crowds.server.controller');

	// Crowds Routes
	app.route('/crowds')
		.get(crowds.list)
		.post(users.requiresLogin, crowds.create);

	app.route('/crowds/:crowdId')
		.get(crowds.read)
		.put(users.requiresLogin, crowds.hasAuthorization, crowds.update)
		.delete(users.requiresLogin, crowds.hasAuthorization, crowds.delete);

	// Finish by binding the Crowd middleware
	app.param('crowdId', crowds.crowdByID);
};
