/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
var api = {};
module.exports = api;

api.isInternetExplorer = function() {
  return browser.getCapabilities().then(function(b) {
    return b.get('browserName') === 'internet explorer';
  });
};
