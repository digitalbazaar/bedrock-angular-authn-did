/*!
 * Copyright (c) 2016-2017 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
var config = bedrock.config;
var path = require('path');

// mongodb config
config.mongodb.name = 'bedrock_angular_authn_did_test';
config.mongodb.host = 'localhost';
config.mongodb.port = 27017;
config.mongodb.local.collection = 'bedrock_angular_authn_did_test';
// drop all collections on initialization
config.mongodb.dropCollections = {};
config.mongodb.dropCollections.onInit = true;
config.mongodb.dropCollections.collections = [];

config.protractor.config.suites['general'] =
  path.join(__dirname, 'protractor', 'tests', '**', '*.js');

// default multiCapabilities, used with Sauce Labs
var caps = config.sauceLabs.capabilities;
config.sauceLabs.multiCapabilities = [
  caps.linux.firefox, caps.linux.chrome, caps.osx1011.safari,
  caps.osx1010.safari, caps.windows10.ie
];
