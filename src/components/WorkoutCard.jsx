import { MdEdit, MdDelete, MdCheckCircle } from 'react-icons/md';

function WorkoutCard({ workout, isSelected, onSelect, onEdit, onDelete }) {
  const exerciseCount = workout.exercises?.length || 0;

  return (
    <div
      className={`bg-white rounded-lg p-5 border-2 transition-all ${
        isSelected
          ? 'border-blue-600 shadow-lg'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
            {isSelected && (
              <MdCheckCircle className="text-blue-600" size={20} />
            )}
          </div>
          <p className="text-sm text-gray-600">by {workout.author}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit workout"
          >
            <MdEdit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete workout"
          >
            <MdDelete size={18} />
          </button>
        </div>
      </div>

      {/* Exercise Count */}
      <div className="mb-3">
        <p className="text-sm text-gray-700">
          {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
        </p>
      </div>

      {/* Exercise Preview */}
      <div className="space-y-1 mb-4">
        {workout.exercises?.slice(0, 3).map((exercise, idx) => (
          <div key={idx} className="text-xs text-gray-600">
            {exercise.order}. {exercise.exercise} - {exercise.setsReps}
          </div>
        ))}
        {exerciseCount > 3 && (
          <div className="text-xs text-gray-500 italic">
            +{exerciseCount - 3} more...
          </div>
        )}
      </div>

      {/* Select Button */}
      {!isSelected && (
        <button
          onClick={onSelect}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Use This Workout
        </button>
      )}
      {isSelected && (
        <div className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium text-center">
          Currently Selected
        </div>
      )}
    </div>
  );
}

export default WorkoutCard;
