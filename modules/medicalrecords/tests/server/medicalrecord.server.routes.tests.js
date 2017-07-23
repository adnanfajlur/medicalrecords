'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Medicalrecord = mongoose.model('Medicalrecord'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  medicalrecord;

/**
 * Medicalrecord routes tests
 */
describe('Medicalrecord CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Medicalrecord
    user.save(function () {
      medicalrecord = {
        name: 'Medicalrecord name'
      };

      done();
    });
  });

  it('should be able to save a Medicalrecord if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Medicalrecord
        agent.post('/api/medicalrecords')
          .send(medicalrecord)
          .expect(200)
          .end(function (medicalrecordSaveErr, medicalrecordSaveRes) {
            // Handle Medicalrecord save error
            if (medicalrecordSaveErr) {
              return done(medicalrecordSaveErr);
            }

            // Get a list of Medicalrecords
            agent.get('/api/medicalrecords')
              .end(function (medicalrecordsGetErr, medicalrecordsGetRes) {
                // Handle Medicalrecords save error
                if (medicalrecordsGetErr) {
                  return done(medicalrecordsGetErr);
                }

                // Get Medicalrecords list
                var medicalrecords = medicalrecordsGetRes.body;

                // Set assertions
                (medicalrecords[0].user._id).should.equal(userId);
                (medicalrecords[0].name).should.match('Medicalrecord name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Medicalrecord if not logged in', function (done) {
    agent.post('/api/medicalrecords')
      .send(medicalrecord)
      .expect(403)
      .end(function (medicalrecordSaveErr, medicalrecordSaveRes) {
        // Call the assertion callback
        done(medicalrecordSaveErr);
      });
  });

  it('should not be able to save an Medicalrecord if no name is provided', function (done) {
    // Invalidate name field
    medicalrecord.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Medicalrecord
        agent.post('/api/medicalrecords')
          .send(medicalrecord)
          .expect(400)
          .end(function (medicalrecordSaveErr, medicalrecordSaveRes) {
            // Set message assertion
            (medicalrecordSaveRes.body.message).should.match('Please fill Medicalrecord name');

            // Handle Medicalrecord save error
            done(medicalrecordSaveErr);
          });
      });
  });

  it('should be able to update an Medicalrecord if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Medicalrecord
        agent.post('/api/medicalrecords')
          .send(medicalrecord)
          .expect(200)
          .end(function (medicalrecordSaveErr, medicalrecordSaveRes) {
            // Handle Medicalrecord save error
            if (medicalrecordSaveErr) {
              return done(medicalrecordSaveErr);
            }

            // Update Medicalrecord name
            medicalrecord.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Medicalrecord
            agent.put('/api/medicalrecords/' + medicalrecordSaveRes.body._id)
              .send(medicalrecord)
              .expect(200)
              .end(function (medicalrecordUpdateErr, medicalrecordUpdateRes) {
                // Handle Medicalrecord update error
                if (medicalrecordUpdateErr) {
                  return done(medicalrecordUpdateErr);
                }

                // Set assertions
                (medicalrecordUpdateRes.body._id).should.equal(medicalrecordSaveRes.body._id);
                (medicalrecordUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Medicalrecords if not signed in', function (done) {
    // Create new Medicalrecord model instance
    var medicalrecordObj = new Medicalrecord(medicalrecord);

    // Save the medicalrecord
    medicalrecordObj.save(function () {
      // Request Medicalrecords
      request(app).get('/api/medicalrecords')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Medicalrecord if not signed in', function (done) {
    // Create new Medicalrecord model instance
    var medicalrecordObj = new Medicalrecord(medicalrecord);

    // Save the Medicalrecord
    medicalrecordObj.save(function () {
      request(app).get('/api/medicalrecords/' + medicalrecordObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', medicalrecord.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Medicalrecord with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/medicalrecords/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Medicalrecord is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Medicalrecord which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Medicalrecord
    request(app).get('/api/medicalrecords/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Medicalrecord with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Medicalrecord if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Medicalrecord
        agent.post('/api/medicalrecords')
          .send(medicalrecord)
          .expect(200)
          .end(function (medicalrecordSaveErr, medicalrecordSaveRes) {
            // Handle Medicalrecord save error
            if (medicalrecordSaveErr) {
              return done(medicalrecordSaveErr);
            }

            // Delete an existing Medicalrecord
            agent.delete('/api/medicalrecords/' + medicalrecordSaveRes.body._id)
              .send(medicalrecord)
              .expect(200)
              .end(function (medicalrecordDeleteErr, medicalrecordDeleteRes) {
                // Handle medicalrecord error error
                if (medicalrecordDeleteErr) {
                  return done(medicalrecordDeleteErr);
                }

                // Set assertions
                (medicalrecordDeleteRes.body._id).should.equal(medicalrecordSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Medicalrecord if not signed in', function (done) {
    // Set Medicalrecord user
    medicalrecord.user = user;

    // Create new Medicalrecord model instance
    var medicalrecordObj = new Medicalrecord(medicalrecord);

    // Save the Medicalrecord
    medicalrecordObj.save(function () {
      // Try deleting Medicalrecord
      request(app).delete('/api/medicalrecords/' + medicalrecordObj._id)
        .expect(403)
        .end(function (medicalrecordDeleteErr, medicalrecordDeleteRes) {
          // Set message assertion
          (medicalrecordDeleteRes.body.message).should.match('User is not authorized');

          // Handle Medicalrecord error error
          done(medicalrecordDeleteErr);
        });

    });
  });

  it('should be able to get a single Medicalrecord that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Medicalrecord
          agent.post('/api/medicalrecords')
            .send(medicalrecord)
            .expect(200)
            .end(function (medicalrecordSaveErr, medicalrecordSaveRes) {
              // Handle Medicalrecord save error
              if (medicalrecordSaveErr) {
                return done(medicalrecordSaveErr);
              }

              // Set assertions on new Medicalrecord
              (medicalrecordSaveRes.body.name).should.equal(medicalrecord.name);
              should.exist(medicalrecordSaveRes.body.user);
              should.equal(medicalrecordSaveRes.body.user._id, orphanId);

              // force the Medicalrecord to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Medicalrecord
                    agent.get('/api/medicalrecords/' + medicalrecordSaveRes.body._id)
                      .expect(200)
                      .end(function (medicalrecordInfoErr, medicalrecordInfoRes) {
                        // Handle Medicalrecord error
                        if (medicalrecordInfoErr) {
                          return done(medicalrecordInfoErr);
                        }

                        // Set assertions
                        (medicalrecordInfoRes.body._id).should.equal(medicalrecordSaveRes.body._id);
                        (medicalrecordInfoRes.body.name).should.equal(medicalrecord.name);
                        should.equal(medicalrecordInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Medicalrecord.remove().exec(done);
    });
  });
});
