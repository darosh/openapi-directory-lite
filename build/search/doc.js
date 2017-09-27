var Converter = require('showdown').Converter;
var SAXParser = require('parse5').SAXParser;

const converter = new Converter();

converter.setFlavor('github');

function htmlText(html) {
  let TEXT = '';
  const sax = new SAXParser();

  sax.on('text', (t) => {
    TEXT += t;
  });

  sax.write(html);

  return TEXT;
}

module.exports = function (json, index, key) {
  var text;

  if (json.info['x-description-language'] && (json.info['x-description-language'] !== 'jp')) {
    text = json.info.title
  } else {
    text = iterate(json).map(t => htmlText(converter.makeHtml(t))).join('\n\n');
  }

  return {
    index,
    key,
    length: text.length,
    text
  }
};

var indexable = {description: true, summary: true, name: true, title: true};
var skip = {};

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
