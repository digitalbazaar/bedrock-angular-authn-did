var pages = global.bedrock.pages || {};

pages.authn = pages.authn || {};
pages.authn.did = require('./authn-did');

module.exports = global.bedrock.pages = pages;
