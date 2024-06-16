const calculateBmi = (height: number, weight: number) : string => {
  const bmi = weight / ((height / 100) * (height / 100));

  let answer: string;

  switch (true) {
    case (bmi < 16):
      answer = 'Severely underweight';
      break;
    case (16 <= bmi && bmi < 17):
      answer = 'Underweight (moderate thinness)';
      break;
    case (17 <= bmi && bmi < 18.5):
      answer = 'Underweight (mild thinness)';
      break;
    case (18.5 <= bmi && bmi < 25):
      answer = 'Normal Range';
      break;
    case (25 <= bmi && bmi < 30):
      answer = 'Overweight (Pre-obese)'
      break;
    case (30 <= bmi && bmi < 35):
      answer = 'Obese (Class I)';
      break;
    case (35 <= bmi && bmi < 40):
      answer = 'Obese (Class II)';
      break;
    case (40 <= bmi):
      answer = 'Obese (Class III Very severely obese)';
      break;
    default:
      answer = 'Invalid BMI'
  }

  return answer
}

console.log(calculateBmi(180, 105))