// const express = require('express');
import express from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

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

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});