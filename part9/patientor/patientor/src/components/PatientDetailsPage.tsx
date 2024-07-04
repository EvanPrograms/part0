import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Diagnosis, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import './PatientDetailsPage.css';




const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        setPatient(data);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchPatient();

    const fetchDiagnoses = async () => {
      try {
        const {data } = await axios.get<Diagnosis>(`${apiBaseUrl}/diagnoses`);
        setDiagnoses(data);
      } catch (e) {
        console.error(e);
      }
    };
    void fetchDiagnoses();
  }, [id]);

  if (!patient) return <div>Loading...</div>;
  // console.log('patient entries', patient.entries);
  console.log('this is diagnoses', diagnoses);

  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  return (
    <div>
      <h2>{patient.name}
        {patient.gender === 'male' && <MaleIcon />}
        {patient.gender === 'female' && <FemaleIcon />}
        {patient.gender === 'other' && <TransgenderIcon />}
      </h2>

      <p className="no-margin">Occupation: {patient.occupation}</p>
      <p className="no-margin">Date of Birth: {patient.dateOfBirth}</p>
      <p className="no-margin">SSN: {patient.ssn}</p>
      <h3>Entries</h3>
      {patient.entries.length > 0 ? (
        patient.entries.map((entry, index) => (
          <div key={index}>
            <p>{entry.date} <em>{entry.description}</em></p>
            <ul>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map((code, index) => (
                    <li key={index}>
                      {code} - {getDiagnosisName(code)}
                    </li>
                ))}
              </ul>
            )}
            </ul>
          </div>
        ))
      ) : (
        <p>No entries</p>
      )}
    </div>
  );
};

export default PatientDetailsPage;
