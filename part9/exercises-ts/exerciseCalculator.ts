// interface Result {
//   value1: number[];
//   value2: number;
// }

// const parseArguments = (args: string[]): Result => {}
//   if (parseArguments.length < 4) throw new Error('Not enough arguments')
//   if (parseArguments.length > 4) throw new Error('Too many arguments')

//     if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
//       return {
//         value: Number(args[2]),
//         value2: Number(args[3])
//       }
//     } else {
//       throw new Error('Provided values were not correct!')
//     }

interface ExerciseResult {
  numberDays: number;
  trainingDays: number;
  averageDailyHours: number;
  target: number;
  targetReached: boolean;
  rating: number;
  ratingExplanation: string; 
}
  

const calculateExercises = (hours: number[], target: number) : ExerciseResult => {
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
      ratingExplanation = 'You worked out 3x as much as target'
      break;
    case (averageDailyHours > target * 2):
      rating = 2;
      ratingExplanation = 'You worked out 2x as much as target'
      break;
    default:
      rating = 1;
      ratingExplanation = 'You worked out 1x as much as target';
  }
  
  return{
    numberDays,
    trainingDays,
    averageDailyHours,
    target,
    targetReached,
    rating,
    ratingExplanation
  }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))