function makeScrabbleClient() {
  var exports = {};
  
  exports.getState = function() {
    return { tileRack: '???', score: -1 };
  }
  
  exports.play = function(word) {
    var req = new XMLHttpRequest();
    req.open('POST', '/play');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({ "word": word }));
  }
  
  return exports;
}
