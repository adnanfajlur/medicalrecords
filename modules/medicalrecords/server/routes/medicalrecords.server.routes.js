'use strict';

/**
 * Module dependencies
 */
var medicalrecordsPolicy = require('../policies/medicalrecords.server.policy'),
  medicalrecords = require('../controllers/medicalrecords.server.controller');

module.exports = function(app) {
  // Medicalrecords Routes
  app.route('/api/medicalrecords').all(medicalrecordsPolicy.isAllowed)
    .get(medicalrecords.list)
    .post(medicalrecords.create);

  app.route('/api/medicalrecords/:medicalrecordId').all(medicalrecordsPolicy.isAllowed)
    .get(medicalrecords.read)
    .put(medicalrecords.update)
    .delete(medicalrecords.delete);

  // Finish by binding the Medicalrecord middleware
  app.param('medicalrecordId', medicalrecords.medicalrecordByID);
};
