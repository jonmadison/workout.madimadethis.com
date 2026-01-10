import { useState } from 'react'
import WorkoutSession from './components/WorkoutSession'
import workoutRoutine from './data/workoutRoutine.json'
import './App.css'

function App() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)

  return (
    <div className="h-full bg-gray-900 text-white relative overflow-hidden">
      {!isWorkoutActive ? (
        <>
          {/* Fixed Header */}
          <div className="px-4 pt-3 pb-2">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-center mb-2">Kettlebell Tracker</h1>
              <h2 className="text-xl text-center" style={{ fontWeight: 200 }}>{workoutRoutine.name} by {workoutRoutine.author}</h2>
            </div>
          </div>

          {/* Scrollable Exercise List - with padding-bottom for button */}
          <div className="overflow-y-auto px-4 pt-3" style={{ height: 'calc(100% - 120px)', paddingBottom: '100px' }}>
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

          {/* Fixed Button Section - Absolutely positioned at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pt-4 pb-4 bg-gray-900">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setIsWorkoutActive(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-colors text-base min-h-[52px]"
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
