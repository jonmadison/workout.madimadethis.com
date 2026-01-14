import { useState, useEffect } from 'react';
import { MdAdd } from 'react-icons/md';
import WorkoutCard from './WorkoutCard';
import WorkoutEditor from './WorkoutEditor';
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getSelectedWorkoutId,
  setSelectedWorkoutId,
} from '../services/workoutLibraryService';

function WorkoutLibrary({ user, selectedWorkoutId, onWorkoutSelect }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, [user]);

  const loadWorkouts = async () => {
    if (!user) return;

    setLoading(true);
    const result = await getWorkouts(user.username);
    if (result.success) {
      console.log('=== Workout Library Debug ===');
      console.log('Loaded workouts:', result.workouts.map(w => ({
        id: w.workoutId,
        name: w.name,
        isDefault: w.isDefault
      })));
      setWorkouts(result.workouts);
    }
    setLoading(false);
  };

  const handleCreateNew = () => {
    setEditingWorkout(null);
    setIsCreatingNew(true);
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setIsCreatingNew(true);
  };

  const handleSaveWorkout = async (workoutData) => {
    let result;

    if (editingWorkout) {
      // Update existing workout
      result = await updateWorkout(
        user.username,
        editingWorkout.workoutId,
        workoutData
      );
    } else {
      // Create new workout
      const newWorkout = {
        userId: user.username,
        workoutId: crypto.randomUUID(),
        ...workoutData,
        isDefault: false,
      };
      result = await createWorkout(newWorkout);
    }

    if (result.success) {
      setIsCreatingNew(false);
      setEditingWorkout(null);
      await loadWorkouts();
    } else {
      alert('Failed to save workout. Please try again.');
    }
  };

  const handleDeleteWorkout = async (workout) => {
    if (workout.isDefault) {
      alert('Cannot delete the default workout');
      return;
    }

    const confirmed = window.confirm(
      `Delete "${workout.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const result = await deleteWorkout(user.username, workout.workoutId);
    if (result.success) {
      // If deleted workout was selected, switch to first workout (default)
      if (selectedWorkoutId === workout.workoutId && workouts.length > 0) {
        const defaultWorkout = workouts.find((w) => w.isDefault) || workouts[0];
        onWorkoutSelect(defaultWorkout);
      }

      await loadWorkouts();
    } else {
      alert('Failed to delete workout. Please try again.');
    }
  };

  const handleSelectWorkout = (workout) => {
    onWorkoutSelect(workout);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workouts...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="workout-library" className="h-full flex flex-col bg-gray-100">
      {/* Header */}
      <div className="flex-shrink-0 p-6 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Workouts</h1>
              <p className="text-sm text-gray-600 mt-1">
                {workouts.length} {workouts.length === 1 ? 'workout' : 'workouts'}
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MdAdd size={20} />
              New Workout
            </button>
          </div>
        </div>
      </div>

      {/* Workout Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          {workouts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No workouts yet</p>
              <button
                onClick={handleCreateNew}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Workout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workouts.map((workout) => (
                <WorkoutCard
                  key={workout.workoutId}
                  workout={workout}
                  isSelected={selectedWorkoutId === workout.workoutId}
                  onSelect={() => handleSelectWorkout(workout)}
                  onEdit={() => handleEdit(workout)}
                  onDelete={() => handleDeleteWorkout(workout)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Workout Editor Modal */}
      {isCreatingNew && (
        <WorkoutEditor
          workout={editingWorkout}
          onSave={handleSaveWorkout}
          onCancel={() => {
            setIsCreatingNew(false);
            setEditingWorkout(null);
          }}
        />
      )}
    </div>
  );
}

export default WorkoutLibrary;
