'use strict';

var PythonShell = require('python-shell'),
	_ = require('lodash'),
	paths = require('./rcp-paths.js').paths;

var baseUrl = 'http://www.realclearpolitics.com/epolls/2016/president/',
	scriptPath = 'scrapers/realclearpolitics-scraper';

function scrapeState(path, code, callback) {
	var url = baseUrl + path;
	var options = {
		scriptPath: scriptPath,
		args: [url, '--locale', code]
	};

	PythonShell.run('scraper.py', options, function(err, results) {
		if (err) {
			console.log('PollScraper: Python scraper returned error: ' + err);
			callback(err);
		}
		else {
			callback(null, results);
		}
	});
}

function testScrapeState(path, code, callback) {
	var testArray =
		[
			'{"startDate": "7/12", "race": "primary", "endDate": "7/13", "locale": "aj", "Sample": "416 RV", "field": {"Clinton ": "55", "Webb ": "1", "O\'Malley ": "0", "Chafee ": "1", "Sanders ": "18", "Biden ": "5"}, "Spread": "Clinton +37", "Poll": "Gravis Marketing"}',
			'{"startDate": "3/27", "race": "primary", "endDate": "3/27", "locale": "am", "Sample": "319 RV", "field": {"Clinton ": "61", "Sanders ": "7", "O\'Malley ": "1", "Biden ": "3", "Webb ": "0"}, "Spread": "Clinton +46", "Poll": "Gravis Marketing"}',
			'{"startDate": "2/21", "race": "primary", "endDate": "2/22", "locale": "an", "Sample": "324 RV", "field": {"Clinton ": "58", "Sanders ": "4", "O\'Malley ": "0", "Biden ": "8", "Webb ": "3"}, "Spread": "Clinton +38", "Poll": "Gravis Marketing"}'
		];
	callback(null, testArray);
}

var pagesRemaining = 0;

var callbackIfDone = function(callback, resultList) {
	pagesRemaining--;
	//console.log('PollScraper: pages remaining to scrape: ' + pagesRemaining);
	if(pagesRemaining <= 0) {
		//console.log('PollScraper: Calling back: ' + resultList.length);
		callback(resultList);
	}
};

exports.scrapeRCP = function(callback) {
	var resultList = [];
	console.log('PollScraper: Begin scraping...');
	_.forEach(paths, function(statePath, stateCode) {
		pagesRemaining++;
		scrapeState(statePath, stateCode, function(err, results) {
			if(err) {
				console.log('PollScraper: scraping failed failed for: ' + stateCode);
				callbackIfDone(callback, resultList);
			}
			else {
				console.log('PollScraper:  Returning ' + results.length + ' polls');
				resultList.push(results);
				callbackIfDone(callback, resultList);
			}
		});
	});
};
