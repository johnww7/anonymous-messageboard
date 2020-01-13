/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

require('dotenv').config()
var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectId;

var threadController = require('../board_controller/threadController');

const CONNECTION_STRING = process.env.CONNECTION_STRING;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(function(req, res, next) {

    })
    .post(function(req, res, next) {
      console.log('post body for threads: ' + JSON.stringify(req.body));
      let board = req.body.board;
      let postText = req.body.text;
      let deletePasword = req.body.delete_password;

      let postData = {
        text: postText,
        delete_password: deletePasword,
        reported: false
      };

      let threadCreatedData = threadController.createThread(postData);
      console.log('Thread created data: ' + JSON.stringify(threadCreatedData));
      res.send(threadCreatedData);
    })
    .put(function(req, res, next) {

    })
    .delete(function(req, res, next) {

    });
    
  app.route('/api/replies/:board')
    .get(function(req, res, next) {

    })
    .post(function(req, res, next) {
      console.log('post body for replies: ' + JSON.stringify(req.body));
    })
    .put(function(req, res, next) {

    })
    .delete(function(req, res, next) {

    });

};
