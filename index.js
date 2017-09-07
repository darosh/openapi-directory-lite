var path = require('path')

var config = {
  api: 'https://darosh.github.io/openapi-directory-lite',
  index: 'index.json',
  specs: 'specs',
  ext: '.yaml'
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

function data () {
  return require('./index.json')
}

function filePaths () {
  var specs = data().specs
  var paths = []

  for (var key in specs) {
    paths.push(filePath(key, specs[key]))
  }

  return paths
}

function apiPaths () {
  var specs = data().specs
  var paths = []

  for (var key in specs) {
    paths.push(apiPath(key, specs[key]))
  }

  return paths
}

module.exports.apiPath = apiPath
module.exports.indexPath = indexPath
module.exports.filePaths = filePaths
module.exports.filePath = filePath
module.exports.apiPaths = apiPaths
module.exports.fileName = fileName
module.exports.data = data
module.exports.config = config
