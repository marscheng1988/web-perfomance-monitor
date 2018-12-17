module.exports = function (app) {
    app.get(`/get-delay-3s/`, function (req, res) {
        console.log(req.query);
        var a = {
            msg: 'success'
        }
        setTimeout(() => {
            res.send(a);
        }, 3000)
    });
    app.get(`/get-delay-5s/`, function (req, res) {
        console.log(req.query);
        var a = {
            msg: 'success'
        }
        setTimeout(() => {
            res.send(a);
        }, 5000)
    });
}