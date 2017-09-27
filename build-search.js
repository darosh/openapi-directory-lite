var lunr = require('lunr');
var fs = require('fs');
var doc = require('./build-doc');
var data = require('./data');

var keys = Object.keys(data.data().specs);
keys.sort();

const index = lunr(function () {
  this.use(remove);
  this.ref('i');
  this.field('x');

  data.filePaths().forEach((file, i) => {
    console.log(file.key + ' #' + (i+1));
    var json = require(file.path);
    var d = doc(json, keys.indexOf(file.key));
    this.add(d)
  });
});

var ser = index.toJSON();

fs.writeFileSync('search.json', JSON.stringify(ser));

function remove(builder) {
  var pipelineFunction = function (token) {
    var str = token.toString();

    if (/[`']$/.test(str)) {
      return token.update(function () {
        return str.replace(/[`']$/, '');
      });
    }

    return token;
  };

  lunr.Pipeline.registerFunction(pipelineFunction, 'remove');
  builder.pipeline.before(lunr.stemmer, pipelineFunction);
};
