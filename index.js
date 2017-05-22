/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
import angular from 'angular';
import DidComponent from './did-component.js';
import DidService from './did-service.js';

var module = angular.module(
  'bedrock.authn-did', ['bedrock.alert', 'bedrock.authn', 'bedrock.modal']);

module.component('brAuthnDid', DidComponent);
module.service('brDidService', DidService);

/* @ngInject */
module.run(function(brAuthnService) {
  var options = {
    template: 'bedrock-angular-authn-did/did.html'
  };
  brAuthnService.register('authn-did', options);
});
