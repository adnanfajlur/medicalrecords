// Medicalrecords service used to communicate Medicalrecords REST endpoints
(function () {
  'use strict';

  angular
    .module('medicalrecords')
    .factory('MedicalrecordsService', MedicalrecordsService);

  MedicalrecordsService.$inject = ['$resource'];

  function MedicalrecordsService($resource) {
    return $resource('/api/medicalrecords/:medicalrecordId', {
      medicalrecordId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  angular
    .module('users.admin.services')
    .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
    return $resource('/api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
