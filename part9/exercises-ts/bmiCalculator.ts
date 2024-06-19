interface BmiValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!')
  }
}

const calculateBmi = (height: number, weight: number, printText: string) : string => {
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

  // return answer
  console.log(printText, answer)
  return answer
}

// const height: number = Number(process.argv[2])
// const weight: number = Number(process.argv[3])


// try {
//   const { value1, value2 } = parseArguments(process.argv);
//   calculateBmi(
//     value1,
//     value2,
//     `The BMI of height: ${height}cm and ${weight}kg is: `)
// } catch (error: unknown) {
//   let errorMessage = 'Something bad happened. '
//   if (error instanceof Error) {
//     errorMessage += ' Error: ' + error.message;
//   }
//   console.log(errorMessage)
// }

export { parseArguments, calculateBmi }