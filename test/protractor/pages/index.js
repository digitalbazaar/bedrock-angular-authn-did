/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */

var pages = global.bedrock.pages || {};

pages['bedrock-angular-authn-did'] = {};
pages['bedrock-angular-authn-did'].did = require('./authn-did');

module.exports = global.bedrock.pages = pages;
