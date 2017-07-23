'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Medicalrecord = mongoose.model('Medicalrecord'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Medicalrecord
 */
exports.create = function(req, res) {
  var medicalrecord = new Medicalrecord(req.body);
  medicalrecord.user = req.user;

  medicalrecord.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(medicalrecord);
    }
  });
};

/**
 * Show the current Medicalrecord
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var medicalrecord = req.medicalrecord ? req.medicalrecord.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  medicalrecord.isCurrentUserOwner = req.user && medicalrecord.user && medicalrecord.user._id.toString() === req.user._id.toString();

  res.jsonp(medicalrecord);
};

/**
 * Update a Medicalrecord
 */
exports.update = function(req, res) {
  var medicalrecord = req.medicalrecord;

  medicalrecord = _.extend(medicalrecord, req.body);

  medicalrecord.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(medicalrecord);
    }
  });
};

/**
 * Delete an Medicalrecord
 */
exports.delete = function(req, res) {
  var medicalrecord = req.medicalrecord;

  medicalrecord.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(medicalrecord);
    }
  });
};

/**
 * List of Medicalrecords
 */
exports.list = function(req, res) {
  Medicalrecord.find().sort('-created').populate('user', 'displayName').exec(function(err, medicalrecords) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(medicalrecords);
    }
  });
};

/**
 * Medicalrecord middleware
 */
exports.medicalrecordByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Medicalrecord is invalid'
    });
  }

  Medicalrecord.findById(id).populate('user', 'displayName').exec(function (err, medicalrecord) {
    if (err) {
      return next(err);
    } else if (!medicalrecord) {
      return res.status(404).send({
        message: 'No Medicalrecord with that identifier has been found'
      });
    }
    req.medicalrecord = medicalrecord;
    next();
  });
};
