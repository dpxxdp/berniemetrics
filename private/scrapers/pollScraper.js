'use strict';

var PythonShell = require('python-shell'),
	_ = require('lodash'),
	paths = require('./rcp-paths.js').paths;

var baseUrl = 'http://www.realclearpolitics.com/epolls/2016/president/',
	scriptPath = 'realclearpolitics-scraper';

function scrapeState(path, code, callback) {
	var url = baseUrl + path;
	var options = {
		scriptPath: scriptPath,
		args: [url, '--locale', code]
	};

	PythonShell.run('scraper.py', options, function(err, results) {
		if (err) {
			console.log('scraper returned error: ' + err);
			callback(err);
		}
		else {
			console.log('Scraper returned:' + results);
			callback(null, results);
		}
	});
}

function testScrapeState(path, code, callback) {
	var testArray =
		[
			'{"startDate": "7/12", "race": "primary", "endDate": "7/13", "locale": "us", "Sample": "416 RV", "field": {"Clinton ": "55", "Webb ": "1", "O\'Malley ": "0", "Chafee ": "1", "Sanders ": "18", "Biden ": "5"}, "Spread": "Clinton +37", "Poll": "Gravis Marketing"}',
			'{"startDate": "3/27", "race": "primary", "endDate": "3/27", "locale": "an", "Sample": "319 RV", "field": {"Clinton ": "61", "Sanders ": "7", "O\'Malley ": "1", "Biden ": "3", "Webb ": "0"}, "Spread": "Clinton +46", "Poll": "Gravis Marketing"}',
			'{"startDate": "2/21", "race": "primary", "endDate": "2/22", "locale": "al", "Sample": "324 RV", "field": {"Clinton ": "58", "Sanders ": "4", "O\'Malley ": "0", "Biden ": "8", "Webb ": "3"}, "Spread": "Clinton +38", "Poll": "Gravis Marketing"}'
		];
	callback(null, testArray);
}

exports.scrapeRCP = function(callback) {
	var resultList = [];
	_.forEach(paths, function(statePath, stateCode) {
		scrapeState(statePath, stateCode, function(err, results) {
			if(err) {
				console.log('scrapeState failed: ' + stateCode);
				return;
			}
			else {
				resultList.push(results);
			}
		});
	});
	callback(resultList);
};
