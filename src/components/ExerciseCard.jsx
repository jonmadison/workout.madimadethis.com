function ExerciseCard({ exercise, completedSets = 0 }) {
  // Parse sets from setsReps (e.g., "5x15" -> 5)
  const totalSets = parseInt(exercise.setsReps.split('x')[0]) || 0;
  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  return (
    <div
      className="rounded-2xl flex flex-col"
      style={{
        backgroundColor: '#fcfcfc',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}
    >
      {/* Exercise image */}
      <div className="flex justify-center mb-1">
        {exercise.image && (
          <img
            src={exercise.image}
            alt={exercise.exercise}
            className="object-contain"
            style={{ height: '78px', width: 'auto' }}
          />
        )}
      </div>

      {/* Exercise name */}
      <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
        {exercise.exercise}
      </h3>

      {/* Sets x Reps @ Weight */}
      <p className="text-xs text-gray-600">
        {exercise.setsReps} @ {exercise.weight}
      </p>

      {/* Progress bar for completed sets */}
      {totalSets > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
          <div
            className="bg-emerald-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default ExerciseCard;
