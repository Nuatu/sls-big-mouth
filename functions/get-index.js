'use strict';

// Needed to convert callback functions into async functions that return a promise
const co = require("co");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));

var html;

function* loadHtml() {
  // Take advantage of container reuse to avoid loading static content or creating 
  if (!html) {
  html = yield fs.readFileAsync('static/index.html', 'utf-8');
  }
  return html;
}

module.exports.handler = co.wrap(function*(event, context, callback) {
  
  let html = yield loadHtml();

  const response = {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  };

  callback(null, response);
});
