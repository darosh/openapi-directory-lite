var Converter = require('showdown').Converter;
var SAXParser = require('parse5').SAXParser;

const converter = new Converter();

converter.setFlavor('github');

function text(html) {
  let TEXT = '';
  const sax = new SAXParser();

  sax.on('text', (t) => {
    TEXT += t;
  });

  sax.write(html);

  return TEXT;
}

module.exports = function (json, i) {
  var d = json.info.description ? text(converter.makeHtml(json.info.description)) : null;
  var m = text(converter.makeHtml(iterate(json).join('\n\n')));
  return {
    i,
    t: json.info.title,
    d,
    m
  }
};

var indexable = {description: true, summary: true, name: true};
var skip = {info: true};

function iterate(obj, ret = []) {
  if (obj && (typeof obj === 'object')) {
    Object.keys(obj).forEach(key => {
      if (!skip[key]) {
        if (indexable[key] && (typeof obj[key] === 'string')) {
          ret.push(obj[key])
        } else if (typeof obj[key] === 'object') {
          iterate(obj[key], ret)
        }
      }
    });
  }

  return ret
}
