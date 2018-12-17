module.exports = function (app) {
    const bodyParser = require('body-parser');
    // console.log(a)
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.post('/post-delay-5s/', function (req, res) {
        var a = {
            msg: 'success'
        }
        setTimeout(() => {
            res.send(a);
        }, 5000)
    });
    app.post('/post-normal/', function (req, res) {
        var a = {
            msg: 'success'
        }
        res.send(a);
    });
    app.post('/post-perfomance-report/', function (req, res) {
        var a = {
            code: 200
        }
        res.send(a);
    });
}