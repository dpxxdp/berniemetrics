var PythonShell = require('python-shell');

var options = {
	scriptPath: 'realclearpolitics-scraper',
	args: ['http://www.realclearpolitics.com/epolls/2016/president/nv/nevada_democratic_presidential_caucus-5337.html']
}

PythonShell.run('scraper.py', options, function(err, results) {
	if (err) throw err;
	console.log(results);
});
