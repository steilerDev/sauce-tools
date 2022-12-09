const {config} = require('./wdio.shared.conf');

// =====================
// Sauce specific config
// =====================
// See https://webdriver.io/docs/sauce-service.html for more information
config.user = process.env.SAUCE_USERNAME;
config.key = process.env.SAUCE_ACCESS_KEY;
config.region = process.env.REGION || 'us';

// ===================================================================================
// Capabilities
// You can find more about constructing the capabilities for real device testing here
// https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
//
// All test configuration options and W3C compliant options can be found here
// https://wiki.saucelabs.com/display/DOCS/Test+Configuration+Options
//
// To read more about W3C and Sauce Labs please check
// https://wiki.saucelabs.com/display/DOCS/W3C+Capabilities+Support
// ===================================================================================
const _build = `rdc-web-camera-injection-${new Date().getTime()}`
const _name = 'rdc-web-camera-injection'
config.capabilities = [
  /**
   * Android 12
   */
  {
    platformName: 'Android',
    browserName: 'Chrome',
    'appium:deviceName': 'Google.*',
    'appium:automationName': 'UiAutomator2',
    'appium:platformVersion': '12',
    'appium:autoGrantPermissions': true,
    'sauce:options': {
      build: _build,
      name: _name,
    }
  },
  /**
   * Android 10
   */
   {
    platformName: 'Android',
    browserName: 'Chrome',
    'appium:deviceName': 'Google.*',
    'appium:automationName': 'UiAutomator2',
    'appium:platformVersion': '10',
    'appium:autoGrantPermissions': true,
    'sauce:options': {
      build: _build,
      name: _name,
    }
  },
  /**
   * iOS
   */
  {
    platformName: 'iOS',
    browserName: 'Safari',
    'appium:deviceName': 'iPhone.*',
    'appium:platformVersion': '16',
    'appium:automationName': 'XCUITest',
    'appium:autoAcceptAlerts': true,
    'sauce:options': {
      build: _build,
      name: _name,
    }
  }
];

config.services = config.services.concat('sauce');

exports.config = config;
