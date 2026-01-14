import { useState, useEffect } from 'react'
import MonthlyCalendar from './MonthlyCalendar'
import WorkoutHistoryList from './WorkoutHistoryList'
import { getWorkoutsByMonth, deleteWorkout } from '../services/workoutService'

function CalendarView({ user }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [monthWorkouts, setMonthWorkouts] = useState([])
  const [dateWorkouts, setDateWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load workouts for the current month
  useEffect(() => {
    loadMonthWorkouts()
  }, [selectedDate, user])

  // Load workouts for the selected date
  useEffect(() => {
    loadDateWorkouts()
  }, [selectedDate, monthWorkouts])

  const loadMonthWorkouts = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const year = selectedDate.getFullYear()
      const month = selectedDate.getMonth()

      const result = await getWorkoutsByMonth(user.username, year, month)

      if (result.success) {
        setMonthWorkouts(result.workouts || [])
      } else {
        setError(result.error || 'Failed to load workouts')
      }
    } catch (err) {
      console.error('Error loading month workouts:', err)
      setError('Failed to load workouts')
    } finally {
      setLoading(false)
    }
  }

  const loadDateWorkouts = () => {
    if (!selectedDate || !monthWorkouts) return

    // Filter workouts for the selected date
    const selectedDateString = selectedDate.toDateString()
    const workoutsForDate = monthWorkouts.filter((workout) => {
      const workoutDate = new Date(workout.workoutDate)
      return workoutDate.toDateString() === selectedDateString
    })

    setDateWorkouts(workoutsForDate)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  const handleMonthChange = (date) => {
    setSelectedDate(date)
  }

  const handleDeleteWorkout = async (workoutId) => {
    const confirmed = window.confirm('Are you sure you want to delete this workout?')
    if (!confirmed) return

    const result = await deleteWorkout(workoutId)
    if (result.success) {
      // Reload workouts
      loadMonthWorkouts()
    } else {
      alert('Failed to delete workout. Please try again.')
    }
  }

  // Get completed workout dates for the calendar
  const completedWorkouts = monthWorkouts.filter(workout => {
    console.log('Workout status:', workout.status, 'for workout:', workout.workoutId)
    return workout.status === 'completed'
  })
  const completedWorkoutDates = completedWorkouts.map(workout => workout.workoutDate)

  console.log('=== Calendar Highlighting Debug ===')
  console.log('Total month workouts:', monthWorkouts.length)
  console.log('Completed workouts:', completedWorkouts.length)
  console.log('Completed workout dates:', completedWorkoutDates)
  console.log('Sample workout:', monthWorkouts[0])

  return (
    <div id="calendar-view" className="h-full flex flex-col overflow-hidden">
      {/* Calendar Container - Fixed Height */}
      <div className="flex-shrink-0 p-4 bg-gray-100">
        <div className="max-w-2xl mx-auto">
          {loading && monthWorkouts.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading calendar...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-red-700">{error}</p>
              <button
                onClick={loadMonthWorkouts}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <MonthlyCalendar
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              completedWorkoutDates={completedWorkoutDates}
            />
          )}
        </div>
      </div>

      {/* Workout History List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <div className="max-w-2xl mx-auto">
          {loading && monthWorkouts.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-gray-600">Loading workouts...</p>
            </div>
          ) : (
            <WorkoutHistoryList
              workouts={dateWorkouts}
              selectedDate={selectedDate}
              onDeleteWorkout={handleDeleteWorkout}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default CalendarView
