'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Poll = mongoose.model('Poll'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, poll;

/**
 * Poll routes tests
 */
describe('Poll CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Poll
		user.save(function() {
			poll = {
				name: 'Poll Name'
			};

			done();
		});
	});

	it('should be able to save Poll instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Poll
				agent.post('/polls')
					.send(poll)
					.expect(200)
					.end(function(pollSaveErr, pollSaveRes) {
						// Handle Poll save error
						if (pollSaveErr) done(pollSaveErr);

						// Get a list of Polls
						agent.get('/polls')
							.end(function(pollsGetErr, pollsGetRes) {
								// Handle Poll save error
								if (pollsGetErr) done(pollsGetErr);

								// Get Polls list
								var polls = pollsGetRes.body;

								// Set assertions
								(polls[0].user._id).should.equal(userId);
								(polls[0].name).should.match('Poll Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Poll instance if not logged in', function(done) {
		agent.post('/polls')
			.send(poll)
			.expect(401)
			.end(function(pollSaveErr, pollSaveRes) {
				// Call the assertion callback
				done(pollSaveErr);
			});
	});

	it('should not be able to save Poll instance if no name is provided', function(done) {
		// Invalidate name field
		poll.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Poll
				agent.post('/polls')
					.send(poll)
					.expect(400)
					.end(function(pollSaveErr, pollSaveRes) {
						// Set message assertion
						(pollSaveRes.body.message).should.match('Please fill Poll name');
						
						// Handle Poll save error
						done(pollSaveErr);
					});
			});
	});

	it('should be able to update Poll instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Poll
				agent.post('/polls')
					.send(poll)
					.expect(200)
					.end(function(pollSaveErr, pollSaveRes) {
						// Handle Poll save error
						if (pollSaveErr) done(pollSaveErr);

						// Update Poll name
						poll.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Poll
						agent.put('/polls/' + pollSaveRes.body._id)
							.send(poll)
							.expect(200)
							.end(function(pollUpdateErr, pollUpdateRes) {
								// Handle Poll update error
								if (pollUpdateErr) done(pollUpdateErr);

								// Set assertions
								(pollUpdateRes.body._id).should.equal(pollSaveRes.body._id);
								(pollUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Polls if not signed in', function(done) {
		// Create new Poll model instance
		var pollObj = new Poll(poll);

		// Save the Poll
		pollObj.save(function() {
			// Request Polls
			request(app).get('/polls')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Poll if not signed in', function(done) {
		// Create new Poll model instance
		var pollObj = new Poll(poll);

		// Save the Poll
		pollObj.save(function() {
			request(app).get('/polls/' + pollObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', poll.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Poll instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Poll
				agent.post('/polls')
					.send(poll)
					.expect(200)
					.end(function(pollSaveErr, pollSaveRes) {
						// Handle Poll save error
						if (pollSaveErr) done(pollSaveErr);

						// Delete existing Poll
						agent.delete('/polls/' + pollSaveRes.body._id)
							.send(poll)
							.expect(200)
							.end(function(pollDeleteErr, pollDeleteRes) {
								// Handle Poll error error
								if (pollDeleteErr) done(pollDeleteErr);

								// Set assertions
								(pollDeleteRes.body._id).should.equal(pollSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Poll instance if not signed in', function(done) {
		// Set Poll user 
		poll.user = user;

		// Create new Poll model instance
		var pollObj = new Poll(poll);

		// Save the Poll
		pollObj.save(function() {
			// Try deleting Poll
			request(app).delete('/polls/' + pollObj._id)
			.expect(401)
			.end(function(pollDeleteErr, pollDeleteRes) {
				// Set message assertion
				(pollDeleteRes.body.message).should.match('User is not logged in');

				// Handle Poll error error
				done(pollDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Poll.remove().exec();
		done();
	});
});