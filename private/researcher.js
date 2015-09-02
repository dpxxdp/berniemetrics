'use strict';

var CronJob = require('cron').CronJob,
	mongoose = require('mongoose'),
	settings = require('./settings.js'),
	//pollScraper = require('./pollScraper.js'),
	model = require('./models/polls.researcher.model.js');

mongoose.model('Poll', model.PollSchema);

var Poll = mongoose.model('Poll');

var testPoll = {
	startDate: '2015-05-03',
	endDate: '2015-06-04',
	locale: 'va',
	sample: '500 people',
	poll: 'Dan Test',
	spread: '+15',
	field: [{'Bernie':'50', 'Hillary':'48'}],
	created: new Date(Date.now),
	user: 'rcpPoller0000'
};

var testPoll2 = {
	startDate: '2015-05-03',
	endDate: '2015-06-04',
	locale: 'va',
	sample: '500 people',
	poll: 'Test3',
	spread: '+15',
	field: [{'Bernie':'50', 'Hillary':'48'}],
	created: new Date(Date.now),
	user: 'rcpPoller0000'
};

var pollScraper = {
	scrapeRCP: function(callback) {
		callback(null, testPoll2);
		//callback(null, testPoll);
	}
};

var savePollsToMongo = function(err, returnPoll){
	var poll = new Poll(returnPoll);
	mongoose.connect(process.argv==='prod' ? settings.production.db : settings.development.db);
		//mongoose.connect('mongodb://localhost/berniemetrics-dev');

	var db = mongoose.connection;
	db.on('error', console.log('researcher:savePollsToMongo: error finding docs: ' + err));
	db.once('open', function callback () {
		Poll.find({
			poll: returnPoll.poll,
			startDate: returnPoll.startDate,
			endDate: returnPoll.endDate
		}, function(err, docs) {
			if(err) {
				console.log('researcher:savePollsToMongo: error finding docs: ' + err);
				db.close();
				return;
			}
			if(docs.length > 0) {
				console.log('researcher:savePollsToMongo: database already contains that poll' + docs);
				db.close();
				return;
			}

			poll.save(function(err) {
				if (err) {
					console.log('error saving poll: ' + err);
					db.close();
				} else {
					console.log(poll);
					db.close();
				}
			});
		});
		
	});
};

var doResearch = function() {

	//runs every hour on the hour
	var pollJob = new CronJob('00 00 * * * *', function() {
		pollScraper.scrapeRCP(savePollsToMongo);
	},
	function () {
		console.log('researcher: poll scraper cron-job terminated');
	},
	true,
	'America/New_York'
	);
};

doResearch();