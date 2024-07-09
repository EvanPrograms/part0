import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry } from "../types";

interface EntryDetailsProps {
  entry: HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;
  getDiagnosisName: (code: string) => string;
}

export const HospitalEntryDetails: React.FC<{ entry: HospitalEntry, getDiagnosisName: (code: string) => string }> = ({ entry, getDiagnosisName }) => (
  <div>
    <p className="no-margin">
      {entry.date} <LocalHospitalIcon />
    </p>
    <p className="no-margin"><em>{entry.description}</em></p>
    <p>Discharge date: {entry.discharge.date}</p>
    <p>Discharge criteria: {entry.discharge.criteria}</p>
    <p>diagnosed by {entry.specialist}</p>
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
);

export const OccupationalHealthcareEntryDetails: React.FC<{ entry: OccupationalHealthcareEntry,  getDiagnosisName: (code: string) => string }> = ({ entry, getDiagnosisName }) => (
  <div>
    <p className="no-margin">
      {entry.date} <WorkIcon /> <em>{entry.employerName}</em>
    </p>
    <p className="no-margin"><em>{entry.description}</em></p>
    {entry.sickLeave && (
      <>
        <p>Sick Leave Start date: {entry.sickLeave.startDate}</p>
        <p>Sick Leave End date: {entry.sickLeave.endDate}</p>
      </>
    )}
    <p>diagnosed by {entry.specialist}</p>
    <ul>
      {entry.diagnosisCodes && entry.diagnosisCodes.map((code, index) => (
        <li key={index}>
          {code} - {getDiagnosisName(code)}
        </li>
      ))}
    </ul>
  </div>
);

export const HealthCheckEntryDetails: React.FC<{ entry: HealthCheckEntry, getDiagnosisName: (code: string) => string }> = ({ entry, getDiagnosisName }) => (
  <div>
    <p className="no-margin">
      {entry.date} <MedicalServicesIcon />
    </p>
    <p className="no-margin"><em>{entry.description}</em></p>
    {entry.healthCheckRating === 0 && <FavoriteIcon style={{ color: 'green' }} />}
    {entry.healthCheckRating === 1 && <FavoriteIcon style={{ color: 'yellow' }} />}
    {entry.healthCheckRating === 2 && <FavoriteIcon style={{ color: 'orange' }} />}
    {entry.healthCheckRating === 3 && <FavoriteIcon style={{ color: 'red' }} />}
    <p>diagnosed by {entry.specialist}</p>
    <ul>
      {entry.diagnosisCodes && entry.diagnosisCodes.map((code, index) => (
        <li key={index}>
          {code} - {getDiagnosisName(code)}
        </li>
      ))}
    </ul>
  </div>
);