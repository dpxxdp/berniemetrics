'use strict';

var CronJob = require('cron').CronJob,
	mongoose = require('mongoose'),
	settings = require('./settings.js'),
	_ = require('lodash'),
	pollScraper = require('./scrapers/pollScraper.js'),
	model = require('./models/polls.researcher.model.js');

mongoose.model('Poll', model.PollSchema);

var Poll = mongoose.model('Poll');

var dupes = [];

var isDupe = function(poll) {
	var hash = poll.Poll + poll.race + poll.startDate + poll.endDate + poll.locale;
	if(_.contains(dupes, hash)) {
		return true;
	} else {
		console.log('is not dupe');
		return false;
	}
};

var convertToListOfPolls = function(rawData) {
	var convertedList = [];
	_.forEach(rawData, function(subList, stateCode) {
		_.forEach(subList, function(pollString, stateCode) {
			var pollJson = JSON.parse(pollString);
			var poll = new Poll(pollJson);
			if(!isDupe(poll)) {
				convertedList.push(poll);
			}
		});
	});
	return convertedList;
};

//keeping track of mongoose inserts
var insertsRemaining = 0;

var closeIfFinished = function(db) {
	insertsRemaining--;
	if(insertsRemaining<=0) {
		db.removeAllListeners();
		db.close();
	}
};

var savePollsToMongo = function(rawList){
	mongoose.connect(process.argv==='prod' ? settings.production.db : settings.development.db);
	//mongoose.connect('mongodb://localhost/berniemetrics-dev');

	var db = mongoose.connection;

	console.log('Saving polls to mongo...');
	if(rawList === null || rawList.length === 0) {
		console.log('No polls to save');
		return;
	}
	
	var pollList = convertToListOfPolls(rawList);

	db.on('error', function(error) {
		console.log('researcher:mongoose connection: could not connect:' + error);
		db.removeAllListeners();
		db.close();
		return;
	});

	db.on('connected', function() {
		console.log('opened database connection');
		insertsRemaining = pollList.length;
		_.forEach(pollList, function(poll, index) {
			Poll.find({
				Poll: poll.Poll,
				locale: poll.locale,
				startDate: poll.startDate,
				endDate: poll.endDate
			}, function(err, docs) {
				if(err) {
					console.log('researcher: error finding docs: ' + err);
					closeIfFinished(db);
				}
				else if(docs.length > 0) {
					console.log('researcher: database already contains the poll you\'re trying to insert');
					closeIfFinished(db);
				}
				else {
					poll.save(function(err) {
						if (err) {
							console.log('error saving poll: ' + err);
							closeIfFinished(db);
						} else {
							console.log('successfully saved poll');
							closeIfFinished(db);
						}
					});
				}
			});
		});
	});
};

var doResearch = function() {
	//var pollJob = new CronJob('00 00 * * * *', function() {
	var pollJob = new CronJob('*/6 * * * * *', function() {
		console.log('Running Poll cron job...');
		pollScraper.scrapeRCP(savePollsToMongo);
		//savePollsToMongo(null, testPoll2);
	},
	function () {
		console.log('researcher: poll scraper cron-job terminated');
	},
	true,
	'America/New_York'
	);
};

doResearch();