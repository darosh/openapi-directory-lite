var lunr = require('lunr');
var fs = require('fs');
var data = require('../../search/preprocessed.json');

process.on('SIGINT', function() {
  save();
  process.exit();
});

const index = lunr(function () {
  // this.use(remove);
  this.ref('i');
  this.field('x');

  var args = (process.argv[2] || '').split(',');
  var first = parseInt(args[0]) || 0;
  var last = parseInt(args[1]) || data.length - 1;
  var begin = first >= 0 ? first : (data.length + first);
  var end = (first >= 0 && last >= 0)
    ? last
    : (first >= 0 && last < 0)
      ? data.length + last
      : (first < 0 && last <= 0)
        ? data.length + last
        : last;

  console.log('(' + first + ', ' + last + ') => [' + begin + ', ' + end + ']');

  for (var i = begin; i <= end; i++) {
    var json = {i: data[i].index, x: data[i].text};
    console.log(data[i].key + ' #' + (i + 1));
    this.add(json);
  }
});

function save() {
  var ser = index.toJSON();
  fs.writeFileSync('./search/index.json', JSON.stringify(ser));
}

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
}
