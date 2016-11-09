/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
/* globals IdentityCredential */
define(['node-uuid'], function(uuid) {

'use strict';

function register(module) {
  module.component('brTestHarness', {
    controller: Ctrl,
    templateUrl: requirejs.toUrl(
      'bedrock-angular-authn-did-test/test-harness-component.html')
  });
}

/* @ngInject */
function Ctrl($scope, brAuthnService, config) {
  var self = this;
  self.showLogin = false;
  self.testData = {};
  self.resetIdentifier = 'alpha@bedrock.dev';

  self.authentication = {
    displayOrder: brAuthnService.displayOrder,
    methods: brAuthnService.methods
  };

  self.onLogin = function(identity) {
    self.testData = identity;
  };

  self.registerDid = function() {
    IdentityCredential.register({
      idp: config.data.idp.owner.id,
      name: uuid.v4(),
      agentUrl: config.data['authorization-io'].registerUrl
    }).then(function(didDocument) {
      if(!didDocument) {
        throw new Error('Decentralized identifier registration canceled.');
      }
      self.testData.didRegistration = 'success';
      $scope.$apply();
    });
  };
}

return register;

});
