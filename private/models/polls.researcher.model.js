'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Poll Schema
 */
exports.PollSchema = new Schema({
	startDate: {
		type: Date,
		required: 'Start date required',
	},
	endDate: {
		type: Date,
		required: 'End date required'
	},
	locale: {
		type: String,
		required: 'Local Required',
		trim: true
	},
	sample: {
		type: String,
		required: 'Sample size required',
		trim: true
	},
	poll: {
		type: String,
		required: 'Poll company required',
		trim: true
	},
	spread: {
		type: String,
		trim: true
	},
	field: [{	}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: String,
		trim: true
	}
});