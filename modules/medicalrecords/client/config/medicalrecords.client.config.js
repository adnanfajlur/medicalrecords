(function () {
  'use strict';

  angular
    .module('medicalrecords')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Medical Records',
      state: 'medicalrecords',
      type: 'dropdown',
      roles: ['user', 'patient', 'admin']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'medicalrecords', {
      title: 'List Medical Records',
      state: 'medicalrecords.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'medicalrecords', {
      title: 'Create Medical Record',
      state: 'medicalrecords.create',
      roles: ['user']
    });
  }
}());
