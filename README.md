# TODO

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
