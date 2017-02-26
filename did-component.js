/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* globals requirejs */
define([], function() {

'use strict';

function register(module) {
  module.component('brAuthnDid', {
    bindings: {
      sysIdentifier: '@brIdentity',
      onLogin: '&brOnLogin',
      onNotRegistered: '&?brOnNotRegistered'
    },
    controller: Ctrl,
    templateUrl:
      requirejs.toUrl('bedrock-angular-authn-did/did-component.html')
  });
}

/* @ngInject */
function Ctrl($q, $scope, brAlertService, brDidService, config) {
  var self = this;
  self.loading = false;

  $scope.$on('brAuthnDid.login', function() {
    self.login();
  });

  self.login = function() {
    self.loading = true;
    var identityQuery = {
      identity: {
        query: {
          '@context': 'https://w3id.org/identity/v1',
          id: self.sysIdentifier || '',
          publicKey: ''
        },
        agentUrl: config.data['authorization-io'].agentUrl
      }
    };
    if(self.onNotRegistered) {
      identityQuery.identity.enableRegistration = true;
    }
    $q.resolve(navigator.credentials.get(identityQuery))
      .then(function(credential) {
        if(credential === null) {
          return $q.reject(new Error('Login canceled.'));
        }
        return brDidService.login(credential.identity);
      }).catch(function(err) {
        if(self.onNotRegistered && err.message === 'NotRegisteredError') {
          return self.onNotRegistered();
        }
        return $q.reject(err);
      }).then(function(identity) {
        if(!identity) {
          return;
        }
        return self.onLogin({identity: identity});
      }).catch(function(err) {
        brAlertService.add('error', err, {scope: $scope});
      }).then(function() {
        self.loading = false;
      });
  };
}

return register;

});
