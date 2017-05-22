/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* globals IdentityCredential */
import Chance from 'chance';

export default {
  controller: Ctrl,
  templateUrl: 'bedrock-angular-authn-did-test/test-harness-component.html'
};

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
    const chance = new Chance();
    IdentityCredential.register({
      idp: config.data.idp.owner.id,
      name: chance.guid(),
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
