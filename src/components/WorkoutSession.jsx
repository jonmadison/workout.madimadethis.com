import { useState, useEffect } from 'react'
import RestTimer from './RestTimer'

function WorkoutSession({ routine, onComplete, initialState }) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(initialState?.currentExerciseIndex || 0)
  const [completedSets, setCompletedSets] = useState(initialState?.completedSets || 0)
  const [isResting, setIsResting] = useState(initialState?.isResting || false)
  const [restTime, setRestTime] = useState(initialState?.restTime || 0)

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

  // Save workout state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      currentExerciseIndex,
      completedSets,
      isResting,
      restTime
    }
    localStorage.setItem('workoutState', JSON.stringify(state))
  }, [currentExerciseIndex, completedSets, isResting, restTime])

  const progress = ((currentExerciseIndex * 100) / routine.length).toFixed(0)

  return (
    <div id="workout-session" className="h-full flex flex-col">
      {/* Progress Bar */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2">
        <div className="max-w-2xl mx-auto">
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
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-32">
        <div className="max-w-2xl mx-auto">
          {isResting ? (
            <RestTimer
              duration={restTime}
              onComplete={handleRestComplete}
              onSkip={handleSkipRest}
            />
          ) : (
            <div className="bg-white rounded-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">{currentExercise.exercise}</h2>

                {currentExercise.image && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={currentExercise.image}
                      alt={currentExercise.exercise}
                      className="rounded-lg max-w-xs w-full h-auto object-cover"
                    />
                  </div>
                )}

                <div className="text-xl text-gray-700">
                  <p>{currentExercise.weight}</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-center mb-4">
                  <span className="text-5xl font-bold text-blue-600">
                    {completedSets + 1}
                  </span>
                  <span className="text-3xl text-gray-600"> / {totalSets}</span>
                </div>
                <p className="text-center text-gray-600">Current Set</p>
              </div>

              <div className="mb-8 text-center">
                <p className="text-2xl font-semibold text-gray-900">{currentExercise.setsReps.split('x')[1]} reps</p>
              </div>
            </div>
          )}

          {/* Exercise List */}
          <div className="mt-6 bg-white rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">Exercises</h3>
            <div className="space-y-2">
              {routine.map((exercise, index) => (
                <div
                  key={exercise.order}
                  className={`flex justify-between items-center p-2 rounded ${
                    index === currentExerciseIndex
                      ? 'bg-blue-100 text-blue-900'
                      : index < currentExerciseIndex
                      ? 'bg-green-100 line-through text-gray-500'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <span>{exercise.exercise}</span>
                  <span className="text-sm text-gray-600">{exercise.setsReps}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Buttons at Bottom */}
      <div style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', zIndex: 10 }}>
        <div className="max-w-2xl mx-auto space-y-3">
          {!isResting && (
            <button
              onClick={handleSetComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full transition-colors text-lg min-h-[52px] shadow-lg"
            >
              Complete Set
            </button>
          )}
          <button
            onClick={onComplete}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-full transition-colors min-h-[48px] shadow-lg"
          >
            End Workout
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkoutSession
