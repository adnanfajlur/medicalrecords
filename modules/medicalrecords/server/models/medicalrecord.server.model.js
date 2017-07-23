'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Medicalrecord Schema
 */
var MedicalrecordSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill patient name'
  },
  gender: {
    type: String,
    default: '',
    required: 'Please fill gender'
  },
  age: {
    type: String,
    default: '',
    required: 'Please fill age'
  },
  address: {
    type: String,
    default: '',
    required: 'Please fill address'
  },
  job: {
    type: String,
    default: '',
    required: 'Please fill job'
  },
  // education: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill education'
  // },
  // bloodgroup: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill blood group'
  // },
  // parentsname: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill parents name (father or mother)'
  // },
  // maritalstatus: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill marital status'
  // },
  // husbandwife: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill name of husband / wife'
  // },
  // // data pemeriksaan
  // complaint: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill complaint / history of the disease'
  // },
  // checkup: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill result of checkup'
  // },
  // diagnosis: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill diagnosis'
  // },
  // drug: {
  //   type: String,
  //   default: '',
  //   required: 'Please fill drug or treatment'
  // },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Medicalrecord', MedicalrecordSchema);
