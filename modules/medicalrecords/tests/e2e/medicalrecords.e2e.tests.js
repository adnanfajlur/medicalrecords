'use strict';

describe('Medicalrecords E2E Tests:', function () {
  describe('Test Medicalrecords page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/medicalrecords');
      expect(element.all(by.repeater('medicalrecord in medicalrecords')).count()).toEqual(0);
    });
  });
});
