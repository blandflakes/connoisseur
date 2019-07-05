# Connoisseur

This was a simple project to learn React.js, a library for building functional web applications. The goal of Connoisseur is to generate either hilarious or believable notes about a food or beverage, using text from a particular author to flavor the verbage. I used a poor man's Markov Chain to do the generation. Some notes end up hilarious, while others are just gibberish. There is also support for adding your own persona or tasting subject!

A demo is available [here](http://blandflakes.github.io/connoisseur/).

This repository is not very polished, not up to date, and not actively developed.

## Directory Layout
`src` contains source javascript files.

`dist` contains the runnable site. For now, track it in github and edit things like index.html there. May make sense in the future to have an index that is copied in.

## Possible future improvements

1. Derive stats about average sentence length, use in generation
2. Multiple personas
3. With #2, parameters for weighting them
4. order configurable
5. speed up, separate out crappy markov chain
6. make persona optional

## TODO

* sentence length is hardcoded and random (sucks)
* sentence ends are naively detected via punctuation at the end of the word, would fail on things like M.D. or Mr.
* disallow uploading multiple corpora of the same name
