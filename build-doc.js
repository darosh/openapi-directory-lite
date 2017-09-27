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
  // var d = json.info.description ? text(converter.makeHtml(json.info.description)).replace(/([a-z])([A-Z])/g, '$1 $2') : null;
  var m;

  if (json.info['x-description-language'] && (json.info['x-description-language'] !== 'jp')) {
    m = json.info.title
  } else {
    m = text(converter.makeHtml(iterate(json).join('\n\n')));
  }

  // if(m.length > 250) {
  //   m = m.substr(0, 250)
  // }

  m = m.replace(/([a-z])([A-Z])/g, '$1 $2');
  m = m.replace(/([a-z])[_/|=]([a-z])/g, '$1 $2');
  m = m.replace(/([a-z])\d+\b/g, '$1 ');
  m = m.replace(/\b0x[0-9a-f]+\b/ig, ' ');
  m = m.replace(/\b\d+\b/g, ' ');
  m = m.replace(/'s\b/g, ' ');
  m = m.replace(/\b_/g, ' ');
  m = m.replace(/\b\d{8}T\d{6}Z\b/g, ' ');
  m = m.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi, ' ');
  m = m.replace(/\./g, '. ');

  return {
    i,
    // t: json.info.title,
    // d,
    x: m
    // m
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
