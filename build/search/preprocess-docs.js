var fs = require('fs');
var preprocess = require('./preprocess-doc');
var docs = require('../../search/docs.json');

docs.forEach((json, i) => {
  console.log(json.key + ' #' + (i + 1));
  preprocess(json)
});

fs.writeFileSync('search/preprocessed.json', JSON.stringify(docs, null, 2));
