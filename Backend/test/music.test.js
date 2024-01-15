var request = require('supertest');
const  app = require("../app");

describe('Testing for the /music routes', function() {

    it('Should responds 200 to /genre', function (done) {
        request(app)
            .get('/music/genre')
            .expect(200, done);
    })  

    it('Should responds 401 to /user/all because need cookie', function (done) {
        request(app)
            .get('/music/user/all')
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  

    it('Should responds 200 to /music/random/music?list=[]', function (done) {
        request(app)
            .get('/music/random/music?list=[]')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  

    it('Should responds 401 to /music/random/music', function (done) {
        request(app)
            .get('/music/random/music')
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  

    it('Should responds 200 to /music/all/:startLetter', function (done) {
        request(app)
            .get('/music/all/s')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  

    it('Should responds 200 to /music/instrumentTemp', function (done) {
        request(app)
            .get('/music/instrumentTemp')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  

    it('Should responds 200 to /music/instrument/all/:startLetter', function (done) {
        request(app)
            .get('/music/instrument/all/:startLetter')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  

    it('Should responds 200 to /music/:userId', function (done) {
        request(app)
            .get('/music/2')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  

  });