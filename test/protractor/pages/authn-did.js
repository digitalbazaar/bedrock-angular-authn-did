/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
/* globals expect */
var bedrock = global.bedrock;
var helpers = require('./helpers');

var api = {};
module.exports = api;

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

api.registerDid = function(options) {
  // wait for AIO window to open
  browser.sleep(2000);
  helpers.isInternetExplorer().then(function(isIe) {
    if(isIe) {
      var iframe = by.tagName('iframe');
      var el = browser.driver.findElement(iframe);
      browser.switchTo().frame(el);
      return;
    }
    browser.wait(function() {
      return browser.getAllWindowHandles().then(function(handles) {
        // There should be two windows open now
        if(handles.length === 2) {
          return true;
        }
      });
    }, 30000);
    bedrock.selectWindow(1);
    browser.driver.getCurrentUrl().should.eventually.contain('authorization');
  });
  browser.wait(EC.visibilityOf(element(by.tagName('aio-register-did'))), 30000);
  element(by.brModel('$ctrl.passphrase')).sendKeys(options.password);
  element(by.brModel('$ctrl.passphraseConfirmation'))
    .sendKeys(options.password);
  var registerButton = element(by.buttonText('Register'));
  browser.wait(EC.elementToBeClickable(registerButton), 3000);
  registerButton.click();
  helpers.isInternetExplorer().then(function(isIe) {
    if(isIe) {
      browser.switchTo().defaultContent();
      // NOTE: unable to find any way of detecting when the iframe is removed
      browser.sleep(10000);
      return;
    }
    browser.wait(function() {
      return browser.getAllWindowHandles().then(function(handles) {
        // there should only be one window open after AIO is finished
        if(handles.length === 1) {
          return true;
        }
      });
    }, 45000);
    bedrock.selectWindow(0);
  });
};

api.loginDid = function(options) {
  if(!options.skipSignIn) {
    browser.wait(
      EC.elementToBeClickable(element(by.buttonText('Sign In')), 15000));
    element(by.buttonText('Sign In')).click();
  }
  var didLogin = element(by.partialButtonText('Decentralized Identity'));
  browser.wait(EC.elementToBeClickable(didLogin), 3000);
  didLogin.click();
  browser.sleep(2000);
  helpers.isInternetExplorer().then(function(isIe) {
    if(isIe) {
      var iframe = by.tagName('iframe');
      var el = browser.driver.findElement(iframe);
      browser.switchTo().frame(el);
      return;
    }
    browser.wait(function() {
      return browser.getAllWindowHandles().then(function(handles) {
        // There should be two windows open now
        if(handles.length === 2) {
          return true;
        }
      });
    }, 30000);
    bedrock.selectWindow(1);
    browser.driver.getCurrentUrl().should.eventually.contain('authorization');
  });

  // user action
  if(options.cancel) {
    $('a.close').click();
  } else {
    element.all(by.repeater('(id, identity) in ctrl.identities'))
      .then(function(identities) {
        identities[0].click();
      });
    if(!options.quickIdentity) {
      element(by.brModel('ctrl.password')).sendKeys(options.password);
      element(by.buttonText('Login')).click();
    }
  }

  helpers.isInternetExplorer().then(function(isIe) {
    if(isIe) {
      browser.switchTo().defaultContent();
      // NOTE: unable to find any way of detecting when the iframe is removed
      browser.sleep(10000);
      return;
    }
    browser.wait(function() {
      return browser.getAllWindowHandles().then(function(handles) {
        // there should only be one window open after AIO is finished
        if(handles.length === 1) {
          return true;
        }
      });
    }, 45000);
    bedrock.selectWindow(0);
  });
};
