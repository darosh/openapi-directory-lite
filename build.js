#!/usr/bin/env node
'use strict';

var Path = require('path');
var assert = require('assert');

var _ = require('lodash');
var URI = require('urijs');
var sh = require('shelljs');
var Promise = require('bluebird');
var util = require('openapi-directory/scripts/util');
var jsonStr = require('json-stringify-pretty-compact');

function deployDir(path) {
    assert(_.isString(path) && path[0] !== '/');
    return Path.join(path);
}

function rootUrl(url) {
    assert(_.isString(url) && url[0] !== '/');
    return URI('../' + url).href();
}

sh.set('-e');
sh.set('-v');

// sh.mkdir(deployDir(''));

// var apisGuruSwagger = util.readYaml('resources/apis_guru_swagger.yaml');
// var baseUrl = URI(rootUrl(''));
// apisGuruSwagger.schemes = [baseUrl.scheme()];
// apisGuruSwagger.host = baseUrl.host();
// apisGuruSwagger.basePath = baseUrl.path();

var specs = util.getSpecs('node_modules/openapi-directory/APIs/');

function save(path, json) {
    json.spec = util.sortJson(json.spec);
    util.saveFile(path, jsonStr(json, {maxLength: 240}) + '\n');
}

buildApiList(specs)
    .then(function (apiList) {
        console.log('Generated list for ' + _.size(apiList) + ' API specs.');

        var index = {
            total: Object.keys(apiList).length,
            categories: util.readYaml('node_modules/openapi-directory/resources/categories.yaml'),
            specs: apiList
        };

        for(var cat in index.categories) {
            index.categories[cat].count =  _.values(index.specs).filter((i) => ((i.categories||[]).indexOf(cat) > -1)).length;

            index.categories[cat] = {count: index.categories[cat].count, title: index.categories[cat].title, description: index.categories[cat].description}

            if(index.categories[cat].description === index.categories[cat].title) {
                delete index.categories[cat].description;
            }

            if(!index.categories[cat].count) {
                delete index.categories[cat]
            }
        }

        save(deployDir('index.json'), index);
    })
    .done();

function buildApiList(specs) {
    return Promise.coroutine(function* () {
        var apiList = {};

        for (var filename in specs) {
            var swagger = specs[filename];

            _.defaults(swagger.info, {'x-preferred': true});

            if (swagger.info['x-preferred']) {
                addSwagger(apiList, swagger, filename);
            }
        }
        return apiList;
    })();
}

function addSwagger(apiList, swagger, filename) {
    var id = util.getApiId(swagger);
    var apiEntry = apiList[id] = apiList[id] || {};
    var versionEntry = buildVersionEntry(swagger, filename);

    apiEntry.version = versionEntry.version;
    apiEntry.categories = versionEntry.info['x-apisguru-categories'];
    apiEntry.title = versionEntry.info.title;

    return apiEntry;
}

function buildVersionEntry(swagger) {
    var basename = 'specs/' + util.getSwaggerPath(swagger, 'swagger');
    var name = util.getSwaggerPath(swagger).split('/');
    var version = name[name.length - 2];
    name = name[0] + '/' + name.slice(1, name.length - 1).join('-');

    util.saveYaml(deployDir(`spec/${name}.yaml`), swagger);

    return {
        swaggerUrl: rootUrl(`${basename}.json`),
        swaggerYamlUrl: `${name}`,
        version: version,
        info: swagger.info,
        externalDocs: swagger.externalDocs,
    };
}
