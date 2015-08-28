'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Endpoint = mongoose.model('Endpoint'),
	_ = require('lodash');

/**
 * Create a Endpoint
 */
exports.create = function(req, res) {
	var endpoint = new Endpoint(req.body);

	endpoint.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(endpoint);
		}
	});
};

/**
 * Show the current Endpoint
 */
exports.read = function(req, res) {
	res.jsonp(req.endpoint);
};

/**
 * Update a Endpoint
 */
exports.update = function(req, res) {
	var endpoint = req.endpoint ;

	endpoint = _.extend(endpoint , req.body);

	endpoint.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(endpoint);
		}
	});
};

/**
 * Delete an Endpoint
 */
exports.delete = function(req, res) {
	var endpoint = req.endpoint ;

	endpoint.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(endpoint);
		}
	});
};

/**
 * List of Endpoints
 */
exports.list = function(req, res) { 
	Endpoint.find().sort('-created').populate('user', 'displayName').exec(function(err, endpoints) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(endpoints);
		}
	});
};

/**
 * Endpoint middleware
 */
exports.endpointByID = function(req, res, next, id) { 
	Endpoint.findById(id).populate('user', 'displayName').exec(function(err, endpoint) {
		if (err) return next(err);
		if (! endpoint) return next(new Error('Failed to load Endpoint ' + id));
		req.endpoint = endpoint ;
		next();
	});
};

/**
 * Endpoint authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.endpoint.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
