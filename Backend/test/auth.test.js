var request = require('supertest');
const  app = require("../app");

describe('Testing for the /auth routes', function() {

    it('Should responds 500 to /auth/check-cookie because no cookie', function (done) {
        request(app)
            .get('/auth/check-cookie')
            .expect(200, done);
    })  

    it('Should responds 500 to /auth/all/id because need cookie', function (done) {
        request(app)
            .get('/auth/all/id')
            .expect(500)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  

    it('Should responds 500 to /auth/get-name because need cookie', function (done) {
        request(app)
            .get('/auth/get-name')
            .expect(500)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  
  });