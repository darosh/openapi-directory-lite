const fs = require('fs')
const _ = require('lodash')
const compactJson = require('json-stringify-pretty-compact')
const data = require('../../data')
const paths = data.filePaths()

const textFields = {
  description: true,
  summary: true,
  name: true,
  title: true
}

const method = {
  get: true,
  post: true,
  put: true,
  patch: true,
  delete: true,
  options: true,
  head: true
}

const arr = []

paths.forEach(p => {
  const spec = JSON.parse(fs.readFileSync(p.path, 'utf8'))
  removeText(spec)

  const r = {}
  r.key = p.key.split(':')
  r.root = r.key[0].replace(/.*\.([a-z]+)$/i, '$1')
  r.schema = spec.schemes.length === 1 ? spec.schemes[0] : 'both'
  const produces = _.uniq(_.uniq(_.compact(_.flattenDeep(collect(spec, 'produces')))).map(x => x.replace(/;.*/, '').replace(/.*\//, '')))
  r.produces = produces.length ? produces : undefined
  r.tags = (spec.tags || []).length
  r.definitions = Object.keys(spec.definitions || {}).length
  r.descriptions = count(spec, 'description')
  r.descriptionsLength = sum(spec, 'description')
  r.summaries = count(spec, 'summary')
  r.summariesLength = sum(spec, 'summary')
  r.paths = Object.keys(spec.paths).length
  r.methods = getMethods(spec)
  r.categories = spec.info['x-apisguru-categories']
  r.language = spec.info['x-description-language']
  arr.push(r)
})

fs.writeFileSync('./stats/index.json', compactJson(arr, {maxLength: 1e4}))

function getMethods (spec) {
  const methods = {}

  Object.keys(spec.paths).forEach(p => {
    Object.keys(method).forEach(m => {
      if (spec.paths[p][m]) {
        methods[m] = methods[m] || 0
        methods[m]++
      }
    })
  })

  return methods
}

function removeText (obj) {
  Object.keys(obj).forEach(k => {
    if (textFields[k] && (typeof obj[k] === 'string')) {
      obj[k] = obj[k].length
    } else if (obj[k] && (typeof obj[k] === 'object')) {
      removeText(obj[k])
    }
  })
}

function count (obj, field, ret = {value: 0}) {
  Object.keys(obj).forEach(k => {
    if (k === field) {
      ret.value++
    }

    if (obj[k] && (typeof obj[k] === 'object')) {
      count(obj[k], field, ret)
    }
  })

  return ret.value
}

function sum (obj, field, ret = {value: 0}) {
  Object.keys(obj).forEach(k => {
    if (k === field) {
      ret.value += typeof obj[k] === 'number' ? obj[k] : 0
    }

    if (obj[k] && (typeof obj[k] === 'object')) {
      sum(obj[k], field, ret)
    }
  })

  return ret.value
}

function collect (obj, field, ret = []) {
  Object.keys(obj).forEach(k => {
    if (k === field) {
      ret.push(obj[k])
    }

    if (obj[k] && (typeof obj[k] === 'object')) {
      collect(obj[k], field, ret)
    }
  })

  return ret
}
