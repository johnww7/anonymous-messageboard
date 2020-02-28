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
            assert.equal(res.body.board, 'general');
            assert.equal(res.body.text, 'A test thread');
            assert.equal(res.body.delete_password, 'threadDelete');
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
          .end(function(err, rest) {
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
      
    });
    
    suite('PUT', function() {
      
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
    });
    
    suite('GET', function() {
      
    });
    
    suite('PUT', function() {
      
    });
    
    suite('DELETE', function() {
      
    });
    
  });

});
