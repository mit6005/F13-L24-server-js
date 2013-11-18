var express = require('express');
var fs = require('fs');

var scrabbleModel = require('./scrabbleModel');

var model = scrabbleModel.makeScrabbleModel();

var app = express();

app.use(express.static('client'));

app.use(express.json());

app.get('/hello', function(req, res) {
  res.end('Hello, world!');
});

app.post('/play', function(req, res) {
  console.log('playing', req.body.word);
  model.play(word);
});

app.listen(4444);
