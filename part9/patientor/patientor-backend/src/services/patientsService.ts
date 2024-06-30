import patients from '../../data/patients';

import { PatientEntry, NonSensitivePatientEntry } from '../types';

const getEntries = (): PatientEntry[] => {
  return patients;
};

const addPatient = () => {
  return null;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export default {
  getEntries,
  addPatient,
  getNonSensitiveEntries
};