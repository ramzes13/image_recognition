// BASE SETUP REST
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var path = __dirname + '/';

const WebSocket = require('ws');


//configure events
var events = require('events');
var eventEmitter = new events.EventEmitter();

var request = require('request');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port


// DRONE CONFIGURATION
// =============================================================================

//drone module
var sumo = require('node-sumo');
//image processing library
var sharp = require('sharp');
//Init Drone
var drone = sumo.createClient();
// video configuration
const video = drone.getVideoStream();

// END DRONE CONFIGURATION
// ============================================================================

var width = 320,
    height = 240;

// Websocket Server
// const wss = new WebSocket.Server({port: 8084});

// wss.on('connection', function (socket) {

//     socket.on('close', function (code, message) {
//         console.log('Disconnected WebSocket (' + wss.clients.length + ' total)');
//     });
// });

// wss.broadcast = function (data,opts) {
//     wss.clients.forEach(function (client) {
//         client.send('data:image/jpeg;base64,' + data.toString('base64'));
//     });
// };

drone.connect(function () {
    console.log("DRONE CONNECTED");
});

drone.on("ready", function () {
    drone.animationsStop();
});

drone.on("battery", function (battery) {
    console.log("battery: " + battery);
});

drone.on("video", function (data) {
    //console.log('Video data: ' + data);
    buf = data;
    saveVideo(buf);
    // wss.broadcast(data, {binary: true});
});

drone.on("postureStuck", function () {
    drone.stop();
});

video.on("data", function (data) {
    buf = data;
});


// DRONE CUSTOM EVENT FUNCTIONS
// =============================================================================

function goForward() {
    console.log('drone forward')
    drone.forward(10);
}

function goBackward() {
    drone.backward(10);
}

function goLeft() {
    drone.left(10);
}

function goRight() {
    drone.right(10);
}

eventEmitter.on('goForward', goForward);
eventEmitter.on('goBackward', goBackward);
eventEmitter.on('goLeft', goLeft);
eventEmitter.on('goRight', goRight);

//Another functions
function saveVideo(bufferData) {

    var timestamp = Math.round(new Date().getTime() / 1000);
    var fileName = 'output/output' + timestamp + '.jpg';
    // console.log(fileName);
    // sharp(bufferData)
    // .resize(320, 240)
    // .toFile(fileName, function (error, info) {
    //     request.post({
    //         headers: { 'content-type': 'application/x-www-form-urlencoded' },
    //         url: 'http://127.0.0.2:3000/',
    //         body: "file=" + fileName
    //     }, function (error, response, body) {
    //         console.log(body);
    //         console.log('post response');
    //     });
    // });
    request.post({
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: 'http://127.0.0.2:3000/',
        body: "file=" + bufferData
    }, function (error, response, body) {
        console.log(body);
        console.log('post response');
    });
}


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.sendFile(path + "index.html");
});

router.get('/up', function (req, res) {
    console.log('up')
    goForward();
    res.json({ message: 'up' });
});

router.get('/down', function (req, res) {
    goBackward();
    res.json({ message: 'down' });
});

router.get('/left', function (req, res) {
    goLeft();
    res.json({ message: 'left' });
});

router.get('/right', function (req, res) {
    goRight();
    res.json({ message: 'right' });
});

router.get('/stop', function (req, res) {
    drone.stop();
    res.json({ message: 'right' });
});

router.get('/jump', function (req, res) {
    drone.postureJumper();
    drone.animationsLongJump();
    res.json({ message: 'jump' });
});

router.get('/highjump', function (req, res) {
    drone.postureJumper();
    drone.animationsHighJump();
    res.json({ message: 'highjump' });
});

router.get('/perform-action', function (req, res) {
    drone[req.query.type]();
    res.json({ message: req.query.type });
});

app.use('/', router);
app.use('/js', express.static('js'));


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);