// More information about teh configuration file can be found here
// https://webdriver.io/docs/configurationfile.html
exports.config = {
  // ====================
  // Runner Configuration
  // ====================
  runner: 'local',
  // ==================
  // Specify Test Files
  // ==================
  specs: ['./test/specs/image-injection.spec.js'],
  // ============
  // Capabilities
  // ============
  maxInstances: 10,
  // capabilities can be found in the `wdio.saucelabs.conf.js`
  // ===================
  // Test Configurations
  // ===================
  logLevel: 'silent',
  bail: 0,
  baseUrl: 'https://demo.pla.health/',
  waitforTimeout: 10000,
  // A timeout of 5 min
  connectionRetryTimeout: 5 * 60 * 1000,
  connectionRetryCount: 3,
  framework: 'jasmine',
  reporters: ['spec'],
  jasmineOpts: {
    defaultTimeoutInterval: 6000000,
    //defaultTimeoutInterval: 60000,
  },
  services: [],
};
