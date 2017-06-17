// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var path = __dirname + '/';
var PythonShell = require('python-shell');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

var port = process.env.PORT || 3000;        // set our port

var router = express.Router();              // get an instance of the express Router

function treatImage(filename, callback) {
    console.log(filename);
    var options = {
        args: ['-i', 'test']
    };

    PythonShell.run('main.py', options, function (err, results) {
        if (err) throw err;
        console.log(results);
        callback(null, results[0], results[1]);
    });
}
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.post('*', function (req, res) {
    var fileName = req.body.file;
    var response = {};

    // setTimeout(function () {
    treatImage(fileName, function (error, x, y) {
        if (!error) {
            response = { x: x, y: y };
        } else {
            response = { 'message aaaaaaaaa': 'error' };
        }
        response.fileName = fileName;

        res.json(response);
    });
    // }, 100)
});

app.use('/', router);
app.listen(port);