'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var polls = require('../../app/controllers/polls.server.controller');

	// Polls Routes
	app.route('/polls')
		.get(polls.list)
		.post(users.requiresLogin, polls.create);

	app.route('/polls/:pollId')
		.get(polls.read)
		.put(users.requiresLogin, polls.hasAuthorization, polls.update)
		.delete(users.requiresLogin, polls.hasAuthorization, polls.delete);

	// Finish by binding the Poll middleware
	app.param('pollId', polls.pollByID);
};
