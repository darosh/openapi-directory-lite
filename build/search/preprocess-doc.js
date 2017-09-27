var fs = require('fs');

var hexWords = fs.readFileSync('./build/search/hex-words.txt', 'utf8').split('\n').join('|');
var hexWordsRx = new RegExp('\\b(?!' + hexWords + ')([a-f0-9]+)\\b', 'gi');

module.exports = function (json) {
  var x = json.text.replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi, ' ');
  x = x.replace(/[-0-9a-f]{20,1000}/ig, ' ');
  x = x.replace(/([a-z])([A-Z])/g, '$1 $2');
  x = x.replace(/[>?¨"#—{}()[\]@_/|=.,;:\\]/g, ' ');
  x = x.replace(/\bc[0-9][0-9]+c\b/ig, ' ');
  x = x.replace(/([a-z])\d+\b/g, '$1 ');
  x = x.replace(/\b\d+([a-z])/g, ' $1');
  x = x.replace(/\b0x[0-9a-f]+\b/ig, ' ');
  x = x.replace(/\b\d+\b/g, ' ');
  x = x.replace(/\b[a-z0-9]+%[a-z0-9]+\b/ig, ' ');
  x = x.replace(/['`](ed|d|v|ll|r)\b/g, ' ');
  x = x.replace(/\b_/g, ' ');
  x = x.replace(/\b\d{8}T\d{6}Z\b/g, ' ');
  x = x.replace(/\./g, ' . ');
  x = x.replace(/\bx{1,1000}\b/gi, ' ');
  x = x.replace(/\b\w{20,1000}\b/g, ' ');
  x = x.replace(hexWordsRx, ' ');
  x = x.replace(/\b\w\b/g, ' ');
  x = x.replace(/\b\d\w+\b/g, ' ');

  json.text = x;
  json.length = x.length;
};
