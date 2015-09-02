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

function scrapeRCP(callback) {
	_.forEach(paths, function(statePath, stateCode) {
		scrapeState(statePath, stateCode, callback);
	});
}

scrapeRCP(function() { console.log('Completed'); });
