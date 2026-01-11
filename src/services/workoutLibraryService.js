import { generateClient } from 'aws-amplify/data';
import workoutRoutine from '../data/workoutRoutine.json';

const client = generateClient();

/**
 * Get all workouts for a user (default + custom)
 */
export async function getWorkouts(userId) {
  try {
    const { data: workouts } = await client.models.CustomWorkout.list({
      filter: {
        userId: { eq: userId },
      },
    });

    // Parse exercises JSON strings back to objects and sort
    const parsed = (workouts || []).map(workout => ({
      ...workout,
      exercises: typeof workout.exercises === 'string'
        ? JSON.parse(workout.exercises)
        : workout.exercises,
    }));

    // Sort by isDefault (true first), then by createdAt
    const sorted = parsed.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    return { success: true, workouts: sorted };
  } catch (error) {
    console.error('Failed to fetch workouts:', error);
    return { success: false, workouts: [], error: error.message };
  }
}

/**
 * Get a specific workout
 */
export async function getWorkout(userId, workoutId) {
  try {
    const { data: workout } = await client.models.CustomWorkout.get({
      userId,
      workoutId,
    });

    // Parse exercises JSON string back to object
    const parsed = workout ? {
      ...workout,
      exercises: typeof workout.exercises === 'string'
        ? JSON.parse(workout.exercises)
        : workout.exercises,
    } : null;

    return { success: true, workout: parsed };
  } catch (error) {
    console.error('Failed to fetch workout:', error);
    return { success: false, workout: null, error: error.message };
  }
}

/**
 * Create a new custom workout
 */
export async function createWorkout(workoutData) {
  try {
    const now = new Date().toISOString();
    const workout = {
      ...workoutData,
      // Convert exercises to JSON string if it's an object/array
      exercises: typeof workoutData.exercises === 'string'
        ? workoutData.exercises
        : JSON.stringify(workoutData.exercises),
      createdAt: now,
      updatedAt: now,
    };

    console.log('Creating workout:', workout);
    const result = await client.models.CustomWorkout.create(workout);
    console.log('Create result:', result);

    if (result.errors && result.errors.length > 0) {
      console.error('Create errors:', result.errors);
      return { success: false, error: result.errors[0].message };
    }

    return { success: true, workout: result.data };
  } catch (error) {
    console.error('Failed to create workout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing workout
 */
export async function updateWorkout(userId, workoutId, updates) {
  try {
    const now = new Date().toISOString();
    const updateData = {
      userId,
      workoutId,
      ...updates,
      // Convert exercises to JSON string if it's being updated
      exercises: updates.exercises
        ? (typeof updates.exercises === 'string'
          ? updates.exercises
          : JSON.stringify(updates.exercises))
        : undefined,
      updatedAt: now,
    };

    const result = await client.models.CustomWorkout.update(updateData);

    return { success: true, workout: result.data };
  } catch (error) {
    console.error('Failed to update workout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a workout
 */
export async function deleteWorkout(userId, workoutId) {
  try {
    await client.models.CustomWorkout.delete({
      userId,
      workoutId,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to delete workout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Seed default workout for a new user
 */
export async function seedDefaultWorkout(userId) {
  try {
    // Check if user already has workouts
    const { workouts } = await getWorkouts(userId);
    if (workouts && workouts.length > 0) {
      return { success: true, alreadySeeded: true };
    }

    // Create default workout from workoutRoutine.json
    const defaultWorkout = {
      userId,
      workoutId: crypto.randomUUID(),
      name: workoutRoutine.name,
      author: workoutRoutine.author,
      isDefault: true,
      exercises: workoutRoutine.exercises,
    };

    const result = await createWorkout(defaultWorkout);
    return { success: result.success, workout: result.workout };
  } catch (error) {
    console.error('Failed to seed default workout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get or create the selected workout ID from localStorage
 */
export function getSelectedWorkoutId() {
  try {
    return localStorage.getItem('selectedWorkoutId');
  } catch (error) {
    console.error('Failed to get selected workout ID:', error);
    return null;
  }
}

/**
 * Save the selected workout ID to localStorage
 */
export function setSelectedWorkoutId(workoutId) {
  try {
    localStorage.setItem('selectedWorkoutId', workoutId);
  } catch (error) {
    console.error('Failed to save selected workout ID:', error);
  }
}
