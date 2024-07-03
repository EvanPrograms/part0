import patients from '../../data/patients';
import { v1 as uuid } from 'uuid'


import { PatientEntry, NonSensitivePatientEntry, NewPatientEntry } from '../types';

const getEntries = (): PatientEntry[] => {
  return patients;
};

const findById = (id: string): PatientEntry | undefined => {
  return patients.find(p => p.id === id);
};

const addPatient = ( entry: NewPatientEntry ): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
    entries: []
  }

  patients.push(newPatientEntry);
  return newPatientEntry;
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
  getNonSensitiveEntries,
  findById
};