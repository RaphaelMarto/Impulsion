var request = require('supertest');
const  app = require("../app");

describe('Testing for the /comment routes', function() {

    it('Should responds 500 to /comment/anon/:idMusic because no data entered', function (done) {
        request(app)
            .get('/comment/comment/anon/a')
            .expect(500, done);
    })  

    it('Should responds 200 to /comment/anon/:idMusic just return the data', function (done) {
        request(app)
            .get('/comment/comment/anon/1')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  

    it('Should responds 200 to /comment/:idMusic/:idReply returns data as normal', function (done) {
        request(app)
            .get('/comment/comment/1/1')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  

    it('Should responds 500 to /comment/:idMusic/:idReply no idReply', function (done) {
        request(app)
            .get('/comment/comment/1/a')
            .expect(500)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  
  });