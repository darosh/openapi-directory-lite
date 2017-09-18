var path = require('path')

var config = {
  api: 'https://darosh.github.io/openapi-directory-lite',
  index: 'index.json',
  specs: 'specs',
  ext: '.json'
}

function fileName (key, value) {
  // return `${[...key.split(':'), value.version].join('/')}${config.ext}`
  return key.split(':').concat(value.version).join('/') + config.ext
}

function filePath (key, value) {
  return path.join(__dirname, config.specs, fileName(key, value))
}

function apiPath (key, value) {
  // return `${config.api}/${config.specs}/${fileName(key, value)}`
  return config.api + '/' + config.specs + '/' + fileName(key, value)
}

function indexPath () {
  // return `${config.api}/${config.index}`
  return config.api + '/' + config.index
}

module.exports.apiPath = apiPath
module.exports.indexPath = indexPath
module.exports.filePath = filePath
module.exports.fileName = fileName
module.exports.config = config
