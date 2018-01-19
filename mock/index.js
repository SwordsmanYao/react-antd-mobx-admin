var express = require('express');
var demo = require('./demo');

var app = express();

app.get('/demo/query',demo.query);

module.exports = app;