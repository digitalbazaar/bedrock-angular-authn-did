/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* global navigator */
export default {
  bindings: {
    sysIdentifier: '@brIdentity',
    onLogin: '&brOnLogin',
    onNotRegistered: '&?brOnNotRegistered'
  },
  controller: Ctrl,
  templateUrl: 'bedrock-angular-authn-did/did-component.html'
};

/* @ngInject */
function Ctrl($q, $scope, brAlertService, brDidService, config) {
  var self = this;
  self.loading = false;

  $scope.$on('brAuthnDid.login', function() {
    self.login();
  });

  self.login = function() {
    self.loading = true;
    const credentialQuery = {
      web: {
        VerifiableProfile: {
          '@context': 'https://w3id.org/identity/v1',
          id: self.sysIdentifier || '',
          publicKey: ''
        },
        mediatorUrl: config.data['authorization-io'].baseUri
      }
    };
    if(self.onNotRegistered) {
      // TODO: reconsider design for this feature
      credentialQuery.web.enableRegistration = true;
    }
    $q.resolve(navigator.credentials.get(credentialQuery))
      .then(function(credential) {
        if(credential === null) {
          return $q.reject(new Error('Login canceled.'));
        }
        return brDidService.login(credential.data);
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
