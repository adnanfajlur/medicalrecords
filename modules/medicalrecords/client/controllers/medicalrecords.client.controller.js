(function () {
  'use strict';

  // Medicalrecords controller
  angular
    .module('medicalrecords')
    .controller('MedicalrecordsController', MedicalrecordsController);

  MedicalrecordsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'medicalrecordResolve'];

  function MedicalrecordsController ($scope, $state, $window, Authentication, medicalrecord) {
    var vm = this;

    vm.authentication = Authentication;
    vm.medicalrecord = medicalrecord;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Medicalrecord
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.medicalrecord.$remove($state.go('medicalrecords.list'));
      }
    }

    // Save Medicalrecord
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.medicalrecordForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.medicalrecord._id) {
        vm.medicalrecord.$update(successCallback, errorCallback);
      } else {
        vm.medicalrecord.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('medicalrecords.view', {
          medicalrecordId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
