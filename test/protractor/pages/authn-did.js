/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
/* jshint -W030 */

var bedrock = global.bedrock;

var api = {};
module.exports = api;

var by = global.by;
var element = global.element;
var should = global.should;
var expect = global.expect;
var protractor = global.protractor;

var EC = protractor.ExpectedConditions;

api.COMPONENT_TAG = 'br-authn-did';
api.AUTHIO_COMPONENT_TAG = 'aio-identity-chooser';
api.AUTHIO_ADD_COMPONENT_TAG = 'aio-add-identity-modal';
api.NEW_REGISTER_COMPONENT_TAG = "br-authn-password";

// Must be in the authio login page before calling.
// See api.openAuthio()
// FIXME: Only cookied users can log in, as they get auto-logged in;
// add support for non-cookied users.
api.login = function(options) {
  var component = element(by.tagName(api.AUTHIO_COMPONENT_TAG));
  bedrock.waitForElement(component);
  bedrock.waitForElementToShow(component.element(by.tagName('ul')));
  var identities =
    component.all(by.repeater('(id, identity) in ctrl.identities'));
  expect(identities.count()).to.eventually.be.above(0);
  // Finds element by inner text using this xpath selector.
  // TODO: Move to a helper method (this should be used sparingly, though --
  //       text lookups are finnicky in test suites).
  var identity = component.element(by.xpath('.//*[.="' + options.email + '"]'));
  identity.click();
  if(options.authioRegister) {
    api.authioRegister(options);
  } else {
    // TODO: add password login for non-cookied users
  }
  bedrock.waitForPopupClose(1);
  bedrock.selectWindow(0);
  bedrock.waitForUrl('/i/' + options.name + '/dashboard');
  bedrock.waitForAngular();
};

// Must be called when registering an identity with authio
// for the first time, i.e. on an incognito login
api.authioRegister = function(options) {
  var frame = element(by.tagName('iframe'));
  bedrock.waitForElement(frame);
  // Must explicitly change to the iframe that authio
  // hosts, in this case the iframe's name attribute is set
  // to "repo". browser.switchTo() can only run once the frame is
  // present on the page.
  browser.switchTo().frame('repo');
  bedrock.waitForAngular();

  var registerComponent =
    element(by.tagName(api.NEW_REGISTER_COMPONENT_TAG));
  bedrock.waitForElement(registerComponent);
  registerComponent.element(
    by.brModel('$ctrl.sysIdentifier')).sendKeys(options.email);
  registerComponent.element(
    by.brModel('$ctrl.password')).sendKeys(options.password);
  registerComponent.element(by.partialButtonText('Sign In')).click();
};

// Must be in the auth.io window before calling.
// See api.openAuthio()
api.incognitoLogin = function(options) {
  var identities =
    element.all(by.repeater('(id, identity) in ctrl.identities'));
  expect(identities.count()).to.eventually.equal(0);
  element(by.attribute('ng-click', 'ctrl.showAddIdentityModal=true')).click();
  bedrock.waitForModalTransition();
  var modal = element(by.tagName(api.AUTHIO_ADD_COMPONENT_TAG));
  bedrock.waitForElement(modal);
  modal.element(by.brModel('model.email')).sendKeys(options.email);
  modal.element(by.brModel('model.passphrase')).sendKeys(options.password);
  modal.element(by.model('model.permanent')).click();
  modal.element(by.partialButtonText('Add')).click();
  browser.wait(EC.invisibilityOf(modal), 3000);
  // api.login needs to register the incognito identity
  // with authio for the first time.
  options.authioRegister = true;
  api.login(options);
};

api.openAuthio = function() {
  var component = element(by.tagName(api.COMPONENT_TAG));
  expect(component.isPresent()).to.eventually.be.true;
  component.element(by.attribute('ng-click', '$ctrl.login()')).click();
  // Wait for auth.io window
  bedrock.selectWindow(1);
  browser.driver.getCurrentUrl()
    .should.eventually.contain('authorization.dev');
  bedrock.waitForAngular();
  bedrock.waitForElement(element(by.tagName(api.AUTHIO_COMPONENT_TAG)));
};

api.closeAuthio = function() {
  browser.driver.close();
  bedrock.waitForPopupClose(1);
  bedrock.selectWindow(0);
};

// Clears storage in the authio window. Must be in the authio window.
// See api.openAuthio()
api.clearStorage = function() {
  browser.executeScript('window.localStorage.clear();');
};
