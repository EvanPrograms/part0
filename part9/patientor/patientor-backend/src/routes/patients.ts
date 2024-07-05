import express from 'express';
import patientsService from '../services/patientsService';
// import entryService from '../services/entryService';
import { toNewPatientEntry, toNewPatient } from "../utils";

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const patient = patientsService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send({ error: 'Patient not found' });
  }

})

router.get('/:id/entries', (req, res) => {
  const patient = patientsService.findById(req.params.id);

  if (patient) {
    res.send(patient.entries)
  } else {
    res.status(404).send({ error: 'Patient not found' });
  }
})

router.post('/:id/entries', (req, res) => {
  try {
    const patientId = req.params.id;
    const newEntry = toNewPatientEntry(req.body);

    const addedEntry = patientsService.addEntry(patientId, newEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
})

router.post('/', (req, res) => {
//   const { name, dateOfBirth, ssn, gender, occupation } = req.body
//   const addedPatient = patientsService.addPatient({
//     name,
//     dateOfBirth,
//     ssn,
//     gender,
//     occupation,
// });
//   res.json(addedPatient);
try {
  const newPatientEntry = toNewPatient(req.body);

  const addedPatient = patientsService.addPatient(newPatientEntry);
  res.json(addedPatient);
} catch (error: unknown) {
  let errorMessage = 'Something went wrong.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  res.status(400).send(errorMessage);
}
});

export default router;