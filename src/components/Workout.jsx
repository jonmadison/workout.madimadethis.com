function Workout({ exercises, workoutName, workoutAuthor }) {
  return (
    <div id="workout" className="flex-1 overflow-y-auto pt-6 pb-24">
      <div className="max-w-2xl mx-auto px-10">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{workoutName}</h2>
          <p className="text-sm text-gray-600">by {workoutAuthor}</p>
        </div>
        <div className="space-y-4">
          {exercises.map((exercise) => (
          <div key={exercise.order} className="bg-white rounded-lg p-4">
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
