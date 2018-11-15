module.exports = {
  "_from": "tough-cookie@~2.3.3",
  "_id": "tough-cookie@2.3.4",
  "_inBundle": false,
  "_integrity": "sha1-7GDO44rGdQY//JelwYlwV47oNlU=",
  "_location": "/tough-cookie",
  "_phantomChildren": {},
  "_requested": {
    "type": "range",
    "registry": true,
    "raw": "tough-cookie@~2.3.3",
    "name": "tough-cookie",
    "escapedName": "tough-cookie",
    "rawSpec": "~2.3.3",
    "saveSpec": null,
    "fetchSpec": "~2.3.3"
  },
  "_requiredBy": [
    "/request"
  ],
  "_resolved": "http://registry.npm.taobao.org/tough-cookie/download/tough-cookie-2.3.4.tgz",
  "_shasum": "ec60cee38ac675063ffc97a5c18970578ee83655",
  "_spec": "tough-cookie@~2.3.3",
  "_where": "C:\\Users\\Administrator\\Desktop\\hw-work\\WBT-wxapp\\node_modules\\request",
  "author": {
    "name": "Jeremy Stashewsky",
    "email": "jstashewsky@salesforce.com"
  },
  "bugs": {
    "url": "https://github.com/salesforce/tough-cookie/issues"
  },
  "bundleDependencies": false,
  "contributors": [
    {
      "name": "Alexander Savin"
    },
    {
      "name": "Ian Livingstone"
    },
    {
      "name": "Ivan Nikulin"
    },
    {
      "name": "Lalit Kapoor"
    },
    {
      "name": "Sam Thompson"
    },
    {
      "name": "Sebastian Mayr"
    }
  ],
  "dependencies": {
    "punycode": "^1.4.1"
  },
  "deprecated": false,
  "description": "RFC6265 Cookies and Cookie Jar for node.js",
  "devDependencies": {
    "async": "^1.4.2",
    "string.prototype.repeat": "^0.2.0",
    "vows": "^0.8.1"
  },
  "engines": {
    "node": ">=0.8"
  },
  "files": [
    "lib"
  ],
  "homepage": "https://github.com/salesforce/tough-cookie",
  "keywords": [
    "HTTP",
    "cookie",
    "cookies",
    "set-cookie",
    "cookiejar",
    "jar",
    "RFC6265",
    "RFC2965"
  ],
  "license": "BSD-3-Clause",
  "main": "./lib/cookie",
  "name": "tough-cookie",
  "repository": {
    "type": "git",
    "url": "git://github.com/salesforce/tough-cookie.git"
  },
  "scripts": {
    "suffixup": "curl -o public_suffix_list.dat https://publicsuffix.org/list/public_suffix_list.dat && ./generate-pubsuffix.js",
    "test": "vows test/*_test.js"
  },
  "version": "2.3.4"
}
