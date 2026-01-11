import { generateClient } from 'aws-amplify/data';
import { savePendingSync, removePendingSync, getPendingSyncs } from '../utils/storageUtils';

// This will be typed after Amplify generates the client
const client = generateClient();

export async function saveWorkout(workoutData) {
  try {
    const result = await client.models.WorkoutHistory.create(workoutData);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Failed to save workout:', error);
    // Save to localStorage for offline sync
    savePendingSync(workoutData);
    throw error;
  }
}

export async function getWorkoutsByMonth(userId, year, month) {
  try {
    const { startDate, endDate } = getMonthRange(year, month);

    const { data: workouts } = await client.models.WorkoutHistory.list({
      filter: {
        userId: { eq: userId },
        workoutDate: {
          between: [startDate, endDate],
        },
      },
    });

    return { success: true, workouts };
  } catch (error) {
    console.error('Failed to fetch workouts:', error);
    return { success: false, workouts: [], error: error.message };
  }
}

export async function getWorkoutsByDateRange(userId, startDate, endDate) {
  try {
    const { data: workouts } = await client.models.WorkoutHistory.list({
      filter: {
        userId: { eq: userId },
        workoutDate: {
          between: [startDate, endDate],
        },
      },
    });

    return { success: true, workouts };
  } catch (error) {
    console.error('Failed to fetch workouts by date range:', error);
    return { success: false, workouts: [], error: error.message };
  }
}

export async function getWorkoutByDate(userId, date) {
  try {
    const { data: workout } = await client.models.WorkoutHistory.get({
      userId,
      workoutDate: date,
    });

    return { success: true, workout };
  } catch (error) {
    console.error('Failed to fetch workout:', error);
    return { success: false, workout: null, error: error.message };
  }
}

export async function syncPendingWorkouts() {
  const pendingSyncs = getPendingSyncs();

  if (pendingSyncs.length === 0) {
    return { success: true, synced: 0 };
  }

  let syncedCount = 0;
  const failedSyncs = [];

  for (const sync of pendingSyncs) {
    try {
      await saveWorkout(sync.workoutData);
      removePendingSync(sync.workoutData.workoutId);
      syncedCount++;
    } catch (error) {
      console.error(`Failed to sync workout ${sync.workoutData.workoutId}:`, error);
      failedSyncs.push(sync);
    }
  }

  return {
    success: syncedCount > 0,
    synced: syncedCount,
    failed: failedSyncs.length,
  };
}

// Get today's workout (if completed)
export async function getTodaysWorkout(userId) {
  try {
    const today = new Date();
    const todayISO = today.toISOString();

    const { data: workout } = await client.models.WorkoutHistory.get({
      userId,
      workoutDate: todayISO,
    });

    return { success: true, workout, completed: !!workout };
  } catch (error) {
    // If no workout found, that's ok - just means not completed today
    return { success: true, workout: null, completed: false };
  }
}

// Helper function to get month range
function getMonthRange(year, month) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}
