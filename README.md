# OpenAPI Directory Lite

> Lite version of [OpenAPI Directory](https://github.com/APIs-guru/openapi-directory) API

* published via GitHub pages from master branch
* entry point: https://darosh.github.io/openapi-directory-lite/index.json
* smaller footprint than APIs.guru API: https://api.apis.guru/v2/list.json
* JSON specs only (YAML is smaller, but not gzipped on GitHub pages)
* github.io CORS
* JavaScript API for spec api paths construction, see [index.js](./index.js)
* install from GitHub via `npm install darosh/openapi-directory-lite` 
* 500+ specs, ~50 MB (7 MB gzipped)
* prebuilt [lunr.js](https://lunrjs.com/) full text search index: https://darosh.github.io/openapi-directory-lite/search/index.json
* full text search test page: https://darosh.github.io/openapi-directory-lite/search/ 
* made for: https://github.com/darosh/oax
