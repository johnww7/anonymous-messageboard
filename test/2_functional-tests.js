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
          .post("/api/threads/general")
          .send({
            board: 'general',
            text: 'A test thread',
            delete_password: 'threadDelete',
            reported: false
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            //assert.equal(res.body.board, 'general');
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
          .get("/api/threads/general")
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
    
    suite.skip('DELETE', function() {
      test('Delete specified thread', function(done) {
        chai
          .request(server)
          .delete("/api/threads/general")
          .send({
            thread_id: '',
            delete_password: ''
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'success');
            done();
          });
      });
    });
    
    suite.skip('PUT', function() {
      test('Reporting a thread', function(done) {
        chai
          .request(server)
          .put('/api/threads/general')
          .send({
            thread_id: ''
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'success');
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
          .post("/api/replies/general")
          .send({
            board: 'general',
            thread_id: '5e584b1fa490a10dd24c441a',
            text: 'A test reply',
            delete_password: 'replyDelete',
            reported: false
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
           // assert.equal(res.body.board, 'general');
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
          .get("/api/replies/general")
          .query({
            thread_id: '5e584b1fa490a10dd24c441a'
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
    
    suite.skip('PUT', function() {
      test('Report a reply', function(done) {
        chai
          .request(server)
          .put('/api/replies/general')
          .send({
            thread_id: '',
            reply_id: ''
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'success');
            done();
          });
      });  
    });
    
    suite.skip('DELETE', function() {
      test('Delete a post', function(done) {
        chai
          .request(server)
          .delete("/api/replies/general")
          .send({
            thread_id: '',
            reply_id: '',
            delete_password: ''
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
