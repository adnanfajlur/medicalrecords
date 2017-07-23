(function () {
  'use strict';

  describe('Medicalrecords Route Tests', function () {
    // Initialize global variables
    var $scope,
      MedicalrecordsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MedicalrecordsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MedicalrecordsService = _MedicalrecordsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('medicalrecords');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/medicalrecords');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MedicalrecordsController,
          mockMedicalrecord;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('medicalrecords.view');
          $templateCache.put('modules/medicalrecords/client/views/view-medicalrecord.client.view.html', '');

          // create mock Medicalrecord
          mockMedicalrecord = new MedicalrecordsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Medicalrecord Name'
          });

          // Initialize Controller
          MedicalrecordsController = $controller('MedicalrecordsController as vm', {
            $scope: $scope,
            medicalrecordResolve: mockMedicalrecord
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:medicalrecordId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.medicalrecordResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            medicalrecordId: 1
          })).toEqual('/medicalrecords/1');
        }));

        it('should attach an Medicalrecord to the controller scope', function () {
          expect($scope.vm.medicalrecord._id).toBe(mockMedicalrecord._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/medicalrecords/client/views/view-medicalrecord.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MedicalrecordsController,
          mockMedicalrecord;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('medicalrecords.create');
          $templateCache.put('modules/medicalrecords/client/views/form-medicalrecord.client.view.html', '');

          // create mock Medicalrecord
          mockMedicalrecord = new MedicalrecordsService();

          // Initialize Controller
          MedicalrecordsController = $controller('MedicalrecordsController as vm', {
            $scope: $scope,
            medicalrecordResolve: mockMedicalrecord
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.medicalrecordResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/medicalrecords/create');
        }));

        it('should attach an Medicalrecord to the controller scope', function () {
          expect($scope.vm.medicalrecord._id).toBe(mockMedicalrecord._id);
          expect($scope.vm.medicalrecord._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/medicalrecords/client/views/form-medicalrecord.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MedicalrecordsController,
          mockMedicalrecord;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('medicalrecords.edit');
          $templateCache.put('modules/medicalrecords/client/views/form-medicalrecord.client.view.html', '');

          // create mock Medicalrecord
          mockMedicalrecord = new MedicalrecordsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Medicalrecord Name'
          });

          // Initialize Controller
          MedicalrecordsController = $controller('MedicalrecordsController as vm', {
            $scope: $scope,
            medicalrecordResolve: mockMedicalrecord
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:medicalrecordId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.medicalrecordResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            medicalrecordId: 1
          })).toEqual('/medicalrecords/1/edit');
        }));

        it('should attach an Medicalrecord to the controller scope', function () {
          expect($scope.vm.medicalrecord._id).toBe(mockMedicalrecord._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/medicalrecords/client/views/form-medicalrecord.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
