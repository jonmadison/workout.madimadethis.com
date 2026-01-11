import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './MonthlyCalendar.css'

function MonthlyCalendar({ selectedDate, onSelectDate, workoutDates }) {
  // Create a Set of date strings for quick lookup
  const workoutDateSet = new Set(
    workoutDates.map(date => new Date(date).toDateString())
  )

  // Custom tile content to show dots for workout days
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString()
      if (workoutDateSet.has(dateString)) {
        return (
          <div className="workout-indicator">
            <div className="workout-dot"></div>
          </div>
        )
      }
    }
    return null
  }

  // Custom class name for tiles
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString()
      const selectedDateString = selectedDate ? new Date(selectedDate).toDateString() : null

      if (dateString === selectedDateString) {
        return 'selected-date'
      }
      if (workoutDateSet.has(dateString)) {
        return 'has-workout'
      }
    }
    return null
  }

  return (
    <div className="monthly-calendar">
      <Calendar
        value={selectedDate ? new Date(selectedDate) : new Date()}
        onChange={onSelectDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        maxDate={new Date()}
        showNeighboringMonth={false}
      />
    </div>
  )
}

export default MonthlyCalendar
