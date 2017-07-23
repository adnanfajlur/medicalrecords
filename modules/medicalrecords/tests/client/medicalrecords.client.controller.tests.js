(function () {
  'use strict';

  describe('Medicalrecords Controller Tests', function () {
    // Initialize global variables
    var MedicalrecordsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      MedicalrecordsService,
      mockMedicalrecord;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MedicalrecordsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      MedicalrecordsService = _MedicalrecordsService_;

      // create mock Medicalrecord
      mockMedicalrecord = new MedicalrecordsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Medicalrecord Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Medicalrecords controller.
      MedicalrecordsController = $controller('MedicalrecordsController as vm', {
        $scope: $scope,
        medicalrecordResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleMedicalrecordPostData;

      beforeEach(function () {
        // Create a sample Medicalrecord object
        sampleMedicalrecordPostData = new MedicalrecordsService({
          name: 'Medicalrecord Name'
        });

        $scope.vm.medicalrecord = sampleMedicalrecordPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (MedicalrecordsService) {
        // Set POST response
        $httpBackend.expectPOST('api/medicalrecords', sampleMedicalrecordPostData).respond(mockMedicalrecord);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Medicalrecord was created
        expect($state.go).toHaveBeenCalledWith('medicalrecords.view', {
          medicalrecordId: mockMedicalrecord._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/medicalrecords', sampleMedicalrecordPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Medicalrecord in $scope
        $scope.vm.medicalrecord = mockMedicalrecord;
      });

      it('should update a valid Medicalrecord', inject(function (MedicalrecordsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/medicalrecords\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('medicalrecords.view', {
          medicalrecordId: mockMedicalrecord._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (MedicalrecordsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/medicalrecords\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Medicalrecords
        $scope.vm.medicalrecord = mockMedicalrecord;
      });

      it('should delete the Medicalrecord and redirect to Medicalrecords', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/medicalrecords\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('medicalrecords.list');
      });

      it('should should not delete the Medicalrecord and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
