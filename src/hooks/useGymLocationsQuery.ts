import { useQuery } from '@tanstack/react-query';
import { services } from '../services';
import type { GymLocationResponse } from '../types/gymLocations';

export function useGymLocationsQuery() {
  return useQuery<GymLocationResponse>({
    queryKey: ['gym-locations'],
    queryFn: async () => await services.getClassService().getGymLocations().then(res => res.data)
  });
} 