'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Crowd = mongoose.model('Crowd'),
	_ = require('lodash');

/**
 * Create a Crowd
 */
exports.create = function(req, res) {
	var crowd = new Crowd(req.body);
	crowd.user = req.user;

	crowd.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(crowd);
		}
	});
};

/**
 * Show the current Crowd
 */
exports.read = function(req, res) {
	res.jsonp(req.crowd);
};

/**
 * Update a Crowd
 */
exports.update = function(req, res) {
	var crowd = req.crowd ;

	crowd = _.extend(crowd , req.body);

	crowd.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(crowd);
		}
	});
};

/**
 * Delete an Crowd
 */
exports.delete = function(req, res) {
	var crowd = req.crowd ;

	crowd.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(crowd);
		}
	});
};

/**
 * List of Crowds
 */
exports.list = function(req, res) { 
	Crowd.find().sort('-created').populate('user', 'displayName').exec(function(err, crowds) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(crowds);
		}
	});
};

/**
 * Crowd middleware
 */
exports.crowdByID = function(req, res, next, id) { 
	Crowd.findById(id).populate('user', 'displayName').exec(function(err, crowd) {
		if (err) return next(err);
		if (! crowd) return next(new Error('Failed to load Crowd ' + id));
		req.crowd = crowd ;
		next();
	});
};

/**
 * Crowd authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.crowd.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
