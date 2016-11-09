/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var _ = require('lodash');
var async = require('async');
var bedrock = require('bedrock');
var config = bedrock.config;
var didio = require('did-io');
var jsigs = require('jsonld-signatures');
var request = require('request');
require('bedrock-protractor');
require('bedrock-authn-did');
require('bedrock-views');
require('./app.config');
require('./services.well-known');

// Register a DID for the mock IdP
// configure jsigs using local bedrock jsonld instance; will load
// contexts from local config when available
jsigs = jsigs({inject: {jsonld: bedrock.jsonld}});
// configure didio
didio = didio({inject: {jsonld: bedrock.jsonld}});

bedrock.events.on('bedrock.init', function(callback) {
  didio.use('async', async);
  didio.use('jsigs', jsigs);
  didio.use('request', request);
  didio.use('_', _);
  var options = {
    baseUrl: config.idp.owner.didRegistrationUrl,
    didDocument: config.idp.owner.didDocument,
    privateKeyPem: config.idp.owner.privateKey,
    strictSSL: config.idp.owner.registerWithStrictSSL
  };
  didio.registerDid(options, callback);
});

require('bedrock-test');
bedrock.start();
