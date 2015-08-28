'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Endpoint = mongoose.model('Endpoint'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, endpoint;

/**
 * Endpoint routes tests
 */
describe('Endpoint CRUD tests', function() {
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

		// Save a user to the test db and create new Endpoint
		user.save(function() {
			endpoint = {
				method: 'GET',
				path: '/crowds',
				return: {
					'user': 'name',
					'crowd' : [ {'user': 'id'}, 'endpoint' ]
				},
				description: 'blah blah blah',
				example: 'this is an example'
			};

			done();
		});
	});

	it('should be able to save Endpoint instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Endpoint
				agent.post('/endpoints')
					.send(endpoint)
					.expect(200)
					.end(function(endpointSaveErr, endpointSaveRes) {
						// Handle Endpoint save error
						if (endpointSaveErr) done(endpointSaveErr);

						// Get a list of Endpoints
						agent.get('/endpoints')
							.end(function(endpointsGetErr, endpointsGetRes) {
								// Handle Endpoint save error
								if (endpointsGetErr) done(endpointsGetErr);

								// Get Endpoints list
								var endpoints = endpointsGetRes.body;

								// Set assertions
								(endpoints[0].method).should.match('GET');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Endpoint instance if not logged in', function(done) {
		agent.post('/endpoints')
			.send(endpoint)
			.expect(401)
			.end(function(endpointSaveErr, endpointSaveRes) {
				// Call the assertion callback
				done(endpointSaveErr);
			});
	});

	it('should be able to update Endpoint instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Endpoint
				agent.post('/endpoints')
					.send(endpoint)
					.expect(200)
					.end(function(endpointSaveErr, endpointSaveRes) {
						// Handle Endpoint save error
						if (endpointSaveErr) done(endpointSaveErr);

						// Update Endpoint method
						endpoint.method = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Endpoint
						agent.put('/endpoints/' + endpointSaveRes.body._id)
							.send(endpoint)
							.expect(200)
							.end(function(endpointUpdateErr, endpointUpdateRes) {
								// Handle Endpoint update error
								if (endpointUpdateErr) done(endpointUpdateErr);

								// Set assertions
								(endpointUpdateRes.body._id).should.equal(endpointSaveRes.body._id);
								(endpointUpdateRes.body.method).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Endpoints if not signed in', function(done) {
		// Create new Endpoint model instance
		var endpointObj = new Endpoint(endpoint);

		// Save the Endpoint
		endpointObj.save(function() {
			// Request Endpoints
			request(app).get('/endpoints')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Endpoint if not signed in', function(done) {
		// Create new Endpoint model instance
		var endpointObj = new Endpoint(endpoint);

		// Save the Endpoint
		endpointObj.save(function() {
			request(app).get('/endpoints/' + endpointObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('method', endpoint.method);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Endpoint instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Endpoint
				agent.post('/endpoints')
					.send(endpoint)
					.expect(200)
					.end(function(endpointSaveErr, endpointSaveRes) {
						// Handle Endpoint save error
						if (endpointSaveErr) done(endpointSaveErr);

						// Delete existing Endpoint
						agent.delete('/endpoints/' + endpointSaveRes.body._id)
							.send(endpoint)
							.expect(200)
							.end(function(endpointDeleteErr, endpointDeleteRes) {
								// Handle Endpoint error error
								if (endpointDeleteErr) done(endpointDeleteErr);

								// Set assertions
								(endpointDeleteRes.body._id).should.equal(endpointSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Endpoint instance if not signed in', function(done) {

		// Create new Endpoint model instance
		var endpointObj = new Endpoint(endpoint);

		// Save the Endpoint
		endpointObj.save(function() {
			// Try deleting Endpoint
			request(app).delete('/endpoints/' + endpointObj._id)
			.expect(401)
			.end(function(endpointDeleteErr, endpointDeleteRes) {
				// Set message assertion
				(endpointDeleteRes.body.message).should.match('User is not logged in');

				// Handle Endpoint error error
				done(endpointDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Endpoint.remove().exec();
		done();
	});
});
