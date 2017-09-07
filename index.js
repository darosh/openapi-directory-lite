const path = require('path');

const config = {
  api: 'https://darosh.github.io/openapi-directory-lite',
  index: 'index.json',
  specs: 'specs',
  ext: '.yaml'
};

const odl = module.exports = {
  ...config,
  fileName(key, value) {
    return `${[...key.split(':'), value.version].join('/')}${config.ext}`;
  },
  filePath(key, value) {
    return path.join(__dirname, config.specs, odl.fileName(key, value));
  },
  apiPath(key, value) {
    return `${config.api}/${config.specs}/${odl.fileName(key, value)}`;
  },
  data() {
    return require('./index.json')
  },
  filePaths() {
    const specs = odl.data().specs;
    const paths = [];

    for (const key in specs) {
      paths.push(odl.filePath(key, specs[key]));
    }

    return paths;
  },
  apiPaths() {
    const specs = odl.data().specs;
    const paths = [];

    for (const key in specs) {
      paths.push(odl.apiPath(key, specs[key]));
    }

    return paths;
  }
};
