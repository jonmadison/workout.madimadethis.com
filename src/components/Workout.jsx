import { MdOutlineSwapHorizontalCircle } from 'react-icons/md';
import ExerciseCard from './ExerciseCard';
import ktrainerLogo from '../assets/ktrainer-logo.png';

function Workout({ exercises, workoutName, workoutAuthor, onSwapWorkout, onStartWorkout, onResumeWorkout, onStopWorkout, isWorkoutInProgress = false, completedToday = false, completedSetsMap = {} }) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div id="workout" className="flex-1 overflow-y-auto flex flex-col">
      {/* Header section */}
      <div className="px-5 pb-6">
        <div className="flex items-start">
          {/* Workout title - 60% */}
          <div className="w-[60%] text-left">
            <p className="text-base text-gray-900" style={{ fontWeight: 200 }}>Current Workout</p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-1">
              {workoutName}
            </h1>
            <p className="text-sm text-gray-500 text-left">by {workoutAuthor}</p>
          </div>

          {/* Logo - 40% */}
          <div className="w-[40%]">
            <img
              src={ktrainerLogo}
              alt="Kettlebell Tracker"
              className="object-contain"
              style={{ width: '100%', maxWidth: '250px', opacity: 0.55 }}
            />
          </div>
        </div>
      </div>

      {/* Today's workout section - full width, top rounded only, overlaps logo */}
      <div className="flex-1 bg-white rounded-t-3xl p-4 flex flex-col -mt-16 relative z-10">
        {/* Section header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Today's workout</h2>
          <button
            onClick={onSwapWorkout}
            className="text-gray-400 hover:text-emerald-500 transition-colors"
            title="Change workout"
          >
            <MdOutlineSwapHorizontalCircle size={24} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">{formattedDate}</p>

        {/* 2x2 Grid of exercise cards */}
        <div className="grid grid-cols-2 gap-3 items-start">
          {exercises.map((exercise) => {
            // If workout completed today, show full progress bar
            const totalSets = parseInt(exercise.setsReps.split('x')[0]) || 0;
            const completedSets = completedToday ? totalSets : (completedSetsMap[exercise.order] || 0);
            return (
              <ExerciseCard
                key={exercise.order}
                exercise={exercise}
                completedSets={completedSets}
              />
            );
          })}
        </div>

        {/* Workout buttons */}
        <div className="mt-4 pb-4 space-y-3">
          {isWorkoutInProgress ? (
            <>
              <button
                onClick={onResumeWorkout}
                className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-full transition-colors text-base min-h-[52px] shadow-lg uppercase tracking-wide"
              >
                Resume Workout
              </button>
              <button
                onClick={onStopWorkout}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-3 px-8 rounded-full transition-colors text-sm min-h-[44px] uppercase tracking-wide"
              >
                Stop Current Workout
              </button>
            </>
          ) : (
            <button
              onClick={onStartWorkout}
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-full transition-colors text-base min-h-[52px] shadow-lg uppercase tracking-wide"
            >
              Start Workout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Workout
