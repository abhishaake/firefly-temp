import { useQuery } from '@tanstack/react-query';
import { services } from '../services';

interface GymLocation {
  id: number;
  name: string;
}

interface GymLocationsResponse {
  data: GymLocation[];
  success: boolean;
  statusCode: number;
  message: string;
}

export function useGymLocationsQuery() {
  return useQuery<GymLocationsResponse>({
    queryKey: ['gym-locations'],
    queryFn: async () => {
      const response = await services.getClassService().getGymLocations();
      return {
        data: response.data,
        success: response.status === 200,
        statusCode: response.status,
        message: response.message,
      };
    },
  });
} 