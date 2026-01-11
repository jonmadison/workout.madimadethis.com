import { MdOutlineSwapHorizontalCircle, MdEdit } from 'react-icons/md';

function Workout({ exercises, workoutName, workoutAuthor, onSwapWorkout, onEditWorkout }) {
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
          <div key={exercise.order} className="rounded-lg p-4" style={{ backgroundColor: '#FEFEFD' }}>
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-medium text-gray-900">{exercise.order}. {exercise.exercise}</h3>
                <span className="text-sm text-gray-600">{exercise.rest}s rest</span>
              </div>
              <div className="inline-block" style={{ maxWidth: '240px' }}>
                {exercise.image && (
                  <img
                    src={exercise.image}
                    alt={exercise.exercise}
                    className="rounded-lg object-cover w-full mb-3"
                  />
                )}
                <p className="text-gray-700">{exercise.setsReps} @ {exercise.weight}</p>
              </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Workout
