import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './MonthlyCalendar.css'

function MonthlyCalendar({ selectedDate, onSelectDate, completedWorkoutDates }) {
  // Create a Set of completed workout date strings for quick lookup
  const completedDateSet = new Set(
    completedWorkoutDates.map(date => new Date(date).toDateString())
  )

  // Custom tile content - no dots needed anymore
  const tileContent = ({ date, view }) => {
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
      if (completedDateSet.has(dateString)) {
        return 'completed-workout'
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
