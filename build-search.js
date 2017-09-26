var lunr = require('lunr');
var fs = require('fs');
var doc = require('./build-doc');
var data = require('./data');

var keys = Object.keys(data.data().specs);
keys.sort();

const index = lunr(function () {
  this.use(remove);
  // this.use(lunr.trimmer);
  this.ref('i');
  this.field('t');
  this.field('d');
  this.field('m');

  data.filePaths().forEach((file, i) => {
    console.log(file.key + ' #' + i)
    var json = require(file.path);
    var d = doc(json, keys.indexOf(file.key));
    // console.log(d);
    this.add(d)
  });
});

var ser = index.toJSON();

fs.writeFileSync('search.json', JSON.stringify(ser));

function remove(builder) {
  var pipelineFunction = function (token) {
    var str = token.toString();

    if (/[<>[\]{}().,:+=_\/\\]/.test(str) || (str.length > 19) || /https?:\/\//.test(str)) {
      return token.update(function () {
        return ''
      })
    } else {
      return token
    }
  };

  lunr.Pipeline.registerFunction(pipelineFunction, 'removeLinks');
  builder.pipeline.before(lunr.stemmer, pipelineFunction);
  // builder.searchPipeline.before(lunr.stemmer, pipelineFunction);
};
