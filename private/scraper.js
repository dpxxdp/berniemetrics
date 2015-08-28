var PythonShell = require('python-shell'),
	_ = require('lodash');

var baseUrl = 'http://www.realclearpolitics.com/epolls/2016/president/',
	scriptPath = 'realclearpolitics-scraper'

var paths = {
	nv: 'nv/nevada_democratic_presidential_caucus-5337.html',
	us: 'us/2016_democratic_presidential_nomination-3824.html'
}

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
