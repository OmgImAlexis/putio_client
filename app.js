'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const config = require('cz');
const crypto = require('crypto');

config.defaults({
    "web": {
        "port": 3000
    },
    "apiKey": crypto.randomBytes(20).toString('hex')
});

config.load(path.normalize(__dirname + '/config.json'));
config.args();
config.store('disk');
config.save();

var app = express();

app.disable('x-powered-by');

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use('/', require('./app/routes/api'));

app.listen(config.get('web:port'), function () {
    console.log('The server is running on port %s', config.get('web:port'));
});
