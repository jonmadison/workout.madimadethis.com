import { useState } from 'react'
import WorkoutSession from './components/WorkoutSession'
import workoutRoutine from './data/workoutRoutine.json'
import './App.css'

function App() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden">
      {!isWorkoutActive ? (
        <div className="h-full flex flex-col">
          {/* Fixed Header */}
          <div className="px-4 pt-3 pb-2 flex-shrink-0">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-center mb-2">Kettlebell Tracker</h1>
              <h2 className="text-xl text-center" style={{ fontWeight: 200 }}>{workoutRoutine.name} by {workoutRoutine.author}</h2>
            </div>
          </div>

          {/* Scrollable Exercise List */}
          <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24">
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

          {/* Fixed Button Section - using fixed positioning */}
          <div style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', zIndex: 10 }}>
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setIsWorkoutActive(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-colors text-base min-h-[52px] shadow-lg"
              >
                Start Workout
              </button>
            </div>
          </div>
        </div>
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
