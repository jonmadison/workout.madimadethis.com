import { MdTimer } from 'react-icons/md';

function ExerciseCard({ exercise, completedToday }) {
  return (
    <div
      className="rounded-lg p-4 flex items-center gap-4"
      style={{
        backgroundColor: '#fcfcfc',
        borderTop: completedToday ? '4px solid #10b981' : 'none'
      }}
    >
      {/* Large exercise number */}
      <span
        className="font-bold flex-shrink-0 text-emerald-200"
        style={{ fontSize: '120px', lineHeight: 1, fontFamily: 'Impact, sans-serif', marginLeft: '32px' }}
      >
        {exercise.order}
      </span>

      {/* Exercise image */}
      {exercise.image && (
        <img
          src={exercise.image}
          alt={exercise.exercise}
          className="object-contain flex-shrink-0"
          style={{ height: '120px', width: 'auto' }}
        />
      )}

      {/* Exercise details */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-semibold text-teal-600 lowercase">
          {exercise.exercise}
        </h3>
        <p className="text-gray-700 font-medium">
          {exercise.setsReps} @ {exercise.weight}
        </p>
        <span className="flex items-center justify-center gap-1 text-gray-700">
          <MdTimer size={18} />
          <span style={{ fontSize: '18px' }}>{exercise.rest}s</span>
        </span>
      </div>
    </div>
  );
}

export default ExerciseCard;
