import { NewPatientEntry, Gender, Entry, NewEntry, DiagnosisEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }

  return occupation;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }

  return ssn;
}

const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }

  return specialist;
}

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error('Incorrect or missing description');
  }

  return description;
}

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
      throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseDateOfBirth = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
      throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const isEntry = (entry: unknown): entry is Entry => {
  return typeof entry === 'object' && entry !== null;
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!Array.isArray(entries) || !entries.every(isEntry)) {
    throw new Error('Incorrect or missing entries');
  }

  return entries as Entry[];
};

const parseDiagnosisCodes = (object: unknown): Array<DiagnosisEntry['code']> =>  {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<DiagnosisEntry['code']>;
  }

  return object.diagnosisCodes as Array<DiagnosisEntry['code']>;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (typeof rating !== 'number' || !Object.values(HealthCheckRating).includes(rating)) {
    throw new Error('Incorrect or missing health check rating');
  }
  return rating as HealthCheckRating;
};

const parseDischarge = (discharge: unknown): { date: string, criteria: string } => {
  if (!discharge || typeof discharge !== 'object' || !('date' in discharge) || !('criteria' in discharge)) {
    throw new Error('Incorrect or missing discharge');
  }
  return {
    date: parseDate((discharge as { date: unknown }).date),
    criteria: parseDescription((discharge as { criteria: unknown }).criteria),
  };
};

const parseEmployerName = (employerName: unknown): string => {
  if (!isString(employerName)) {
    throw new Error('Incorrect or missing employer name');
  }
  return employerName;
};

const parseSickLeave = (sickLeave: unknown): { startDate: string, endDate: string } | undefined => {
  if (!sickLeave || typeof sickLeave !== 'object') {
    return undefined;
  }
  if (!('startDate' in sickLeave) || !('endDate' in sickLeave)) {
    throw new Error('Incorrect or missing sick leave');
  }
  return {
    startDate: parseDate((sickLeave as { startDate: unknown }).startDate),
    endDate: parseDate((sickLeave as { endDate: unknown }).endDate),
  };
};

const toNewPatient = (object: unknown): NewPatientEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newEntry: NewPatientEntry = {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: 'entries' in object ? parseEntries(object.entries) : []
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};

const toNewPatientEntry = (object: any): NewEntry => {
  const baseEntry = {
    date: parseDate(object.date),
    description: parseDescription(object.description),
    specialist: parseSpecialist(object.specialist),
    diagnosisCodes: parseDiagnosisCodes(object),
  };

  switch (object.type) {
    case 'HealthCheck':
      return {
        ...baseEntry,
        type: 'HealthCheck',
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      } as HealthCheckEntry;
    case 'Hospital':
      return {
        ...baseEntry,
        type: 'Hospital',
        discharge: parseDischarge(object.discharge),
      } as HospitalEntry;
    case 'OccupationalHealthcare':
      return {
        ...baseEntry,
        type: 'OccupationalHealthcare',
        employerName: parseEmployerName(object.employerName),
        sickLeave: parseSickLeave(object.sickLeave),
      } as OccupationalHealthcareEntry;
    default:
      throw new Error('Invalid entry type');
  }
};

export {
  toNewPatient,
  toNewPatientEntry
};
