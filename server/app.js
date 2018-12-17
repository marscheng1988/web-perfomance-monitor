const express = require('express');
const app = express();
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    if (req.method == "OPTIONS") res.send(200); /*让options请求快速返回*/
    else next();
});
require('./post')(app)
require('./get')(app)

app.use(express.static('./'));

var server = app.listen(3001, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('host', server.address());
    console.log('Example app listening at http://localhost', host, port);
});