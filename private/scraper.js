var PythonShell = require('python-shell'),
	_ = require('lodash'),
	paths = require('./rcp-paths.js').paths;

var baseUrl = 'http://www.realclearpolitics.com/epolls/2016/president/',
	scriptPath = 'realclearpolitics-scraper'

function scrapeRCP() {
	_.forEach(paths, function(statePath) {
		scrapeState(statePath)
	});
}

function scrapeState(path) {
	var url = baseUrl + path;
	var options = {
		scriptPath: scriptPath,
		args: [url]
	};

	PythonShell.run('scraper.py', options, function(err, results) {
		if (err) throw err;
		console.log(results);
	});
}

scrapeRCP()
