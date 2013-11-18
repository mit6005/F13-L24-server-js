var fs = require('fs');
var http = require('http');

fs.readFile('/usr/share/dict/words', { encoding: 'utf8' }, function(err, data) {
  // if (err) { ... }
  var words = data.trim().split("\n");
  console.log('words', words.length);
  createScrabbleServer(words);
});

// create a server with the given words
function createScrabbleServer(words) {
  
  // handle a GET request for "/<word>"
  // respond "ok" if <word> is in the dictionary, "illegal" otherwise
  function handleRequest(request, response) {
    console.log('received request', request.url);
    var search = request.url.substring(1);
    var found = words.some(function(word) { return word == search; });
    response.end(found ? 'ok' : 'illegal');
  }

  var server = http.createServer();
  server.on('request', handleRequest);
  server.listen(4444);
}
