/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
/* @ngInject */
export default function factory($http, config) {
  var service = {};

  service.login = function(authData) {
    return $http.post(config.data['authn-did'].login.basePath, authData)
      .then(function(response) {
        return response.data;
      });
  };

  return service;
}
