import patients from '../../data/patients';
// import { v1 as uuid } from 'uuid'


import { EntryWithoutId } from '../types';

const findByEntry = (id: string): EntryWithoutId | undefined => {
  return patients.find(p => p.id === id);
};



export default {
  findByEntry
};