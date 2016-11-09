/*!
 * Copyright (c) 2016 Digital Bazaar, Inc. All rights reserved.
 */
var bedrock = require('bedrock');
var config = bedrock.config;
var path = require('path');

// mongodb config
config.mongodb.name = 'bedrock_angular_authn_did_app';
config.mongodb.host = 'localhost';
config.mongodb.port = 27017;
config.mongodb.local.collection = 'bedrock_angular_authn_did_app';

var dir = path.join(__dirname);
config.requirejs.bower.packages.push({
  path: path.join(dir, 'components'),
  manifest: path.join(dir, 'bower.json')
});

var parentDir = path.join(__dirname, '..');
config.requirejs.bower.packages.push({
  path: path.join(parentDir),
  manifest: path.join(parentDir, 'bower.json')
});

// Configure mock IdP
// configure did for this IDP here
config.idp = {};
config.idp.owner = {
  id: 'did:c6ba002b-b07c-4384-9aeb-0ce7014b6f99'
};
var publicKey = {
  id: config.idp.owner.id + '/keys/1'
};

// FIXME: store this securely
config.idp.owner.privateKey =
  '-----BEGIN RSA PRIVATE KEY-----\n' +
  'MIIEogIBAAKCAQEAvInNMW0FYD0F8YnLleuCFL/PAlCjE5cyDb9MfSn7iMIpaEIj\n' +
  'KNG8N90m5z2txEOg0DXfzIDJ1T8mU3trWFATRfjRqykFjAUzTx9CQvG9U/PZecKA\n' +
  'QQKuSVxmEqMvUCH0H2ari+YRn+rEg1vuWOvf7vvhjtCwdmOHKDSMf/s3uv4tTNt8\n' +
  'ZNg18k87ITWvD0AT+fHDWAFP7860T3n4Oeb7ElaNE3/txbaiPLKaPgcO2eu15CHA\n' +
  'lMSQ2oWURrX7gM18aJpZin42naqa0MLxmgvA3t5gjElQZlagjYwE09ouegC0auqL\n' +
  'SfQ5XXYKN3z1iWcn5o9cTHRBz1OcjXRUk1/5rwIDAQABAoIBAEA5nQmqPruS7hRi\n' +
  'wVRXvp8829LJD1RcG/Ps56x3gbULlzlp1jpQgBJzpo39R9VkyEJFJ/CtKpQXCAJG\n' +
  'N8IEvRwH77yjo70YBGt+lX7ihIE1vy6oIDKFLEPXUvokVriwaE3OFr/4ZqaYPcsV\n' +
  'pPLrnwP1D9grpQEfVGpQxE/QjyKGX4v94XaJqdjI+VF6B7Qv+1R7jXWSnYhi2PuD\n' +
  'ELiz7tXyaIl5Lfi/gosrC0eg4cHRiqQzTQTBmhpGRnNnOourUOpMDDAeSQGoAN60\n' +
  'ha+tyCwikAPcTK9OSsyGiiN9NssbLeXqX3TeNRHieRBD0HJ7Zd5h78uhPnPW7gJz\n' +
  'NwNoyzkCgYEA6TTov7qywwVWB/9ty0uO8Gre/8HUkrBFJoC/D/tfxYa+GO3ZQImR\n' +
  'jxWcmIoOYdVGe3ePFvOU4cCCRcYvciA3Jsn06ztFUusl9cyv42VSVeijgX4KFZEm\n' +
  'X1DUAQk4PSLSnN1V1q6UfOPHNDkkPO1QKOdwP8DVwRA1fIRKWYsr/J0CgYEAzvc9\n' +
  'UBohl3RMEf+sj9XQOEwbiXKadyaO0xNKYRMGxeGhHf9DT3KM0CenDwIpq3ZKhO2N\n' +
  '0jAI28RQ4kHxSH+Vg3sEzru3nAScKzSnzOwWUDu5CmVboJJ8RKUcNJ4XQg2HLcZi\n' +
  'lzD/sIxyugdTnDPhPCQU8DI19SiBlHGuzBFST7sCgYAU59RRk7gAuZK7xs8d4Vkf\n' +
  '/kSdYs/ekoSwbewyz5MHTwvtiizmly6ASCywk/e0F31pBg/Cu/VFw48qGBkavv6S\n' +
  'sJoPGFIfm8rcXQwLc4LNBrzZl+XphwiMlN9cdGohOOTugPz38NCI3ZZ2/QRdndyI\n' +
  'vi6W2H+Q/hX9YpKTsmEwFQKBgFLGOURnHxY20hHEwtxH9F3/umevaS3MQwUSSwYm\n' +
  'GOhdhBW+OMp2kvDRWxQ6ljXYOpeNdtIgmfpjOsIzA3AubrrGIbcZBqckhN0W0yG3\n' +
  'LnlqWWhZ/1pqG79MlcpJjB3D0VOya03yr+CJW30hXwQzD5sBB0rFmiTxzVl0WieN\n' +
  'qfDvAoGAVxVRMcQ82FBBYgGenJFQ5KIQ2F40bgnE4DKp0/qZIF3n5rZIG+lHW+4H\n' +
  'envNeY8vEhokzBgkbHA3NQJD4cLoHPX3sen6k+ucpFygcbPjpMhrU7SXJMPjDu0o\n' +
  '7BwpfaywiaAYiSZEe6HgfXASCAejg7IIP9RP30N2gOviXzbeciI=\n' +
  '-----END RSA PRIVATE KEY-----\n';
config.idp.owner.didRegistrationUrl = 'https://authorization.dev:33443/dids/';
config.idp.owner.didDocument = {
  '@context': 'https://w3id.org/identity/v1',
  id: config.idp.owner.id,
  idp: config.idp.owner.id,
  url: config.server.baseUri,
  accessControl: {
    writePermission: [{
      id: publicKey.id,
      type: 'CryptographicKey'
    }]
  },
  publicKey: [{
    // TODO: change to use DID URI
    id: publicKey.id,
    type: 'CryptographicKey',
    owner: config.idp.owner.id,
    publicKeyPem:
      '-----BEGIN PUBLIC KEY-----\n' +
      'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvInNMW0FYD0F8YnLleuC\n' +
      'FL/PAlCjE5cyDb9MfSn7iMIpaEIjKNG8N90m5z2txEOg0DXfzIDJ1T8mU3trWFAT\n' +
      'RfjRqykFjAUzTx9CQvG9U/PZecKAQQKuSVxmEqMvUCH0H2ari+YRn+rEg1vuWOvf\n' +
      '7vvhjtCwdmOHKDSMf/s3uv4tTNt8ZNg18k87ITWvD0AT+fHDWAFP7860T3n4Oeb7\n' +
      'ElaNE3/txbaiPLKaPgcO2eu15CHAlMSQ2oWURrX7gM18aJpZin42naqa0MLxmgvA\n' +
      '3t5gjElQZlagjYwE09ouegC0auqLSfQ5XXYKN3z1iWcn5o9cTHRBz1OcjXRUk1/5\n' +
      'rwIDAQAB\n' +
      '-----END PUBLIC KEY-----\n'
  }]
};
config.idp.owner.registerWithStrictSSL = false;

// views vars
config.views.vars.idp = {
  owner: config.idp.owner
};
config.views.vars['authorization-io'] = {};
config.views.vars['authorization-io'].baseUri =
  'https://authorization.dev:33443';
config.views.vars['authorization-io'].agentUrl =
  config.views.vars['authorization-io'].baseUri + '/agent';
config.views.vars['authorization-io'].registerUrl =
  config.views.vars['authorization-io'].baseUri + '/register';
