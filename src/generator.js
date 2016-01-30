const EndOfSentenceRegexp = /[?!.]/;

export function trainGenerator(corporaTexts) {
  var order = 2;
  var allWords = corpora.reduce(function(acc, text) {
    acc + text
  }, "").split(/\s/);

  window.console.log("Beginning training.");
  // Map of order-grams to next words (String -> Array)
  var graph = {};
  var orderGram;
  for (var start = 0; start + order < allWords.length; ++start) {
    orderGram = allWords.slice(start, start + order).join(" ");
    if (!graph[orderGram]) {
      graph[orderGram] = [];
    }
    graph[orderGram].push(allWords[start + order]);
  }

  return {
    generate: function() {
      // For now, we'll shoot for a random number of sentences between 3 and 12.
      var targetNumSentences = Math.floor(Math.random() * 9) + 3;
      var numSentences = 0;
      var sampleArray = function(array) {
        return array[Math.floor(Math.random() * array.length)];
      };
      var startingGrams = Object.keys(graph);
      // Prime array.
      var words = sampleArray(startingGrams).split(/\s/);
      do {
        if (EndOfSentenceRegexp.test(words[words.length - 1]) {
          ++numSentences;
        }
        if (numSentences < targetNumSentences) {
          // We'll look for a match based on the previous string
          var previousGram = words.slice(words.length - order, words.length).join(" ");
          if (graph[previousGram]) {
            words.push(...sampleArray(graph[previousGram]));
          }
          // ok, let's just sample again.
          else {
            words.push(...sampleArray(startingGrams));
          }
        }
      }
      while (numSentences < targetNumSentences);
      return words.join(" ");
    }
  };
}
