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
  var x;

  if (json.info['x-description-language'] && (json.info['x-description-language'] !== 'jp')) {
    x = json.info.title
  } else {
    x = iterate(json).map(t => text(converter.makeHtml(t))).join('\n\n');
  }

  x = x.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi, ' ');
  x = x.replace(/([a-z])([A-Z])/g, '$1 $2');
  x = x.replace(/["—{}()[\]@_/|=.,;:\\]/g, ' ');
  x = x.replace(/([a-z])\d+\b/g, '$1 ');
  x = x.replace(/\b\d+([a-z])/g, ' $1');
  x = x.replace(/\b0x[0-9a-f]+\b/ig, ' ');
  x = x.replace(/\b\d+\b/g, ' ');
  x = x.replace(/\b[a-z0-9]+%[a-z0-9]+\b/ig, ' ');
  x = x.replace(/'s\b/g, ' ');
  x = x.replace(/`s\b/g, ' ');
  x = x.replace(/'[dv]\b/g, ' ');
  x = x.replace(/\b_/g, ' ');
  x = x.replace(/\b\d{8}T\d{6}Z\b/g, ' ');
  x = x.replace(/\./g, ' . ');
  x = x.replace(/\b\w{20,1000}\b/g, ' ');
  x = x.replace(/\b\w\b/g, ' ');
  x = x.replace(/\b\d\w+\b/g, ' ');

  return {
    i,
    x
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
