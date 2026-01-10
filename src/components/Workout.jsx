function Workout({ exercises }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24">
      <div className="max-w-2xl mx-auto space-y-4">
        {exercises.map((exercise) => (
          <div key={exercise.order} className="bg-gray-800 rounded-lg p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-medium">{exercise.order}. {exercise.exercise}</h3>
                <span className="text-sm text-gray-400">{exercise.rest}s rest</span>
              </div>
              <div className="inline-block" style={{ maxWidth: '240px' }}>
                {exercise.image && (
                  <img
                    src={exercise.image}
                    alt={exercise.exercise}
                    className="rounded-lg object-cover w-full mb-3"
                  />
                )}
                <p className="text-gray-300">{exercise.setsReps} @ {exercise.weight}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Workout
