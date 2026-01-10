function Controls({ onStartWorkout }) {
  return (
    <div style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', zIndex: 10 }}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onStartWorkout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full transition-colors text-base min-h-[52px] shadow-lg"
        >
          Start Workout
        </button>
      </div>
    </div>
  )
}

export default Controls
