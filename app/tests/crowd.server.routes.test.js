'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Crowd = mongoose.model('Crowd'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, crowd;

/**
 * Crowd routes tests
 */
describe('Crowd CRUD tests', function() {
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

		// Save a user to the test db and create new Crowd
		user.save(function() {
			crowd = {
				name: 'Crowd Name'
			};

			done();
		});
	});

	it('should be able to save Crowd instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Crowd
				agent.post('/crowds')
					.send(crowd)
					.expect(200)
					.end(function(crowdSaveErr, crowdSaveRes) {
						// Handle Crowd save error
						if (crowdSaveErr) done(crowdSaveErr);

						// Get a list of Crowds
						agent.get('/crowds')
							.end(function(crowdsGetErr, crowdsGetRes) {
								// Handle Crowd save error
								if (crowdsGetErr) done(crowdsGetErr);

								// Get Crowds list
								var crowds = crowdsGetRes.body;

								// Set assertions
								(crowds[0].user._id).should.equal(userId);
								(crowds[0].name).should.match('Crowd Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Crowd instance if not logged in', function(done) {
		agent.post('/crowds')
			.send(crowd)
			.expect(401)
			.end(function(crowdSaveErr, crowdSaveRes) {
				// Call the assertion callback
				done(crowdSaveErr);
			});
	});

	it('should not be able to save Crowd instance if no name is provided', function(done) {
		// Invalidate name field
		crowd.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Crowd
				agent.post('/crowds')
					.send(crowd)
					.expect(400)
					.end(function(crowdSaveErr, crowdSaveRes) {
						// Set message assertion
						(crowdSaveRes.body.message).should.match('Please fill Crowd name');
						
						// Handle Crowd save error
						done(crowdSaveErr);
					});
			});
	});

	it('should be able to update Crowd instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Crowd
				agent.post('/crowds')
					.send(crowd)
					.expect(200)
					.end(function(crowdSaveErr, crowdSaveRes) {
						// Handle Crowd save error
						if (crowdSaveErr) done(crowdSaveErr);

						// Update Crowd name
						crowd.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Crowd
						agent.put('/crowds/' + crowdSaveRes.body._id)
							.send(crowd)
							.expect(200)
							.end(function(crowdUpdateErr, crowdUpdateRes) {
								// Handle Crowd update error
								if (crowdUpdateErr) done(crowdUpdateErr);

								// Set assertions
								(crowdUpdateRes.body._id).should.equal(crowdSaveRes.body._id);
								(crowdUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Crowds if not signed in', function(done) {
		// Create new Crowd model instance
		var crowdObj = new Crowd(crowd);

		// Save the Crowd
		crowdObj.save(function() {
			// Request Crowds
			request(app).get('/crowds')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Crowd if not signed in', function(done) {
		// Create new Crowd model instance
		var crowdObj = new Crowd(crowd);

		// Save the Crowd
		crowdObj.save(function() {
			request(app).get('/crowds/' + crowdObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', crowd.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Crowd instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Crowd
				agent.post('/crowds')
					.send(crowd)
					.expect(200)
					.end(function(crowdSaveErr, crowdSaveRes) {
						// Handle Crowd save error
						if (crowdSaveErr) done(crowdSaveErr);

						// Delete existing Crowd
						agent.delete('/crowds/' + crowdSaveRes.body._id)
							.send(crowd)
							.expect(200)
							.end(function(crowdDeleteErr, crowdDeleteRes) {
								// Handle Crowd error error
								if (crowdDeleteErr) done(crowdDeleteErr);

								// Set assertions
								(crowdDeleteRes.body._id).should.equal(crowdSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Crowd instance if not signed in', function(done) {
		// Set Crowd user 
		crowd.user = user;

		// Create new Crowd model instance
		var crowdObj = new Crowd(crowd);

		// Save the Crowd
		crowdObj.save(function() {
			// Try deleting Crowd
			request(app).delete('/crowds/' + crowdObj._id)
			.expect(401)
			.end(function(crowdDeleteErr, crowdDeleteRes) {
				// Set message assertion
				(crowdDeleteRes.body.message).should.match('User is not logged in');

				// Handle Crowd error error
				done(crowdDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Crowd.remove().exec();
		done();
	});
});