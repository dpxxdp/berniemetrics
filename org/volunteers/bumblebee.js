'use strict';

var Slack = require('node-slackr');

var slack = new Slack('https://hooks.slack.com/services/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',{
	channel: '#test',
	username: 'b',
	icon_emoji: ':bee:'
});

var message = 'I\'m going to try to be helpful...';

slack.notify(message, function(err, result){
	console.log(err,result);
});