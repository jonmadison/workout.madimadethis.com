import { useState, useEffect } from 'react'
import Header from './components/Header'
import Workout from './components/Workout'
import Controls from './components/Controls'
import WorkoutSession from './components/WorkoutSession'
import workoutRoutine from './data/workoutRoutine.json'
import './App.css'

function App() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [workoutState, setWorkoutState] = useState(null)

  // Check localStorage on mount to restore workout state
  useEffect(() => {
    const savedState = localStorage.getItem('workoutState')
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        setWorkoutState(parsedState)
        setIsWorkoutActive(true)
      } catch (e) {
        console.error('Failed to parse workout state:', e)
        localStorage.removeItem('workoutState')
      }
    }
  }, [])

  const handleStartWorkout = () => {
    setWorkoutState(null)
    setIsWorkoutActive(true)
  }

  const handleCompleteWorkout = () => {
    localStorage.removeItem('workoutState')
    setWorkoutState(null)
    setIsWorkoutActive(false)
  }

  const handleGoHome = () => {
    if (isWorkoutActive) {
      const confirmExit = window.confirm('Are you sure you want to end your workout and go home?')
      if (confirmExit) {
        handleCompleteWorkout()
      }
    }
  }

  return (
    <div className="h-full bg-gray-100 text-gray-900 overflow-hidden">
      {!isWorkoutActive ? (
        <div className="h-full flex flex-col">
          <Header
            title="Kettlebell Tracker"
            onHomeClick={handleGoHome}
          />
          <Workout
            exercises={workoutRoutine.exercises}
            workoutName={workoutRoutine.name}
            workoutAuthor={workoutRoutine.author}
          />
          <Controls onStartWorkout={handleStartWorkout} />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <Header
            title="Kettlebell Tracker"
            onHomeClick={handleGoHome}
          />
          <WorkoutSession
            routine={workoutRoutine.exercises}
            onComplete={handleCompleteWorkout}
            initialState={workoutState}
          />
        </div>
      )}
    </div>
  )
}

export default App
