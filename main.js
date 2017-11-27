var express = require('express'),
    app = express(),
    fs = require('fs');
    ip = "192.168.0.32",
    port = 8080;


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//app.use('/', express.static(__dirname + '/app/www'));
app.use('/data', express.static(__dirname + '/data'));

app.listen(port, ip, function () {
    console.log("app started on port %s:%s", ip, port);
});
