import { useState, SyntheticEvent } from 'react';
import { EntryFormValues, HealthCheckRating } from '../types';
import {  TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
}

const AddEntry = ({ onCancel, onSubmit }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating | undefined>(undefined);
  const [diagnosisCodes, setDiagnosisCodes] = React.useState<string[]>([]);
  const [type, setType] = useState<'HealthCheck' | 'Hospital' | 'OccupationalHealthcare'>('HealthCheck');
  const [dischargeDate, setDischargeDate] = useState<Date | null>(null);
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<Date | null>(null);
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const [healthCheckRating, setHealthCheckRating] = React.useState<string[]>([]);

  const healthCheckRatingOptions = [
    HealthCheckRating.Healthy,
    HealthCheckRating.LowRisk,
    HealthCheckRating.HighRisk,
    HealthCheckRating.CriticalRisk
  ];

  const codes = [
    "M24.2",
    "M51.2",
    "S03.5",
    "J10.1", 
    "J06.9",
    "Z57.1",
    "N30.0",
    "H54.7",
    "J03.0",
    "L60.1",
    "Z74.3",
    "L20",
    "F43.2",
    "S62.5",
    "H35.29"
  ];

  const handleHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
    setHealthCheckRating(Number(event.target.value) as HealthCheckRating);
  };

  const handleCodeChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const newEntry: EntryFormValues = {
      description,
      date: date ? date.toISOString().split('T')[0] : '',
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
          date: date ? date.toISOString().split('T')[0] : '',
          criteria: dischargeCriteria,
        };
        break;
      case "OccupationalHealthcare":
        newEntry.employerName = employerName;
        newEntry.sickLeave = {
          startDate: sickLeaveStartDate ? sickLeaveStartDate.toISOString().split('T')[0] : '',
          endDate: sickLeaveEndDate ? sickLeaveEndDate.toISOString().split('T')[0] : '',
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
        {/* <TextField
          label="Date"
          value={date}
          onChange={({ target }) => setDate(target.value)}
          fullWidth
        /> */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
          />
        </LocalizationProvider>
        <TextField
          label="Specialist"
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          fullWidth
        />
        {/* <TextField
          label="Diagnosis Codes (comma separated)"
          value={diagnosisCodes.join(',')}
          onChange={({ target }) => setDiagnosisCodes(target.value.split(','))}
          fullWidth
        /> */}
         <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">Diagnosis Codes</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={diagnosisCodes}
            onChange={handleCodeChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}
            // MenuProps={MenuProps}
          >
            {codes.map((code) => (
              <MenuItem key={code} value={code}>
                <Checkbox checked={diagnosisCodes.indexOf(code) > -1} />
                <ListItemText primary={code} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {type === 'HealthCheck' && (
          <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-name-label">Healthcheck Rating</InputLabel>
          <Select
            labelId="health-check-rating-label"
            value={healthCheckRating?.toString() || ''}
            onChange={handleHealthCheckRatingChange}
            input={<OutlinedInput label="Health Check Rating" />}
            // MenuProps={MenuProps}
          >
            {healthCheckRatingOptions.map((rating) => (
              <MenuItem
                key={rating}
                value={rating}
                // style={getStyles(name, personName, theme)}
              >
                {rating}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        )}
        {type === 'Hospital' && (
          <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Discharge Date"
                value={dischargeDate}
                onChange={(newValue) => setDischargeDate(newValue)}
              />
            </LocalizationProvider>
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
            {/* <TextField
              label="Sick Leave Start Date"
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
              fullWidth
            /> */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Sick Leave Start Date"
                value={sickLeaveStartDate}
                onChange={(newValue) => setSickLeaveStartDate(newValue)}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Sick Leave Start Date"
                value={sickLeaveEndDate}
                onChange={(newValue) => setSickLeaveEndDate(newValue)}
              />
            </LocalizationProvider>
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