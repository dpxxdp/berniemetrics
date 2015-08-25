'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Crowd Schema
 */
var CrowdSchema = new Schema({
	zip: {
		type: Number,
		required: 'Zip required'
	},
	city: {
		type: String,
		required: 'City required'
	},
	state: {
		type: String,
		required: 'State required'
	},
	crowd_size: {
		type: Number,
		required: 'Crowd size required'
	},
	event_date: {
		type: Date,
		required: 'Event Date required'
	},
	source: {
		type: String,
		required: 'Cite your source!'
	},
	youtube: {
		type: String,
		default: ''
	},
	image: {
		type: String,
		default: ''
	},
	link1: {
		type: String,
		default: ''
	},
	link2: {
		type: String,
		default: ''
	},
	link3: {
		type: String,
		default: ''
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Crowd', CrowdSchema);
