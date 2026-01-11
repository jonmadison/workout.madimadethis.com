const WORKOUT_STATE_KEY = 'workoutState';
const PENDING_SYNCS_KEY = 'pendingSyncs';

export function saveWorkoutState(state) {
  try {
    localStorage.setItem(WORKOUT_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save workout state:', error);
  }
}

export function getWorkoutState() {
  try {
    const state = localStorage.getItem(WORKOUT_STATE_KEY);
    return state ? JSON.parse(state) : null;
  } catch (error) {
    console.error('Failed to get workout state:', error);
    return null;
  }
}

export function clearWorkoutState() {
  try {
    localStorage.removeItem(WORKOUT_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear workout state:', error);
  }
}

export function savePendingSync(workoutData) {
  try {
    const pending = getPendingSyncs();
    pending.push({
      workoutData,
      attempts: 0,
      lastAttempt: new Date().toISOString(),
    });
    localStorage.setItem(PENDING_SYNCS_KEY, JSON.stringify(pending));
  } catch (error) {
    console.error('Failed to save pending sync:', error);
  }
}

export function getPendingSyncs() {
  try {
    const syncs = localStorage.getItem(PENDING_SYNCS_KEY);
    return syncs ? JSON.parse(syncs) : [];
  } catch (error) {
    console.error('Failed to get pending syncs:', error);
    return [];
  }
}

export function removePendingSync(workoutId) {
  try {
    const pending = getPendingSyncs();
    const filtered = pending.filter(sync => sync.workoutData.workoutId !== workoutId);
    localStorage.setItem(PENDING_SYNCS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove pending sync:', error);
  }
}

export function clearAllPendingSyncs() {
  try {
    localStorage.removeItem(PENDING_SYNCS_KEY);
  } catch (error) {
    console.error('Failed to clear pending syncs:', error);
  }
}
