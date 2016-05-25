/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([
  'angular',
  './did-component',
  './did-service'
], function(angular) {

'use strict';

var module = angular.module(
  'bedrock.authn-did', ['bedrock.alert', 'bedrock.authn']);

Array.prototype.slice.call(arguments, 1).forEach(function(register) {
  register(module);
});

/* @ngInject */
module.run(function(brAuthnService) {
  var options = {
    template: requirejs.toUrl('bedrock-angular-authn-did/did.html')
  };
  brAuthnService.register('authn-did', options);
});

});
