import { useState, SyntheticEvent } from 'react';
import { EntryFormValues, HealthCheckRating } from '../types';
import {  TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent } from '@mui/material';


interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
}

const AddEntry = ({ onCancel, onSubmit }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating | undefined>(undefined);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [type, setType] = useState<'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'>('HealthCheck');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const newEntry: EntryFormValues = {
      description,
      date,
      specialist,
      diagnosisCodes,
      type,
      healthCheckRating
    };

    switch (type) {
      case "HealthCheck":
        newEntry.healthCheckRating = healthCheckRating;
        break;
      case "Hospital":
        newEntry.discharge = {
          date: dischargeDate,
          criteria: dischargeCriteria,
        };
        break;
      case "OccupationalHealthcare":
        newEntry.employerName = employerName;
        newEntry.sickLeave = {
          startDate: sickLeaveStartDate,
          endDate: sickLeaveEndDate,
        };
        break;
      default:
        return newEntry;
    }

    onSubmit(newEntry);
  };

  return(
    <div>
      <h4>New Healthcheck entry</h4>
      <form onSubmit={addEntry}>
      <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          value={type}
          onChange={(event: SelectChangeEvent<'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'>) => setType(event.target.value as 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare')}
        >
          <MenuItem value="HealthCheck">HealthCheck</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">OccupationalHealthcare</MenuItem>
        </Select>
        <br />
        <TextField
          label="Description"
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          fullWidth
        />
        <TextField
          label="Date"
          value={date}
          onChange={({ target }) => setDate(target.value)}
          fullWidth
        />
        <TextField
          label="Specialist"
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          fullWidth
        />
        <TextField
          label="Diagnosis Codes (comma separated)"
          value={diagnosisCodes.join(',')}
          onChange={({ target }) => setDiagnosisCodes(target.value.split(','))}
          fullWidth
        />
        {type === 'HealthCheck' && (
          <TextField
            label="Healthcheck Rating"
            value={healthCheckRating}
            onChange={({ target }) => setHealthCheckRating(Number(target.value) as HealthCheckRating)}
            fullWidth
          />
        )}
        {type === 'Hospital' && (
          <>
            <TextField
              label="Discharge Date"
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              fullWidth
            />
            <TextField
              label="Discharge Criteria"
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
              fullWidth
            />
          </>
        )}
        {type === 'OccupationalHealthcare' && (
          <>
            <TextField
              label="Employer Name"
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              fullWidth
            />
            <TextField
              label="Sick Leave Start Date"
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
              fullWidth
            />
            <TextField
              label="Sick Leave End Date"
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
              fullWidth
            />
          </>
        )}
        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};


export default AddEntry;