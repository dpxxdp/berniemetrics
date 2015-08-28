'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Endpoint Schema
 */
var EndpointSchema = new Schema({
	method: {
		type: String,
		default: '',
	},
	path: {
		type: String,
		default: '',
	},
	return: {
		type: JSON,
		default: {}
	},
	description: {
		type: String,
		default: ''
	},
	example: {
		type: String,
		default: ''
	}
});

mongoose.model('Endpoint', EndpointSchema);
