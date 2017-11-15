var express = require('express'),
    app = express(),
    fs = require('fs');
    ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1",
    port = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 8080;


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//app.use('/', express.static(__dirname + '/app/www'));
app.use('/data', express.static(__dirname + '/data'));

app.listen(port, ip);
console.log("app started on port " + port)