const EndOfSentenceRegexp = /[?!.]/;

export function trainGenerator(corporaTexts) {
  // Map of order-grams to next words (String -> Array)
  var order = 3;
  var graph = {};
  var sentenceBeginnings = [];

  var maxLength = 0;
  corporaTexts.forEach(function(text) {
    maxLength = Math.max(maxLength, text.length);
  });

  corporaTexts.forEach(function(text) {
    var scalingFactor = maxLength / text.length;
    var lines = text.split("\n");
    lines.forEach(function(line) {
      var words = line.split(/\s/);
      for (var start = 0; start + order < words.length; ++start) {
        var orderGram = words.slice(start, start + order).join(" ");
        var nextWord = words[start + order];
        if (!graph[orderGram]) {
          graph[orderGram] = [];
        }
        // Do this in a loop so we try to scale imbalanced corpora
        for (var times = 0; times < scalingFactor; ++times) {
          graph[orderGram].push(nextWord);
          // If we're starting a sentence, add this to the list of potential beginnings.
          if (start === 0 || EndOfSentenceRegexp.test(words[start - 1])) {
            sentenceBeginnings.push(words.slice(start, start + order));
          }
        }
      }
    })
  });

  return {
    generate: function() {
      // For now, we'll shoot for a random number of sentences between 4 and 6
      var targetNumSentences = Math.floor(Math.random() * 2) + 4;
      var numSentences = 0;
      var sampleArray = function(array) {
        return array[Math.floor(Math.random() * array.length)];
      };
      var startingGrams = Object.keys(graph);
      // Prime array.
      var words = sampleArray(sentenceBeginnings);
      do {
        window.console.log("Size of words: " + words.length);
        var previousGram = words.slice(words.length - order, words.length).join(" ");
        if (EndOfSentenceRegexp.test(words[words.length - 1])) {
          ++numSentences;
          if (numSentences < targetNumSentences) {
            // Try to find a sentence continuation on previous gram. May be too much continuity
            if (graph[previousGram]) {
              window.console.log("Sampling for: " + previousGram);
              words.push(sampleArray(graph[previousGram]));
            }
            else {
              window.console.log("Starting a new sentence.");
              words.push(...sampleArray(sentenceBeginnings));
            }
          }
        }
        else {
          // We'll look for a match based on the previous string
          if (graph[previousGram]) {
            window.console.log("Sampling for: " + previousGram);
            words.push(sampleArray(graph[previousGram]));
          }
          // ok, let's just grab any old word. Is this the right thing here?
          else {
            window.console.log("Nothing found following: " + previousGram);
            words.push(graph[sampleArray(startingGrams)]);
          }
        }
        window.console.log("Added: " + words[words.length - 1]);
      }
      while (numSentences < targetNumSentences);
      return words.join(" ");
    }
  };
}
