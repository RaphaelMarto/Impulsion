var request = require('supertest');
const  app = require("../app");

describe('Testing for the //follow routes', function() {

    it('Should responds 401 to /follow/all because no cookie', function (done) {
        request(app)
            .get('/follow/all')
            .expect(401, done);
    })  

    it('Should responds 500 to /following/:followID because need cookie', function (done) {
        request(app)
            .get('/follow/following/1')
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  
  });