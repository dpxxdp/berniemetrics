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
				zip: '02110',
				city: 'TestTown',
				state: 'TS',
				crowd_size: '5000',
				event_date: '03/27/2013',
				source: 'https://source.com',
				youtube: 'https://youtube.com',
				image: 'https://image.com',
				link1: 'https://link.com',
				link2: 'https://link2.com',
				link3: 'https://link3.com'
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
								(crowds[0].zip).should.match('02110');

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

	it('should not be able to save Crowd instance if no zip is provided', function(done) {
		// Invalidate zip field
		crowd.zip = '';
		crowd.city = 'TestTown';
		crowd.state = 'TS';
		crowd.crowd_size = '5000';
		crowd.event_date = '03/27/2013';
		crowd.source = 'https://source.com';
		crowd.youtube = 'https://youtube.com';
		crowd.imcrowdage = 'https://image.com';
		crowd.link1 = 'https://link.com';
		crowd.link2 = 'https://link2.com';
		crowd.link3 = 'https://link3.com';

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
						(crowdSaveRes.body.message).should.match('Zip required');
						
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

						// Update Crowd info
						crowd.zip = '02110';
						crowd.city = 'TestTown';
						crowd.state = 'TS';
						crowd.crowd_size = '5000';
						crowd.event_date = '03/27/2013';
						crowd.source = 'https://source.com';
						crowd.youtube = 'https://youtube.com';
						crowd.image = 'https://image.com';
						crowd.link1 = 'https://link.com';
						crowd.link2 = 'https://link2.com';
						crowd.link3 = 'https://link3.com';

						// Update existing Crowd
						agent.put('/crowds/' + crowdSaveRes.body._id)
							.send(crowd)
							.expect(200)
							.end(function(crowdUpdateErr, crowdUpdateRes) {
								// Handle Crowd update error
								if (crowdUpdateErr) done(crowdUpdateErr);

								// Set assertions
								(crowdUpdateRes.body._id).should.equal(crowdSaveRes.body._id);
								(crowdUpdateRes.body.zip).should.match('02110');

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
					// crowdSet assertion
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
					res.body.should.be.an.Object.with.property('zip', crowd.zip);

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
