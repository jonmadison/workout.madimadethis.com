import { useState, useEffect } from 'react'
import RestTimer from './RestTimer'

function WorkoutSession({ routine, onComplete }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [completedSets, setCompletedSets] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restTime, setRestTime] = useState(0)

  const currentExercise = routine[currentExerciseIndex]
  const totalSets = parseInt(currentExercise.setsReps.split('x')[0])

  const handleSetComplete = () => {
    const newCompletedSets = completedSets + 1

    if (newCompletedSets >= totalSets) {
      if (currentExerciseIndex < routine.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1)
        setCompletedSets(0)
        setIsResting(true)
        setRestTime(currentExercise.rest)
      } else {
        onComplete()
      }
    } else {
      setCompletedSets(newCompletedSets)
      setIsResting(true)
      setRestTime(currentExercise.rest)
    }
  }

  const handleRestComplete = () => {
    setIsResting(false)
    setRestTime(0)
  }

  const handleSkipRest = () => {
    setIsResting(false)
    setRestTime(0)
  }

  const progress = ((currentExerciseIndex * 100) / routine.length).toFixed(0)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Exercise {currentExerciseIndex + 1} of {routine.length}</span>
          <span>{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isResting ? (
        <RestTimer
          duration={restTime}
          onComplete={handleRestComplete}
          onSkip={handleSkipRest}
        />
      ) : (
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{currentExercise.exercise}</h2>

            {currentExercise.image && (
              <div className="mb-4 flex justify-center">
                <img
                  src={currentExercise.image}
                  alt={currentExercise.exercise}
                  className="rounded-lg max-w-xs w-full h-auto object-cover"
                />
              </div>
            )}

            <div className="text-xl text-gray-300">
              <p>{currentExercise.weight}</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="text-center mb-4">
              <span className="text-5xl font-bold text-blue-400">
                {completedSets + 1}
              </span>
              <span className="text-3xl text-gray-400"> / {totalSets}</span>
            </div>
            <p className="text-center text-gray-400">Current Set</p>
          </div>

          <div className="mb-8 text-center">
            <p className="text-2xl font-semibold">{currentExercise.setsReps.split('x')[1]} reps</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSetComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-xl"
            >
              Complete Set
            </button>

            <button
              onClick={onComplete}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              End Workout
            </button>
          </div>
        </div>
      )}

      {/* Exercise List */}
      <div className="mt-6 bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Exercises</h3>
        <div className="space-y-2">
          {routine.map((exercise, index) => (
            <div
              key={exercise.order}
              className={`flex justify-between items-center p-2 rounded ${
                index === currentExerciseIndex
                  ? 'bg-blue-900 bg-opacity-50'
                  : index < currentExerciseIndex
                  ? 'bg-green-900 bg-opacity-30 line-through text-gray-500'
                  : 'bg-gray-700'
              }`}
            >
              <span>{exercise.exercise}</span>
              <span className="text-sm text-gray-400">{exercise.setsReps}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WorkoutSession
