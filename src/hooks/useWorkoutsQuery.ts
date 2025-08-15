import { useQuery } from '@tanstack/react-query';
import { services } from '../services';
import type { WorkoutWrapper } from '../types/workoutWrapper';
import type { Workout } from '../types/workout';

export function useWorkoutsQuery() {
  return useQuery<WorkoutWrapper>({
    queryKey: ['workouts'],
    queryFn: () => services.getWorkoutService()
    .getWorkouts()
    .then(res => {
      console.log('useWorkoutsQuery - fetched workouts:', res.data);
      return res.data;
    }),
  });
}

export function useWorkoutDetailsQuery(workoutId?: number) {
  return useQuery<Workout | undefined>({
    queryKey: ['workout-details', workoutId],
    queryFn: () => workoutId ? services.getWorkoutService().getWorkoutDetails(workoutId).then(res => res.data) : Promise.resolve(undefined),
    enabled: !!workoutId,
  });
} 