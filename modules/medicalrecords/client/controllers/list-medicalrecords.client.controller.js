(function () {
  'use strict';

  angular
    .module('medicalrecords')
    .controller('MedicalrecordsListController', MedicalrecordsListController);

  MedicalrecordsListController.$inject = ['$scope', '$filter', 'MedicalrecordsService'];

  function MedicalrecordsListController($scope, $filter, MedicalrecordsService) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    MedicalrecordsService.query(function (data) {
      vm.medicalrecords = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.medicalrecords, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    vm.medicalrecords = MedicalrecordsService.query();
  }
}());
