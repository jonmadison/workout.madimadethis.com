import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  WorkoutHistory: a
    .model({
      userId: a.string().required(),
      workoutDate: a.string().required(),
      workoutId: a.id().required(),
      routineName: a.string(),
      routineAuthor: a.string(),
      status: a.string(),
      completedExercises: a.integer(),
      totalExercises: a.integer(),
      durationMinutes: a.integer(),
      exercises: a.json(),
    })
    .authorization((allow) => [
      allow.owner().to(['create', 'read', 'update', 'delete']),
    ])
    .identifier(['userId', 'workoutDate']),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
