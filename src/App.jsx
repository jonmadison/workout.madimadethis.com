import { useState, useEffect } from 'react'
import AuthWrapper from './components/AuthWrapper'
import Header from './components/Header'
import Workout from './components/Workout'
import Controls from './components/Controls'
import WorkoutSession from './components/WorkoutSession'
import workoutRoutine from './data/workoutRoutine.json'
import './App.css'

function App() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [workoutState, setWorkoutState] = useState(null)
  const [currentView, setCurrentView] = useState('home') // 'home' | 'calendar'

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
    } else if (currentView !== 'home') {
      setCurrentView('home')
    }
  }

  const handleNavigate = (view) => {
    if (isWorkoutActive) {
      alert('Please complete or end your workout first')
      return
    }
    setCurrentView(view)
  }

  return (
    <AuthWrapper>
      {({ user, onLogout }) => (
        <div className="h-full bg-gray-100 text-gray-900 overflow-hidden">
          {isWorkoutActive ? (
            // Workout session view
            <div className="h-full flex flex-col">
              <Header
                title="Kettlebell Tracker"
                onHomeClick={handleGoHome}
                currentView="workout"
                onNavigate={handleNavigate}
                onLogout={onLogout}
              />
              <WorkoutSession
                routine={workoutRoutine.exercises}
                onComplete={handleCompleteWorkout}
                initialState={workoutState}
                user={user}
              />
            </div>
          ) : currentView === 'home' ? (
            // Home view
            <div className="h-full flex flex-col">
              <Header
                title="Kettlebell Tracker"
                onHomeClick={handleGoHome}
                currentView={currentView}
                onNavigate={handleNavigate}
                onLogout={onLogout}
              />
              <Workout
                exercises={workoutRoutine.exercises}
                workoutName={workoutRoutine.name}
                workoutAuthor={workoutRoutine.author}
              />
              <Controls onStartWorkout={handleStartWorkout} />
            </div>
          ) : currentView === 'calendar' ? (
            // Calendar view (placeholder)
            <div className="h-full flex flex-col">
              <Header
                title="Kettlebell Tracker"
                onHomeClick={handleGoHome}
                currentView={currentView}
                onNavigate={handleNavigate}
                onLogout={onLogout}
              />
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-600">Calendar view coming soon...</p>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </AuthWrapper>
  )
}

export default App
