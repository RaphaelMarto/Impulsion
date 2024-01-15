var request = require('supertest');
const  app = require("../app");

describe('Testing for the /like routes', function() {

    it('Should responds 200 to /liked/:idMusic ', function (done) {
        request(app)
            .get('/like/liked/3')
            .expect(200, done);
    })  

    it('Should responds 500 to /liked/:idMusic because wrong param', function (done) {
        request(app)
            .get('/like/liked/a')
            .expect(401)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    })  
  });