import { MdClose, MdCheckCircle } from 'react-icons/md';

function WorkoutSelector({ workouts, selectedWorkoutId, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Select Workout</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Workout List */}
        <div className="flex-1 overflow-y-auto">
          {workouts.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No workouts available
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {workouts.map((workout) => {
                const isSelected = selectedWorkoutId === workout.workoutId;
                return (
                  <button
                    key={workout.workoutId}
                    onClick={() => {
                      onSelect(workout);
                      onClose();
                    }}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-medium ${
                              isSelected ? 'text-blue-700' : 'text-gray-900'
                            }`}
                          >
                            {workout.name}
                          </h4>
                          {isSelected && (
                            <MdCheckCircle className="text-blue-600" size={18} />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          by {workout.author} • {workout.exercises?.length || 0}{' '}
                          exercises
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkoutSelector;
