/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* globals should */
var bedrock = global.bedrock;
var protractor = global.protractor;
var EC = protractor.ExpectedConditions;

var authnDid = bedrock.pages['bedrock-angular-authn-did'].did;

describe('bedrock-angular-authn-did', () => {
  before(() => {
    bedrock.get('/');
    var registerDidButton = element(by.buttonText('Register DID'));
    browser.wait(EC.elementToBeClickable(registerDidButton), 3000);
    registerDidButton.click();
    authnDid.registerDid({password: 'Password'});
  });
  it('should log in with a DID', () => {
    authnDid.loginDid({quickIdentity: true});
    $('pre').getText().then(text => {
      var i = JSON.parse(text);
      i.should.be.an('object');
      should.exist(i['@context']);
      i['@context'].should.equal('https://w3id.org/identity/v1');
      should.exist(i.id);
      i.id.should.be.a('string');
      i.id.indexOf('did:').should.equal(0);
      should.exist(i.type);
      i.type.should.equal('Identity');
      should.exist(i.credential);
      i.credential.should.be.an('array');
      i.credential.should.have.length(1);
    });
  });
  it('displays an error if AIO login is cancelled', () => {
    authnDid.loginDid({cancel: true});
    var brError = $('.br-alert-area-fixed-show');
    browser.wait(EC.visibilityOf(brError), 3000);
    brError.isDisplayed().should.eventually.be.true;
    brError.getText().should.eventually.contain('Login canceled.');
  });
});
