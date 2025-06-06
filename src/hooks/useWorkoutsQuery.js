import { useQuery } from '@tanstack/react-query';
import { services } from '../services';
export function useWorkoutsQuery() {
    return useQuery({
        queryKey: ['workouts'],
        queryFn: () => services.getWorkoutService().getWorkouts().then(res => res.data),
    });
}
export function useWorkoutDetailsQuery(workoutId) {
    return useQuery({
        queryKey: ['workout-details', workoutId],
        queryFn: () => workoutId ? services.getWorkoutService().getWorkoutDetails(workoutId).then(res => res.data) : Promise.resolve(undefined),
        enabled: !!workoutId,
    });
}
