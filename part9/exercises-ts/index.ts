// const express = require('express');
import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json())

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!weight || !height || isNaN(height) || isNaN(weight)) {
    res.json({ error: 'malformatted parameters' });
  }

  const bmiCategory = calculateBmi(height, weight, `The BMI of height: ${height}cm and ${weight}kg is: `);

  res.json({
    weight: Number(weight),
    height: Number(height),
    bmi: bmiCategory
  });
});

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body 
  console.log('request body', daily_exercises)
  console.log('request body2', target)

  if (!daily_exercises || !target) {
    return res.status(400).send({ error: 'parameters missing' });
  }

  if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  for (const hour of daily_exercises) {
    if (isNaN(Number(hour))) {
      return res.status(400).send({ error: 'malformatted parameters' });
    }
  }

  const hours: number[] = daily_exercises.map((hour: number) => Number(hour));

  const result = calculateExercises(hours, Number(target));
  // return res.json(result);
  return res.json(result)
})

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});