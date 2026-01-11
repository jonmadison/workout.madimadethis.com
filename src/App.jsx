import { useState, useEffect } from 'react'
import AuthWrapper from './components/AuthWrapper'
import Header from './components/Header'
import Workout from './components/Workout'
import Controls from './components/Controls'
import WorkoutSession from './components/WorkoutSession'
import CalendarView from './components/CalendarView'
import WorkoutLibrary from './components/WorkoutLibrary'
import WorkoutSelector from './components/WorkoutSelector'
import WorkoutEditor from './components/WorkoutEditor'
import {
  getWorkouts,
  createWorkout,
  getSelectedWorkoutId,
  setSelectedWorkoutId,
  seedDefaultWorkout,
} from './services/workoutLibraryService'
import { getTodaysWorkout } from './services/workoutService'
import './App.css'

function AppContent({ user, onLogout }) {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [workoutState, setWorkoutState] = useState(null)
  const [currentView, setCurrentView] = useState('home') // 'home' | 'calendar' | 'library'
  const [workouts, setWorkouts] = useState([])
  const [currentWorkout, setCurrentWorkout] = useState(null)
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false)
  const [showWorkoutEditor, setShowWorkoutEditor] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState(null)
  const [workoutCompletedToday, setWorkoutCompletedToday] = useState(false)

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

  // Load workouts when user is available
  const loadWorkouts = async (user) => {
    if (!user) return

    console.log('Loading workouts for user:', user.username)

    // First, ensure default workout is seeded
    const seedResult = await seedDefaultWorkout(user.username)
    console.log('Seed result:', seedResult)

    const result = await getWorkouts(user.username)
    console.log('getWorkouts result:', result)

    if (result.success && result.workouts.length > 0) {
      setWorkouts(result.workouts)

      // Set current workout (from localStorage or default to first)
      const savedWorkoutId = getSelectedWorkoutId()
      let selected = result.workouts.find(w => w.workoutId === savedWorkoutId)

      if (!selected) {
        selected = result.workouts.find(w => w.isDefault) || result.workouts[0]
      }

      console.log('Setting current workout:', selected.name)
      setCurrentWorkout(selected)
      setSelectedWorkoutId(selected.workoutId)
    } else {
      console.error('No workouts found or load failed:', result)
    }
  }

  // Load workouts when user changes
  useEffect(() => {
    if (user) {
      loadWorkouts(user)
      checkTodaysWorkout(user)
    }
  }, [user])

  // Check if today's workout is completed
  const checkTodaysWorkout = async (user) => {
    if (!user) return

    const result = await getTodaysWorkout(user.username)
    if (result.success) {
      setWorkoutCompletedToday(result.completed)
    }
  }

  const handleStartWorkout = () => {
    setWorkoutState(null)
    setIsWorkoutActive(true)
  }

  const handleCompleteWorkout = () => {
    localStorage.removeItem('workoutState')
    setWorkoutState(null)
    setIsWorkoutActive(false)
    // Refresh today's workout status after completion
    if (user) {
      checkTodaysWorkout(user)
    }
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

  const handleWorkoutSelect = (workout) => {
    setCurrentWorkout(workout)
    setSelectedWorkoutId(workout.workoutId)
  }

  const handleSwapWorkout = () => {
    setShowWorkoutSelector(true)
  }

  const handleEditWorkout = () => {
    setEditingWorkout(currentWorkout)
    setShowWorkoutEditor(true)
  }

  const handleSaveWorkout = async (workoutData, user) => {
    const newWorkout = {
      userId: user.username,
      workoutId: crypto.randomUUID(),
      ...workoutData,
      isDefault: false,
    }

    const result = await createWorkout(newWorkout)
    if (result.success) {
      await loadWorkouts(user)
      setShowWorkoutEditor(false)
      setEditingWorkout(null)
    } else {
      alert('Failed to save workout. Please try again.')
    }
  }

  if (!currentWorkout) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workouts...</p>
        </div>
      </div>
    )
  }

  return (
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
            user={user}
          />
          <WorkoutSession
            routine={currentWorkout.exercises}
            onComplete={handleCompleteWorkout}
            initialState={workoutState}
            user={user}
            workoutName={currentWorkout.name}
            workoutAuthor={currentWorkout.author}
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
            user={user}
          />
          <Workout
            exercises={currentWorkout.exercises}
            workoutName={currentWorkout.name}
            workoutAuthor={currentWorkout.author}
            onSwapWorkout={handleSwapWorkout}
            onEditWorkout={handleEditWorkout}
            completedToday={workoutCompletedToday}
          />
          <Controls onStartWorkout={handleStartWorkout} />
        </div>
      ) : currentView === 'calendar' ? (
        // Calendar view
        <div className="h-full flex flex-col">
          <Header
            title="Kettlebell Tracker"
            onHomeClick={handleGoHome}
            currentView={currentView}
            onNavigate={handleNavigate}
            onLogout={onLogout}
            user={user}
          />
          <CalendarView user={user} />
        </div>
      ) : currentView === 'library' ? (
        // Workout Library view
        <div className="h-full flex flex-col">
          <Header
            title="Kettlebell Tracker"
            onHomeClick={handleGoHome}
            currentView={currentView}
            onNavigate={handleNavigate}
            onLogout={onLogout}
            user={user}
          />
          <WorkoutLibrary
            user={user}
            selectedWorkoutId={currentWorkout?.workoutId}
            onWorkoutSelect={handleWorkoutSelect}
          />
        </div>
      ) : null}

      {/* Modals */}
      {showWorkoutSelector && (
        <WorkoutSelector
          workouts={workouts}
          selectedWorkoutId={currentWorkout?.workoutId}
          onSelect={handleWorkoutSelect}
          onClose={() => setShowWorkoutSelector(false)}
        />
      )}

      {showWorkoutEditor && (
        <WorkoutEditor
          workout={editingWorkout}
          onSave={(workoutData) => handleSaveWorkout(workoutData, user)}
          onCancel={() => {
            setShowWorkoutEditor(false)
            setEditingWorkout(null)
          }}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthWrapper>
      {({ user, onLogout }) => (
        <AppContent user={user} onLogout={onLogout} />
      )}
    </AuthWrapper>
  )
}

export default App
