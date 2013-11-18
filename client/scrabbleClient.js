function makeScrabbleClient() {
  var exports = {};
  
  // obtains the current tile rack and score from the server
  // requires: callback is a function
  // calls callback with the result
  exports.getState = function(callback) {
    var req = new XMLHttpRequest();
    req.open('GET', '/game');
    req.onload = function() {
      callback(JSON.parse(req.responseText));
    };
    req.send();
  }
  
  // plays a word on the server
  // requires: word is a string, callback is a function
  // calls callback with the result
  exports.play = function(word, callback) {
    var req = new XMLHttpRequest();
    req.open('POST', '/play');
    req.setRequestHeader('Content-Type', 'application/json');
    req.onload = callback;
    req.send(JSON.stringify({ "word": word }));
  }
  
  return exports;
}
