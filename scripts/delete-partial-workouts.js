import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import { readFileSync } from 'fs';

const outputs = JSON.parse(readFileSync('./amplify_outputs.json', 'utf-8'));
Amplify.configure(outputs);
const client = generateClient();

async function deletePartialWorkoutsToday(userId) {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    console.log('Querying for today\'s workouts...');
    console.log('User ID:', userId);
    console.log('Date range:', startOfDay.toISOString(), 'to', endOfDay.toISOString());

    const { data: workouts } = await client.models.WorkoutHistory.listWorkoutHistoriesByUser({
      userId,
      workoutDate: {
        between: [startOfDay.toISOString(), endOfDay.toISOString()],
      },
    });

    console.log(`Found ${workouts.length} workouts for today`);

    const partialWorkouts = workouts.filter(w => w.status === 'partial');
    console.log(`Found ${partialWorkouts.length} partial workouts`);

    for (const workout of partialWorkouts) {
      console.log(`Deleting workout ${workout.workoutId}...`);
      await client.models.WorkoutHistory.delete({
        workoutId: workout.workoutId
      });
      console.log(`Deleted workout ${workout.workoutId}`);
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Get userId from command line argument
const userId = process.argv[2];
if (!userId) {
  console.error('Usage: node delete-partial-workouts.js <userId>');
  process.exit(1);
}

deletePartialWorkoutsToday(userId);
