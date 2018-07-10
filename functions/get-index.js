'use strict';

// Needed to convert callback functions into async functions that return a promise
const co = require("co");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const Mustache = require('mustache');
const http = require('superagent-promise')(require('superagent'), Promise);
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// Reference to Env variable set in serverless.yml
const restaurantsApiRoot = process.env.restaurants_api;

var html;

function* loadHtml() {
  // Take advantage of container reuse to avoid loading static content or creating 
  if (!html) {
  html = yield fs.readFileAsync('static/index.html', 'utf-8');
  }
  return html;  
}

function* getRestaurants() {
  return (yield http.get(restaurantsApiRoot)).body;
}

module.exports.handler = co.wrap(function*(event, context, callback) {
  let template = yield loadHtml();
  let restaurants = yield getRestaurants(); 
  let dayOfWeek = days[new Date().getDay()];
  let html = Mustache.render(template, { dayOfWeek, restaurants }); 

  const response = {
    statusCode: 200,
    body: html,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8'
    }
  };

  callback(null, response);
});
