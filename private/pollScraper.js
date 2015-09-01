var PythonShell = require('python-shell'),
	_ = require('lodash'),
	paths = require('./rcp-paths.js').paths;

var baseUrl = 'http://www.realclearpolitics.com/epolls/2016/president/',
	scriptPath = 'realclearpolitics-scraper'

function scrapeRCP() {
	_.forEach(paths, function(statePath, stateCode) {
		scrapeState(statePath, stateCode);
	});
}

function scrapeState(path, code) {
	var url = baseUrl + path;
	var options = {
		scriptPath: scriptPath,
		args: [url, '--locale', code]
	};

	PythonShell.run('scraper.py', options, function(err, results) {
		if (err) throw err;
		console.log(results);
	});
}

scrapeRCP()
