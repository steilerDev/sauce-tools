const {config} = require('./shared.conf');

const projectName = 'visual-e2e-demo'

const sauceOptions = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  name: projectName,
  build: `${projectName}-${new Date().toISOString()}`
}

const visualOptions = {
  apiKey: process.env.SCREENER_API_KEY,
  projectName: `${projectName}`,
  branch: 'main'
}  

// ==================
// Specify Test Files
// ==================
config.specs =  ['./test/specs/visual-e2e.spec.js'],

// ===================
// Cloud Configuration
// ===================
config.hostname = 'hub.screener.io'
config.port = 443
config.protocol = 'https'
config.path = '/wd/hub'

config.capabilities = [
  {
    browserName: 'chrome',
    platformName: 'windows 10',
    browserVersion: 'latest',
    'sauce:options': {
        ...sauceOptions,
    },
    'sauce:visual': {
        ...visualOptions,
        viewportSize: '1366x768'
    }
  },
  {
    browserName: 'safari',
    platformName: 'macOS 10.15',
    browserVersion: 'latest',
    'sauce:options': {
      ...sauceOptions,
    },
    'sauce:visual': {
      ...visualOptions,
      viewportSize: '375x812'
    }
  }
];

exports.config = config;