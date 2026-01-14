import { useState, useEffect } from 'react'
import RestTimer from './RestTimer'
import { saveWorkout } from '../services/workoutService'
import { MdChevronRight } from 'react-icons/md'

function WorkoutSession({ routine, onComplete, initialState, user, workoutName, workoutAuthor }) {
  const [startTime] = useState(() => initialState?.startTime || new Date().toISOString())
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(initialState?.currentExerciseIndex || 0)
  const [completedSets, setCompletedSets] = useState(initialState?.completedSets || 0)
  // When resuming, skip rest state and go straight to the exercise
  const [isResting, setIsResting] = useState(false)
  const [restTime, setRestTime] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const currentExercise = routine[currentExerciseIndex]
  const nextExercise = routine[currentExerciseIndex + 1]
  const totalSets = parseInt(currentExercise.setsReps.split('x')[0])
  const reps = currentExercise.setsReps.split('x')[1]

  // Elapsed time timer
  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(startTime)
      const now = new Date()
      setElapsedSeconds(Math.floor((now - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSetComplete = () => {
    const newCompletedSets = completedSets + 1

    if (newCompletedSets >= totalSets) {
      if (currentExerciseIndex < routine.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1)
        setCompletedSets(0)
        setIsResting(true)
        setRestTime(currentExercise.rest)
      } else {
        // Pass the new value directly since state won't update in time
        handleSaveAndComplete(newCompletedSets)
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

  const handleStartRest = () => {
    setIsResting(true)
    setRestTime(currentExercise.rest)
  }

  // Save workout state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      currentExerciseIndex,
      completedSets,
      isResting,
      restTime,
      startTime
    }
    localStorage.setItem('workoutState', JSON.stringify(state))
  }, [currentExerciseIndex, completedSets, isResting, restTime, startTime])

  const handleSaveAndComplete = async (finalCompletedSets = completedSets) => {
    try {
      const endTime = new Date()
      const start = new Date(startTime)
      const durationMinutes = Math.round((endTime - start) / 1000 / 60)

      const isFullyCompleted = currentExerciseIndex === routine.length - 1 && finalCompletedSets >= parseInt(routine[currentExerciseIndex].setsReps.split('x')[0])
      const completedExercisesCount = currentExerciseIndex + (isFullyCompleted ? 1 : 0)

      const exercisesData = routine.map((exercise, index) => {
        const totalSets = parseInt(exercise.setsReps.split('x')[0])
        let exerciseCompletedSets = 0
        let exerciseStatus = 'skipped'

        if (index < currentExerciseIndex) {
          exerciseCompletedSets = totalSets
          exerciseStatus = 'completed'
        } else if (index === currentExerciseIndex) {
          exerciseCompletedSets = finalCompletedSets
          if (finalCompletedSets >= totalSets) {
            exerciseStatus = 'completed'
          } else if (finalCompletedSets > 0) {
            exerciseStatus = 'partial'
          }
        }

        return {
          order: exercise.order,
          exercise: exercise.exercise,
          setsReps: exercise.setsReps,
          weight: exercise.weight,
          completedSets: exerciseCompletedSets,
          totalSets: totalSets,
          status: exerciseStatus
        }
      })

      const workoutData = {
        userId: user.username,
        workoutDate: startTime,
        workoutId: crypto.randomUUID(),
        routineName: workoutName,
        routineAuthor: workoutAuthor,
        status: isFullyCompleted ? 'completed' : 'partial',
        completedExercises: completedExercisesCount,
        totalExercises: routine.length,
        durationMinutes: durationMinutes,
        exercises: JSON.stringify(exercisesData)
      }

      const saveResult = await saveWorkout(workoutData)
      console.log('Workout saved successfully:', workoutData)
      console.log('Save result:', saveResult)
    } catch (error) {
      console.error('Failed to save workout:', error)
    }

    onComplete()
  }

  // Circular progress calculation
  const progressPercent = (completedSets / totalSets) * 100
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  return (
    <div id="workout-session" className="h-full flex flex-col bg-gray-50">
      {/* Rest Timer Bottom Sheet */}
      <RestTimer
        duration={restTime}
        onComplete={handleRestComplete}
        onSkip={handleSkipRest}
        nextExercise={nextExercise}
        isOpen={isResting}
      />
      {/* Progress Bar */}
      <div className="flex-shrink-0 px-4 pt-2 bg-white" style={{ paddingBottom: '12px' }}>
        <h2 className="text-base font-bold text-gray-900 mb-1">{currentExercise.exercise}</h2>
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Exercise {currentExerciseIndex + 1} of {routine.length}</span>
          <span>Total {formatTime(elapsedSeconds)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-emerald-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentExerciseIndex) / routine.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-56">
        {/* Exercise Image */}
        <div className="flex justify-center mb-8">
          {currentExercise.image && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden inline-block">
              <img
                src={currentExercise.image}
                alt={currentExercise.exercise}
                className="h-36 object-contain bg-gray-100"
              />
            </div>
          )}
        </div>

        {/* Circular Progress with Sets Info */}
        <div className="flex flex-col items-center mb-20">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - progressPercent / 100)}
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-gray-500">{completedSets}/{totalSets} Sets</span>
              <p className="text-3xl font-bold text-gray-900">{reps}</p>
              <p className="text-xs text-gray-500">Reps</p>
              <p className="text-sm text-gray-600">{currentExercise.weight}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Buttons and Next Exercise */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }} className="bg-gray-50 px-4 pb-4 pt-2">
        {/* Buttons */}
        <div className="space-y-3 mb-4">
          <button
            onClick={handleSetComplete}
            className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-full transition-colors text-base min-h-[52px] uppercase tracking-wide"
          >
            Complete Set
          </button>
          <button
            onClick={handleStartRest}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-full transition-colors text-base min-h-[48px] border border-gray-300 uppercase tracking-wide"
          >
            Rest Timer
          </button>
        </div>

        {/* Next Exercise Mini-Card */}
        {nextExercise && (
          <div className="bg-white rounded-xl p-3 flex items-center shadow-sm">
            {nextExercise.image && (
              <img
                src={nextExercise.image}
                alt={nextExercise.exercise}
                className="w-12 h-12 object-contain rounded-lg bg-gray-100 mr-3"
              />
            )}
            <div className="flex-1 text-center pr-[60px]">
              <p className="text-sm text-gray-500">Next:</p>
              <p className="font-semibold text-gray-900">{nextExercise.exercise}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkoutSession
