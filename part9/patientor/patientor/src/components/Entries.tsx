import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry } from "../types";


export const HospitalEntryDetails: React.FC<{ entry: HospitalEntry }> = ({ entry, getDiagnosisName }) => (
  <div>
    <p className="no-margin">
      {entry.date} <LocalHospitalIcon />
    </p>
    <p className="no-margin"><em>{entry.description}</em></p>
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

export const OccupationalHealthcareEntryDetails: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => (
  <div>
    <p className="no-margin">
      {entry.date} <WorkIcon /> <em>{entry.employerName}</em>
    </p>
    <p className="no-margin"><em>{entry.description}</em></p>
    <p>diagnosed by {entry.specialist}</p>
  </div>
);

export const HealthCheckEntryDetails: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => (
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
  </div>
);