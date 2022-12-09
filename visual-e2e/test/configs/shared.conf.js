// More information about teh configuration file can be found here
// https://webdriver.io/docs/configurationfile.html
exports.config = {
  // ====================
  // Runner Configuration
  // ====================
  runner: 'local',

  // WDIO Settings
  logLevel: 'silent',
  bail: 0,
  baseUrl: 'https://saucedemo.steilergroup.net/',
  waitforTimeout: 10000,
  maxInstances: 10,
  connectionRetryTimeout: 5 * 60 * 1000,
  connectionRetryCount: 3,
  framework: 'jasmine',
  reporters: [],
  jasmineOpts: {
    defaultTimeoutInterval: 6000000,
  },
  services: [],
};
