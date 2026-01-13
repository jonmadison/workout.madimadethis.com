function Controls({ onStartWorkout }) {
  return (
    <div id="controls" style={{ position: 'fixed', bottom: '16px', left: '16px', right: '16px', zIndex: 10 }}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onStartWorkout}
          className="w-full bg-emerald-200 hover:bg-emerald-300 text-gray-800 font-bold py-4 px-8 rounded-full transition-colors text-base min-h-[52px] shadow-lg"
        >
          Start Workout
        </button>
      </div>
    </div>
  )
}

export default Controls
