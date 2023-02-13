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
    browserVersion: '109',
    'sauce:options': {
        ...sauceOptions,
    },
    'sauce:visual': {
        ...visualOptions,
        viewportSize: '393x830' // Actual resolution: '1080x2280' but CSS pixel ration of 2.75
    }
  },
  {
    browserName: 'chrome',
    platformName: 'windows 10',
    browserVersion: '109',
    'sauce:options': {
        ...sauceOptions,
    },
    'sauce:visual': {
        ...visualOptions,
        viewportSize: '1920x1080'
    }
  },
  {
    browserName: 'safari',
    platformName: 'macOS 10.15',
    browserVersion: '13.1',
    'sauce:options': {
      ...sauceOptions,
    },
    'sauce:visual': {
      ...visualOptions,
      viewportSize: '375x812' // Actual resolution: '1125x2436' but CSS Pixel Ratio of 3
    }
  },
  {
    browserName: 'safari',
    platformName: 'macOS 10.15',
    browserVersion: '13.1',
    'sauce:options': {
      ...sauceOptions,
    },
    'sauce:visual': {
      ...visualOptions,
      viewportSize: '1920x1080'
    }
  }
];

exports.config = config;