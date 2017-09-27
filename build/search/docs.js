var data = require('../../data');
var fs = require('fs');
var doc = require('./doc');
var keys = Object.keys(data.data().specs);
var docs = [];

keys.sort();

data.filePaths().forEach((file, i) => {
  console.log(file.key + ' #' + (i + 1));
  var json = require(file.path);
  var d = doc(json, keys.indexOf(file.key), file.key);
  docs.push(d)
});

docs.sort((a, b) => {
  return a.length - b.length
});

fs.writeFileSync('search/docs.json', JSON.stringify(docs, null, 2));
