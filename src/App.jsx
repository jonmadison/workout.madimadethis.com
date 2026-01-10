import { useState } from 'react'
import WorkoutSession from './components/WorkoutSession'
import workoutRoutine from './data/workoutRoutine.json'
import './App.css'

function App() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {!isWorkoutActive ? (
        <>
          {/* Fixed Header */}
          <div className="flex-shrink-0 px-4 py-6 border-b border-gray-800">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-center mb-4">Kettlebell Tracker</h1>
              <h2 className="text-2xl font-semibold text-center">{workoutRoutine.name}</h2>
            </div>
          </div>

          {/* Scrollable Exercise List */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-2xl mx-auto space-y-4">
              {workoutRoutine.exercises.map((exercise) => (
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

          {/* Fixed Button Section */}
          <div className="flex-shrink-0 px-4 py-6 border-t border-gray-800 bg-gray-900">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setIsWorkoutActive(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-full transition-colors text-lg min-h-[56px]"
              >
                Start Workout
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-8">
          <WorkoutSession
            routine={workoutRoutine.exercises}
            onComplete={() => setIsWorkoutActive(false)}
          />
        </div>
      )}
    </div>
  )
}

export default App
