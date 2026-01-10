import { useState } from 'react'
import WorkoutSession from './components/WorkoutSession'
import workoutRoutine from './data/workoutRoutine.json'
import './App.css'

function App() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Kettlebell Tracker</h1>

        {!isWorkoutActive ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">{workoutRoutine.name}</h2>
              <div className="space-y-4">
                {workoutRoutine.exercises.map((exercise) => (
                  <div key={exercise.order} className="bg-gray-700 rounded-lg p-4">
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

            <button
              onClick={() => setIsWorkoutActive(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-full transition-colors text-lg min-h-[56px]"
            >
              Start Workout
            </button>
          </div>
        ) : (
          <WorkoutSession
            routine={workoutRoutine.exercises}
            onComplete={() => setIsWorkoutActive(false)}
          />
        )}
      </div>
    </div>
  )
}

export default App
