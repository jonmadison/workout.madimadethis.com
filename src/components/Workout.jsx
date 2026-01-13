import { MdOutlineSwapHorizontalCircle, MdEdit } from 'react-icons/md';
import ExerciseCard from './ExerciseCard';

function Workout({ exercises, workoutName, workoutAuthor, onSwapWorkout, onEditWorkout, completedToday }) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div id="workout" className="flex-1 overflow-y-auto pt-6 pb-24">
      <div className="max-w-2xl mx-auto px-10">
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Today's workout - {formattedDate}</p>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-gray-900">{workoutName}</h2>
            <button
              onClick={onSwapWorkout}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              title="Change workout"
            >
              <MdOutlineSwapHorizontalCircle size={24} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">by {workoutAuthor}</p>
          <button
            onClick={onEditWorkout}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <MdEdit size={16} />
            Edit Workout
          </button>
        </div>
        <div className="space-y-4">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.order}
              exercise={exercise}
              completedToday={completedToday}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Workout
