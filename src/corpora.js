import $ from 'jquery';

var beer = { name: "beer", uri: "data_sets/beer.txt", location: "remote"};
var spirits = {name: "spirits", uri: "data_sets/spirits.txt", location: "remote"};
var wine = { name: "wine", uri: "data_sets/wine.txt", location: "remote"};

export const defaultSubjects = [beer, spirits, wine];

var lovecraft = { name: "lovecraft", uri: "data_sets/lovecraft.txt", location: "remote"}
var homer = { name: "homer", uri: "data_sets/odyssey.txt", location: "remote"}

export const defaultPersonas = [lovecraft, homer];

export function getCorpusText(corpus) {
  if (corpus.location == "remote") {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: corpus.uri,
        dataType: "text",
        success: function(data) {
          resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          reject(errorThrown);
        }
      });
    });
  }
  else {
    return new Promise(function(resolve, reject) {
      resolve(corpus.text);
    });
  }
}
