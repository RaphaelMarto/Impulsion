var request = require('supertest');
const  app = require("../app");

describe('Testing for the /users routes', function() {

    it('Should responds 401 to /users/condition because no access', function (done) {
        request(app)
            .get('/user/condition')
            .expect(401, done);
    })  

    it('Should responds 401 to /users/info because no cookie', function (done) {
        request(app)
            .get('/user/info')
            .expect(401, done);
    })  

    it('Should responds 200 to /users/instrument/all because just returns all instrument', function (done) {
        request(app)
            .get('/user/instrument/all')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  

    it('Should responds 200 to /users/all/:startLetter because it just a search', function (done) {
        request(app)
            .get('/user/all/Nat')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
        });
    })  

    it('Should responds 200 to /user/1 because no access', function (done) {
        request(app)
            .get('/user/1')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
        });
    })  

    it('Should responds 401 to /user/a because bad entry', function (done) {
        request(app)
            .get('/user/a')
            .expect(401, done);
    })  
  });