import { generateClient } from 'aws-amplify/data';
import { savePendingSync, removePendingSync, getPendingSyncs } from '../utils/storageUtils';

// This will be typed after Amplify generates the client
const client = generateClient();

export async function saveWorkout(workoutData) {
  try {
    console.log('Attempting to save workout with data:', workoutData);
    const result = await client.models.WorkoutHistory.create(workoutData);
    console.log('Raw create result:', result);
    console.log('Result data:', result.data);
    console.log('Result errors:', result.errors);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Failed to save workout - full error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    // Save to localStorage for offline sync
    savePendingSync(workoutData);
    throw error;
  }
}

export async function deleteWorkout(workoutId) {
  try {
    await client.models.WorkoutHistory.delete({ workoutId });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete workout:', error);
    return { success: false, error: error.message };
  }
}

export async function getWorkoutsByMonth(userId, year, month) {
  try {
    const { startDate, endDate } = getMonthRange(year, month);

    const { data: workouts } = await client.models.WorkoutHistory.listWorkoutHistoriesByUser({
      userId,
      workoutDate: {
        between: [startDate, endDate],
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
    const { data: workouts } = await client.models.WorkoutHistory.listWorkoutHistoriesByUser({
      userId,
      workoutDate: {
        between: [startDate, endDate],
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
    // Query for workouts on specific date using the secondary index
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: workouts } = await client.models.WorkoutHistory.listWorkoutHistoriesByUser({
      userId,
      workoutDate: {
        between: [startOfDay.toISOString(), endOfDay.toISOString()],
      },
    });

    return { success: true, workout: workouts?.[0] || null };
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
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    console.log('getTodaysWorkout query:', {
      userId,
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString()
    });

    const result = await client.models.WorkoutHistory.listWorkoutHistoriesByUser({
      userId,
      workoutDate: {
        between: [startOfDay.toISOString(), endOfDay.toISOString()],
      },
    });

    console.log('Raw query result:', result);
    console.log('Query errors:', result.errors);
    console.log('Workouts found for today:', result.data);

    // Check if any workout completed today (status === 'completed')
    const completedToday = result.data?.some(w => w.status === 'completed');

    console.log('completedToday:', completedToday);

    return { success: true, workout: result.data?.[0] || null, completed: completedToday };
  } catch (error) {
    console.error('Failed to check today\'s workout:', error);
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
