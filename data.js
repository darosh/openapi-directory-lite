var odl = require('./index')

function data () {
  return require('./index.json')
}

function filePaths () {
  var specs = data().specs
  var paths = []

  for (var key in specs) {
    paths.push({key, path: odl.filePath(key, specs[key])})
  }

  return paths
}

function apiPaths () {
  var specs = data().specs
  var paths = []

  for (var key in specs) {
    paths.push(odl.apiPath(key, specs[key]))
  }

  return paths
}

module.exports.filePaths = filePaths
module.exports.apiPaths = apiPaths
module.exports.data = data
