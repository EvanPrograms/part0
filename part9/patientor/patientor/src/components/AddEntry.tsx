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

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      description,
      date,
      specialist,
      diagnosisCodes,
      type,
      healthCheckRating
    });
  };

  return(
    <div>
      <h4>New Healthcheck entry</h4>
      <form onSubmit={addEntry}>
        <label>Description</label> <br />
        <input
          type="text"
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        /> <br />
         <label>Date</label>  <br />
        <input
          type="text"
          value={date}
          onChange={({ target }) => setDate(target.value)}
        /> <br />
         <label>Specialist</label> <br />
        <input
          type="text"
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        /> <br />
        <label>Healthcheck Rating</label> <br />
        <input
          type="text"
          value={healthCheckRating}
          onChange={({ target }) => setHealthCheckRating(Number(target.value) as HealthCheckRating)}
        /> <br />
         <label>Diagnosis Codes</label> <br />
        <input
          type="text"
          value={diagnosisCodes}
          onChange={({ target }) => setDiagnosisCodes(target.value.split(','))}
        />
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