(function () {
  'use strict';

  angular
    .module('medicalrecords')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('medicalrecords', {
        abstract: true,
        url: '/medicalrecords',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'patient', 'admin']
        }
      })
      .state('medicalrecords.list', {
        url: '',
        templateUrl: '/modules/medicalrecords/client/views/list-medicalrecords.client.view.html',
        controller: 'MedicalrecordsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Medical Records List'
        }
      })
      .state('medicalrecords.create', {
        url: '/create',
        templateUrl: '/modules/medicalrecords/client/views/form-medicalrecord.client.view.html',
        controller: 'MedicalrecordsController',
        controllerAs: 'vm',
        resolve: {
          medicalrecordResolve: newMedicalrecord
        },
        data: {
          roles: ['user'],
          pageTitle: 'Medical Records Create'
        }
      })
      .state('medicalrecords.edit', {
        url: '/:medicalrecordId/edit',
        templateUrl: '/modules/medicalrecords/client/views/form-medicalrecord.client.view.html',
        controller: 'MedicalrecordsController',
        controllerAs: 'vm',
        resolve: {
          medicalrecordResolve: getMedicalrecord
        },
        data: {
          roles: ['user'],
          pageTitle: 'Edit Medical record {{ medicalrecordResolve.name }}'
        }
      })
      .state('medicalrecords.view', {
        url: '/:medicalrecordId',
        templateUrl: '/modules/medicalrecords/client/views/view-medicalrecord.client.view.html',
        controller: 'MedicalrecordsController',
        controllerAs: 'vm',
        resolve: {
          medicalrecordResolve: getMedicalrecord
        },
        data: {
          pageTitle: 'Medicalrecord {{ medicalrecordResolve.name }}'
        }
      });
  }

  getMedicalrecord.$inject = ['$stateParams', 'MedicalrecordsService'];

  function getMedicalrecord($stateParams, MedicalrecordsService) {
    return MedicalrecordsService.get({
      medicalrecordId: $stateParams.medicalrecordId
    }).$promise;
  }

  newMedicalrecord.$inject = ['MedicalrecordsService'];

  function newMedicalrecord(MedicalrecordsService) {
    return new MedicalrecordsService();
  }
}());
