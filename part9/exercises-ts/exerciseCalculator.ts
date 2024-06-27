interface ExerciseResult {
  numberDays: number;
  trainingDays: number;
  averageDailyHours: number;
  target: number;
  targetReached: boolean;
  rating: number;
  ratingExplanation: string; 
}

export const parseArguments = (args: string[]): { target: number, hours: number[] } => {
  if (args.length < 3) throw new Error('Not enough arugments');

  const startIndex = args[0] === '--' ? 1 : 0;
  const target = Number(args[startIndex]);
  if (isNaN(target)) {
    throw new Error('Provided target value is not a number');
  }

  const hours = args.slice(startIndex + 1).map(arg => {
    const num = Number(arg);
    if(isNaN(num)) {
      throw new Error(`Provided value ${arg} is not a number!`);
    }
    return num;
  });

  return {
    target,
    hours
  };
};
  

export const calculateExercises = (hours: number[], target: number) : ExerciseResult => {
  const numberDays = hours.length;
  const trainingDays = hours.filter(day => day!== 0).length;
  //target
  const averageDailyHours = hours.reduce ((a, b) => a + b) / numberDays;

  const targetReached = averageDailyHours >= target;

  let rating: number;
  let ratingExplanation: string;
  switch(true) {
    case (averageDailyHours > target * 3):
      rating = 3;
      ratingExplanation = 'You worked out 3x as much as target';
      break;
    case (averageDailyHours > target * 2):
      rating = 2;
      ratingExplanation = 'You worked out 2x as much as target';
      break;
    default:
      rating = 1;
      ratingExplanation = 'You worked out 1x as much as target';
  }
  
  return {
    numberDays,
    trainingDays,
    averageDailyHours,
    target,
    targetReached,
    rating,
    ratingExplanation
  };
};

// const args = process.argv.slice(2);

// try {
//   const { target, hours } = parseArguments(args);
//   const result = calculateExercises(hours, target);
//   console.log(result);
// } catch (error: unknown) {
//   let errorMessage = 'Something bad happened. ';
//   if (error instanceof Error) {
//     errorMessage += ' Error: ' + error.message;
//   }
//   console.log(errorMessage);
// }
