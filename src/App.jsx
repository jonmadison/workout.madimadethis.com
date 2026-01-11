import { useState } from 'react'
import Header from './components/Header'
import Workout from './components/Workout'
import Controls from './components/Controls'
import WorkoutSession from './components/WorkoutSession'
import workoutRoutine from './data/workoutRoutine.json'
import './App.css'

function App() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)

  return (
    <div className="h-full bg-gray-100 text-gray-900 overflow-hidden">
      {!isWorkoutActive ? (
        <div className="h-full flex flex-col">
          <Header
            title="Kettlebell Tracker"
            subtitle={`${workoutRoutine.name} by ${workoutRoutine.author}`}
          />
          <Workout exercises={workoutRoutine.exercises} />
          <Controls onStartWorkout={() => setIsWorkoutActive(true)} />
        </div>
      ) : (
        <WorkoutSession
          routine={workoutRoutine.exercises}
          onComplete={() => setIsWorkoutActive(false)}
        />
      )}
    </div>
  )
}

export default App
