reddit = require('redwrap');

reddit.r('SandersForPresident', function(err, data, res){
    console.log(data);
});
