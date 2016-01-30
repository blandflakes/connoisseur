# TODO

## Directory Layout
`src` contains source javascript files.

`dist` contains the runnable site. For now, track it in github and edit things like index.html there. May make sense in the future to have an index that is copied in.

## Possible future improvements

1. Derive stats about average sentence length, use in generation
2. Multiple personas
3. With #2, parameters for weighting them

## TODO

* camelcase all over
* disable text display if there's no state
* need to pass trained stuff to text display for the header
* need to have a "current quote" in the state, also passed to text display (maybe text display has the generator as its state passed from the interface)
* sentence length is hardcoded and random (sucks)
* sentence ends are naively detected via punctuation at the end of the word, would fail on things like M.D.
