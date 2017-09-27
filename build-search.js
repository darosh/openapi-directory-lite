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
  // this.metadataWhitelist = ['position'];
  this.field('x');
  // this.field('d');
  // this.field('m');

  var pre = 0
  var add = 0

  data.filePaths().forEach((file, i) => {
    console.log(file.key + ' #' + i)
    var json = require(file.path);

    var t = Date.now()
    var d = doc(json, keys.indexOf(file.key));
    var p = Date.now()
    pre += p - t
    // console.log(d);
    this.add(d)
    add += Date.now() - p
    console.log(pre, add)
  });
});

var ser = index.toJSON();

fs.writeFileSync('search.json', JSON.stringify(ser));

function remove(builder) {
  var pipelineFunction = function (token) {
    var str = token.toString();

    // if (/0x[0-9a-f]+/i.test(str) || /^\d+$/.test(str) || /\d{8}T\d{6}Z/i.test(str) || /[<>[\]{}().,;:"+=_#@|?~$%^&*\/\\]/.test(str) || (str.length > 19) || /https?:\/\//.test(str)) {
    //   return token.update(function () {
    //     return '';
    //   })
    // } else

    if (/[`']$/.test(str)) {
      return token.update(function () {
        return str.replace(/[`']$/, '');
      });
    }

    return token;

    // else if (/[a-z]\d+$/.test(str)) {
    //     return token.update(function () {
    //       return str.replace(/\d+$/, '');
    //     });
    //   } else {
    //     return token;
    //   }
  };

  lunr.Pipeline.registerFunction(pipelineFunction, 'remove');
  builder.pipeline.before(lunr.stemmer, pipelineFunction);
  // builder.searchPipeline.before(lunr.stemmer, pipelineFunction);
};
