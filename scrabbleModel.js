
// ScrabbleModel represents a solitaire scrabble game, played without a board.
// The player has a rack of letter tiles and scores points by making words with
// them. 

// Make a ScrabbleModel, initially with 0 score and a rack full of random tiles.
exports.makeScrabbleModel = function() {
    var model = {}; // the object we're going to return, with public methods on it

    // scrabble tile distribution and point values taken
    // from http://en.wikipedia.org/wiki/Scrabble_letter_distributions
    
    // set of tiles to draw from
    const TILES = 
        "EEEEEEEEEEEEAAAAAAAAAIIIIIIIIIOOOOOOOONNNNNNRRRRRRTTTTTT"+
        "LLLLSSSSUUUUDDDDGGGBBCCMMPPFFHHVVWWYYKJXQZ"; 

    // Requires tiles to be a nonempty string, each character representing a tile.
    // Returns a randomly-chosen tile as a single-character string. 
    function randomTile(tiles) {
        return tiles[Math.floor(Math.random() * tiles.length)];
    }

    // Unit tests for randomTile().  Drawbacks: runs every time a model object
    // is created.  It would be better to use a unit-testing framework like QUnit.
    (function testRandomTile() {
        function assert(testResult) {
            if (!testResult) throw new Error("assertion failure");
        }
        assert(randomTile("A") == "A");
        var manyCalls = [];
        for (var i = 0; i < 1000; ++i) {
            manyCalls.push(randomTile("ABC"));
        }
        //console.log(manyCalls);
        assert(manyCalls.some(function(result) { return result == "A" }));
        assert(manyCalls.some(function(result) { return result == "B" }));
        assert(manyCalls.some(function(result) { return result == "C" }));
    }) ();

    // point value of each tile.  Rarer letters have higher point values.
    const TILE_VALUES = {
        "A":1, "B":3, "C":3, "D":2, "E":1, "F":4, "G":2, 
        "H":4, "I":1, "J":8, "K":5, "L":1, "M":3, "N":1, 
        "O":1, "P":3, "Q":10, "R":1, "S":1, "T":1, "U":1, 
        "V":4, "W":4, "X":8, "Y":4, "Z":10
    };

    // return the total value of all the tiles in a string
    function scrabbleValue(tiles) {
        var tileList = tiles.split("");
        var scores = tileList.map(function(letter) { return TILE_VALUES[letter]; });
        var total = scores.reduce(function(x,y) { return x + y; }, 0);
        return total;
    }

    // maximum number of tiles allowed in the rack
    const MAX_RACK_LENGTH = 7;

    // representation.  These variables are private to the model.
    var score = 0;      // player's current score
    var tileRack = drawNewTiles("");  // tiles currently in the player's rack
    var listeners = []; // view listeners who should be called when the rep changes

    // rep invariant
    //    score is an integer >= 0
    //    tileRack is a string containing only letters found in TILES
    //    tileRack.length == MAX_RACK_LENGTH
    //    listeners is a list of no-argument functions

    // return (integer) player's current score
    model.getScore = function() {
        return score;
    }

    // return (string) tiles currently in the player's rack
    model.getTileRack = function() {
        return tileRack;
    }

    // Plays a word.  
    // Requires: word is a string.
    // Effects: adds the word's point value to the player's score,
    // and removes the word's letters from the rack.
    // Throws an exception if the rack doesn't have all the letters in the word.
    model.play = function(word) {
        tileRack = removeTiles(tileRack, word);
        tileRack = drawNewTiles(tileRack);
        score += scrabbleValue(word);
        announceChange();
    }

    // Add random tiles to a rack until the rack is full.
    function drawNewTiles(rack) {
        while (rack.length < MAX_RACK_LENGTH) {
            rack += randomTile(TILES);
        }
        return rack;
    }

    // Remove tiles from a rack.
    // Requires: rack and tilesToRemove are strings
    // Returns: updated rack after removing each tile in tilesToRemove
    // Throws an exception if a tile in tilesToRemove isn't found in the rack 
    function removeTiles(rack, tilesToRemove) {
        for (var i = 0; i < tilesToRemove.length; ++i) {
            var tile = tilesToRemove[i];
            var newRack = rack.replace(tile, "");
            if (newRack == rack) {
                throw new Error("letter not found in rack: " + tile)
            }
            rack = newRack;
        }
        return rack;
    }

    // Registers a listener function that gets called whenever
    // this model changes state (i.e. when the score or rack changes).
    // Requires: listener is a no-argument function, i.e. function() { ... }
    // Effects: when model changes state in the future, listener will be called.
    model.onChange = function(listener) {
        listeners.push(listener);
    }

    // Call all listeners.
    function announceChange() {
        listeners.map(function(listener) { listener(); });
    }

    return model;
}
