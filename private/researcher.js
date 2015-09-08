'use strict';

var CronJob = require('cron').CronJob,
	mongoose = require('mongoose'),
	settings = require('./settings.js'),
	_ = require('lodash'),
	pollScraper = require('./scrapers/pollScraper.js'),
	model = require('./models/polls.researcher.model.js');

mongoose.model('Poll', model.PollSchema);

var Poll = mongoose.model('Poll');

var djb2 = function(key) {
	if (typeof key === 'string') {
		key = key.split('').map(function(str){
			return str.charCodeAt(0);
		});
	}

	if (!Array.isArray(key)) {
		throw new Error('input must be a string or an array');
	}

	return key.reduce(function(prev, curr){
		return ((prev << 5) + prev) + curr;
	}, 5381);
};

var dupes = [];

var isDupe = function(poll) {
	var hash = djb2(poll.Poll + poll.race + poll.startDate + poll.endDate + poll.locale);
	//console.log(hash);
	//console.log(JSON.stringify(dupes));
	if(_.contains(dupes, hash)){
		//console.log('dupe');
		return true;
	} else {
		dupes.push(hash);
		//console.log('is not dupe');
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
	console.log('insertsRemaining: ' + insertsRemaining);
	if(insertsRemaining<=0) {
		console.log('closing database connection...');
		db.removeAllListeners();
		db.close();
	}
};

var savePollsToMongo = function(rawList){
	console.log('Saving polls to mongo...');
	if(rawList === null || rawList.length === 0) {
		console.log('Researcher: Scraper didn\'t return any polls');
		return;
	}
	
	var pollList = convertToListOfPolls(rawList);

	if(pollList === null || pollList.length === 0) {
		console.log('Researcher: No new polls to save');
		return;
	}

	mongoose.connect(process.argv==='prod' ? settings.production.db : settings.development.db);
	//mongoose.connect('mongodb://localhost/berniemetrics-dev');

	var db = mongoose.connection;

	db.on('error', function(error) {
		console.log('Researcher: Could not connect to mongo:' + error);
		db.removeAllListeners();
		db.close();
		return;
	});

	db.on('connected', function() {
		console.log('Researcher: Opened database connection');
		insertsRemaining = pollList.length;
		console.log('pollList length: ' + pollList.length);  //TESTABC
		setTimeout(function(db) {
			if(db) {
				console.log('Researcher: connection opened for too long. Timing out connection...');
				db.close();
			}
		}, 10000);
		_.forEach(pollList, function(poll, index) {
			Poll.find({
				Poll: poll.Poll,
				locale: poll.locale,
				startDate: poll.startDate,
				endDate: poll.endDate
			}, function(err, docs) {
				if(err) {
					console.log('Researcher: error finding docs: ' + err);
					closeIfFinished(db);
				}
				else if(docs.length > 0) {
					console.log('Researcher: database already contains the poll you\'re trying to insert');
					//var hash = djb2(poll.Poll + poll.race + poll.startDate + poll.endDate + poll.locale);
					//dupes.push(hash);
					closeIfFinished(db);
				}
				else {
					poll.save(function(err) {
						if (err) {
							console.log('Researcher: error saving poll: ' + err);
							closeIfFinished(db);
						} else {
							console.log('Researcher: successfully saved poll');
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
	var pollJob = new CronJob('*/10 * * * * *', function() {
		console.log('Researcher: Running Poll cron job...');
		pollScraper.scrapeRCP(savePollsToMongo);
		//savePollsToMongo(null, testPoll2);
	},
	function () {
		console.log('Researcher: poll scraper cron-job terminated');
	},
	true,
	'America/New_York'
	);
};

doResearch();