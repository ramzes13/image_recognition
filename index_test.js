var request = require('request');

request.post({
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    url: 'http://127.0.0.2:3000/',
    body: "file=heydude"
}, function (error, response, body) {
    console.log(body);
});