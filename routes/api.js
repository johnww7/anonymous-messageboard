/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectId;

const CONNECTION_STRING = process.env.CONNECTION_STRING;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(function(req, res, next) {

    })
    .post(function(req, res, next) {

    })
    .put(function(req, res, next) {

    })
    .delete(function(req, res, next) {

    });
    
  app.route('/api/replies/:board')
    .get(function(req, res, next) {

    })
    .post(function(req, res, next) {

    })
    .put(function(req, res, next) {

    })
    .delete(function(req, res, next) {

    });

};
