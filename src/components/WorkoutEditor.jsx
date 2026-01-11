import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdDragIndicator, MdDelete, MdClose, MdAdd } from 'react-icons/md';

function SortableExercise({ exercise, onUpdate, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChange = (field, value) => {
    onUpdate(exercise.id, { ...exercise, [field]: value });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white p-4 rounded-lg border border-gray-200 mb-3"
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <MdDragIndicator size={24} />
        </button>

        {/* Exercise Fields */}
        <div className="flex-1 space-y-3">
          {/* Exercise Name */}
          <input
            type="text"
            value={exercise.exercise}
            onChange={(e) => handleChange('exercise', e.target.value)}
            placeholder="Exercise name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Sets, Reps, Weight */}
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              value={exercise.setsReps}
              onChange={(e) => handleChange('setsReps', e.target.value)}
              placeholder="Sets x Reps"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="text"
              value={exercise.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              placeholder="Weight"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="number"
              value={exercise.rest}
              onChange={(e) => handleChange('rest', parseInt(e.target.value) || 0)}
              placeholder="Rest (s)"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onRemove(exercise.id)}
          className="mt-2 text-red-500 hover:text-red-700"
        >
          <MdDelete size={20} />
        </button>
      </div>
    </div>
  );
}

function WorkoutEditor({ workout, onSave, onCancel }) {
  const [name, setName] = useState(workout?.name || '');
  const [author, setAuthor] = useState(workout?.author || 'Custom');
  const [exercises, setExercises] = useState(
    workout?.exercises.map((ex, idx) => ({
      ...ex,
      id: `exercise-${idx}`,
    })) || []
  );
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setExercises((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleUpdateExercise = (id, updatedExercise) => {
    setExercises((items) =>
      items.map((item) => (item.id === id ? updatedExercise : item))
    );
  };

  const handleRemoveExercise = (id) => {
    if (exercises.length === 1) {
      alert('A workout must have at least one exercise');
      return;
    }
    const confirmed = window.confirm('Remove this exercise?');
    if (confirmed) {
      setExercises((items) => items.filter((item) => item.id !== id));
    }
  };

  const handleAddExercise = () => {
    const newExercise = {
      id: `exercise-${Date.now()}`,
      order: exercises.length + 1,
      exercise: '',
      setsReps: '3x8',
      weight: '25 lb',
      rest: 60,
      image: '',
      bellConfig: 'single',
    };
    setExercises((items) => [...items, newExercise]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a workout name');
      return;
    }

    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    // Validate all exercises have names
    const hasEmptyExercises = exercises.some((ex) => !ex.exercise.trim());
    if (hasEmptyExercises) {
      alert('Please enter names for all exercises');
      return;
    }

    setIsSaving(true);

    // Prepare workout data (remove temporary IDs, update order)
    const workoutData = {
      name: name.trim(),
      author: author.trim(),
      exercises: exercises.map((ex, idx) => {
        const { id, ...exerciseData } = ex;
        return {
          ...exerciseData,
          order: idx + 1,
        };
      }),
    };

    await onSave(workoutData);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">
            {workout ? 'Edit Workout' : 'New Workout'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Workout Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Lifetime Kettlebell - Heavy"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Exercises */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Exercises
              </label>
              <button
                onClick={handleAddExercise}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <MdAdd size={20} />
                Add Exercise
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={exercises.map((ex) => ex.id)}
                strategy={verticalListSortingStrategy}
              >
                {exercises.map((exercise) => (
                  <SortableExercise
                    key={exercise.id}
                    exercise={exercise}
                    onUpdate={handleUpdateExercise}
                    onRemove={handleRemoveExercise}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {exercises.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No exercises yet. Click "Add Exercise" to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-white rounded-b-lg">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Workout'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkoutEditor;
