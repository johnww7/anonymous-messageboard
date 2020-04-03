/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test("Create new thread", function(done) {
        chai
          .request(server)
          .post("/api/threads/testing")
          .send({
            board: 'testing',
            text: 'A test thread',
            delete_password: 'threadDelete',
            reported: false
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            console.log("whats in create thread body: " + JSON.stringify(res.board));
            //assert.equal(res.body.board, 'testing');
            //assert.equal(res.body.text, 'A test thread');
            //assert.equal(res.body.delete_password, 'threadDelete');
            done();
          });
      });
    });
    
    suite('GET', function() {
      test("Retrieve all recent threads", function(done) {
        chai
          .request(server)
          .get("/api/threads/testing")
          .query({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.notProperty(res.body[0], 'reported');
            assert.notProperty(res.body[0], 'delete_password');
            assert.property(res.body[0], 'board');
            assert.property(res.body[0], '_id');
            done();
          });
      });
    });
    
    suite('DELETE', function() {
      test('Delete specified thread', function(done) {
        chai
          .request(server)
          .delete("/api/threads/testing")
          .send({
            board: 'testing',
            thread_id: '5e7e814b6a95b10ecdd64fc3',
            delete_password: 'threadDelete'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            console.log("DId I delete for testing: " + JSON.stringify(res.body));
            assert.equal(res.body.result, 'success');
            done();
          });
      });
    });
    
    suite('PUT', function() {
      test('Reporting a thread', function(done) {
        chai
          .request(server)
          .put('/api/threads/testing')
          .send({
            board: 'testing',
            thread_id: '5e8271d2ee21490c3e6400f8'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            console.log('What is body for report: ' + JSON.stringify(res))
            assert.equal(res.text, 'success');
            done();
          });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test("Reply to a thread", function(done) {
        chai
          .request(server)
          .post("/api/replies/testing")
          .send({
            board: 'testing',
            thread_id: '5e7e80cad40c9d0e6d325c59',
            text: 'A test reply',
            delete_password: 'replyDelete',
            reported: false
          })
          .end(function(err, res) {
            //console.log('Reply to thread test: ' + JSON.stringify(res));
            assert.equal(res.status, 200);
            //assert.equal(res.body.board, 'testing');
            //assert.equal(res.body.text, 'A test reply');
            //assert.equal(res.body.delete_password, 'replyDelete');
            done();
          });
      });
    });
    
    suite('GET', function() {
      test("Retrieve an entire thread", function(done) {
        chai
          .request(server)
          .get("/api/replies/testing")
          .query({
            thread_id: '5e7d34b1c7e4740e0d83283e'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.notProperty(res.body[0], 'reported');
            assert.notProperty(res.body[0], 'delete_password');
            assert.property(res.body[0], 'board');
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'replies');
            done();
          });
      });
    });
    
    suite('PUT', function() {
      test('Report a reply', function(done) {
        chai
          .request(server)
          .put('/api/replies/testing')
          .send({
            thread_id: '5e7d34ddc7e4740e0d83283f',
            reply_id: '5e7d360dc939230ee33720fe'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'success');
            done();
          });
      });  
    });
    
    suite('DELETE', function() {
      test('Delete a post', function(done) {
        chai
          .request(server)
          .delete("/api/replies/testing")
          .send({
            board: 'testing',
            thread_id: '5e7d34b1c7e4740e0d83283e',
            reply_id: '5e87bad76f968c13d427f9e6',
            delete_password: 'replyDelete'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'success');
            done();
          });
      });
    });
    
  });

});

