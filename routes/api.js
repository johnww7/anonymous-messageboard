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
      let board = req.params.board;
      console.log("Board data: " + board + ': ' +typeof(board));

      let getThreadsFromBoard = threadController.getBoard(board).then((data) => {
        console.log('Threads retrieved from selected board: ' + JSON.stringify(data));
        res.json(data);
      });
    })
    .post(function(req, res, next) {
      console.log('post body for threads: ' + JSON.stringify(req.body));
      let board = req.body.board;
      let postText = req.body.text;
      let deletePasword = req.body.delete_password;

      let postData = {
        board: board,
        text: postText,
        delete_password: deletePasword,
        reported: false
      };

      let threadCreatedData = threadController.createThread(postData).then((data) => {
        console.log('Thread created data: ' + JSON.stringify(data));
        res.json(data);
      });
      
      //res.send(threadCreatedData);
    })
    .put(function(req, res, next) {

    })
    .delete(function(req, res, next) {

    });
    
  app.route('/api/replies/:board')
    .get(function(req, res, next) {
      console.log('Get all replies for selected thread: ' + JSON.stringify(req.params));
      console.log('thread id: ' + req.query.thread_id);
      let board = req.params.board;
      let threadId = req.query.thread_id;

      let getSelectedThread = threadController.getThread(threadId).then((data) => {
        console.log("Selected Thread with all replies: " + JSON.stringify(data));
        res.json(data);   
      });

    })
    .post(function(req, res, next) {
      console.log('post body for replies: ' + JSON.stringify(req.body));
      let board = req.body.board;
      let threadId = req.body.thread_id;
      let replyText = req.body.text;
      let deletePassword = req.body.delete_password;

      let replyData = {
        threadId: threadId,
        text: replyText,
        createdOn: Date.now(),
        delete_password: deletePassword,
        reported: false
      };

      let replyToThread = threadController.createReply(replyData).then((data) => {
        console.log('Reply to thread data: ' + JSON.stringify(data));
        res.redirect('/b/' + board + '/' + threadId);
      });
    })
    .put(function(req, res, next) {

    })
    .delete(function(req, res, next) {

    });

};
