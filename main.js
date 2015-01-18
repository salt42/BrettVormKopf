var express = require('express'),
    app = express(),
    fs = require('fs');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use('/', express.static(__dirname + '/app/www'));
app.use('/data', express.static(__dirname + '/data'));

app.listen(3000, '62.75.165.72');
console.log('listening on port 3000');
