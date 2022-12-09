const {config} = require('./shared.conf');

const projectName = 'functional-e2e-demo'

const sauceOptions = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  name: projectName,
  build: `${projectName}-${new Date().toISOString()}`
}

// ==================
// Specify Test Files
// ==================
config.specs =  ['./test/specs/functional-e2e.spec.js'],

// ===================
// Cloud Configuration
// ===================
config.hostname = 'ondemand.us-west-1.saucelabs.com'
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
  },
  {
    browserName: 'safari',
    platformName: 'macOS 10.15',
    browserVersion: 'latest',
    'sauce:options': {
      ...sauceOptions,
    },
  }
];

exports.config = config;