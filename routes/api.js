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

      let getThreadsFromBoard = threadController.getBoard(board).then((data) => {
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
        res.redirect('/b/' + board);
      });
      
      
    })
    .put(function(req, res, next) {
      let board = req.body.board;
      let threadId = req.body.thread_id;

      let reportSelectedThread = threadController.reportThread(threadId).then((data) =>{
        res.send(data);
      });
    })
    .delete(function(req, res, next) {
      let deleteId = req.body.delete_password;
      let threadId = req.body.thread_id;
      let deleteInfo = {
        deletePass: deleteId,
        threadId: threadId
      }
      console.log('hhhh ' + JSON.stringify(deleteInfo))
      let deleteThreadResult = threadController.deleteThread(deleteInfo).then((data) => {
        console.log('Whats result: ' + JSON.stringify(data));
        res.send(data);   
      });
    });
    
  app.route('/api/replies/:board')
    .get(function(req, res, next) {
      let board = req.params.board;
      let threadId = req.query.thread_id;

      let getSelectedThread = threadController.getThread(threadId).then((data) => {
        
        res.json(data);   
      });

    })
    .post(function(req, res, next) {
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
        
        res.redirect('/b/' + board + '/' + threadId);
      });
      

    })
    .put(function(req, res, next) {
      let board = req.body.board;
      let threadId = req.body.thread_id;
      let replyId = req.body.reply_id;

      let reportSelectedReply = threadController.reportReply({threadId, replyId}).then((data) =>{
        res.json({result:data});
      });
    })
    .delete(function(req, res, next) {
      let deletePass = req.body.delete_password;
      let threadId = req.body.thread_id;
      let replyId = req.body.reply_id;
      let deletePostInfo = {
        deletePass: req.body.delete_password,
        threadId: req.body.thread_id,
        replyId: req.body.reply_id
      };

      let deleteSelectedPost = threadController.deletePost(deletePostInfo).then((data) => {
        res.json({result: data});
      });
    });

};
