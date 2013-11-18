var express = require('express');
var fs = require('fs');

var scrabbleModel = require('./scrabbleModel');

var model = scrabbleModel.makeScrabbleModel();

var app = express();

app.use(express.static('client'));

app.use(express.json());

// handle requests for game state at GET /game
// writes the game state encoded as JSON
app.get('/game', function(req, res) {
  res.end(JSON.stringify({
    tileRack: model.getTileRack(),
    score: model.getScore()
  }));
});

// handle requests to play words at POST /play
// requires: request body encoded as JSON,
//           key "word" is word to play
app.post('/play', function(req, res) {
  console.log('playing', req.body.word);
  model.play(req.body.word);
  res.end();
});

app.listen(4444);
