/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
define([], function() {

'use strict';

function register(module) {
  module.service('brDidService', factory);
}

/* @ngInject */
function factory($http) {
  var service = {};

  service.login = function(authData) {
    // TODO: make URL configurable
    return Promise.resolve($http.post('/authn/did/login', authData))
      .then(function(response) {
        return response.data;
      });
  };

  return service;
}

return register;

});
