'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Poll Schema
 */
var PollSchema = new Schema({
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
		required: 'Locale required',
		trim: true
	},
	race: {
		type: String,
		required: 'Race required',
		trim: true
	},
	Sample: {
		type: String,
		required: 'Sample size required',
		trim: true
	},
	Poll: {
		type: String,
		required: 'Poll company required',
		trim: true
	},
	Spread: {
		type: String,
		trim: true
	},
	field: {	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: String,
		trim: true
	}
});

mongoose.model('Poll', PollSchema);