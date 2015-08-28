'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Endpoint = mongoose.model('Endpoint');

/**
 * Globals
 */
var user, endpoint;

/**
 * Unit tests
 */
describe('Endpoint Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			endpoint = new Endpoint({
				method: 'GET',
				path: '/crowds',
				return: {
					'user': 'name',
					'crowd' : [ {'user': 'id'}, 'endpoint' ]
				},
				description: 'blah blah blah',
				example: 'this is an example'
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return endpoint.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Endpoint.remove().exec();
		User.remove().exec();

		done();
	});
});
