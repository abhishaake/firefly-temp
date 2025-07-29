import { useQuery } from '@tanstack/react-query';

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
      const response = await fetch('https://firefly-admin.cozmotech.ie/api/v1/gym-locations', {
        headers: {
          'token': 'FfbhuYx_pSVRl7npG8wQIw',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gym locations');
      }

      return response.json();
    },
  });
} 