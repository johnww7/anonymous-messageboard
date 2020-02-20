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
      
      
    })
    .put(function(req, res, next) {
      console.log('put body for threads: ' + JSON.stringify(req.body));
      let board = req.body.board;
      let threadId = req.body.thread_id;

      let reportSelectedThread = threadController.reportThread(threadId).then((data) =>{
        console.log('Reported thread result: ' + data);
        res.send(data);
      });
    })
    .delete(function(req, res, next) {
      console.log('Delete thread from board: ' + JSON.stringify(req.body));
      let deleteId = req.body.delete_password;
      let threadId = req.body.thread_id;
      let deleteInfo = {
        deletePass: deleteId,
        threadId: threadId
      }
      let deleteThreadResult = threadController.deleteThread(deleteInfo).then((data) => {
        console.log('Delete result info: ' + JSON.stringify(data));
        res.json(data);   
      });
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
      console.log('Delete reply from thread: ' + JSON.stringify(req.body));
      let deletePass = req.body.delete_password;
      let threadId = req.body.thread_id;
      let replyId = req.body.reply_id;
      let deletePostInfo = {
        deletePass: deletePass,
        threadId: threadId,
        replyId: replyId
      };

      let deleteSelectedPost = threadController.deletePost(deletePostInfo).then((data) => {
        console.log('Deleted post data: ' + data);
        res.send(data);
      });
    });

};
