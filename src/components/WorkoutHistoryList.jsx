import { formatDate, formatTime, formatDuration } from '../utils/dateUtils'

function WorkoutHistoryList({ workouts, selectedDate }) {
  if (!workouts || workouts.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <p className="text-gray-500">
          {selectedDate
            ? `No workouts on ${formatDate(selectedDate)}`
            : 'Select a date to view workouts'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Workouts for {formatDate(selectedDate)}
      </h2>

      {workouts.map((workout) => {
        const completionPercentage = Math.round(
          (workout.completedExercises / workout.totalExercises) * 100
        )

        return (
          <div key={workout.workoutId} className="bg-white rounded-lg p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {workout.routineName}
                </h3>
                <p className="text-sm text-gray-600">
                  by {workout.routineAuthor}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  workout.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {workout.status === 'completed' ? 'Completed' : 'Partial'}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-600">Duration</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDuration(workout.durationMinutes)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Time</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatTime(workout.workoutDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Progress</p>
                <p className="text-sm font-semibold text-gray-900">
                  {completionPercentage}%
                </p>
              </div>
            </div>

            {/* Exercises */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Exercises</h4>
              <div className="space-y-2">
                {workout.exercises.map((exercise) => (
                  <div
                    key={exercise.order}
                    className={`flex items-center justify-between p-2 rounded ${
                      exercise.status === 'completed'
                        ? 'bg-green-50'
                        : exercise.status === 'partial'
                        ? 'bg-yellow-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          exercise.status === 'completed'
                            ? 'bg-green-500'
                            : exercise.status === 'partial'
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                        }`}
                      ></span>
                      <span className="text-sm text-gray-900">{exercise.exercise}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-600">{exercise.weight}</span>
                      <span className="text-xs font-medium text-gray-700">
                        {exercise.completedSets}/{exercise.totalSets} sets
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WorkoutHistoryList
