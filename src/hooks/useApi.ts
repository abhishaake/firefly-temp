import { useMutation, useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ApiResponse } from '../types/api';
import { services } from '../services';
import type { ClassItem } from '../types/class';

interface UseApiOptions<TData, TVariables> {
  queryKey: string[];
  queryFn: (variables?: TVariables) => Promise<ApiResponse<TData>>;
  options?: Omit<UseQueryOptions<ApiResponse<TData>, Error, TData>, 'queryKey' | 'queryFn'>;
}

interface UseApiMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>;
  options?: Omit<UseMutationOptions<ApiResponse<TData>, Error, TVariables>, 'mutationFn'>;
}

export function useApi<TData, TVariables = void>({
  queryKey,
  queryFn,
  options,
}: UseApiOptions<TData, TVariables>) {
  return useQuery<ApiResponse<TData>, Error, TData>({
    queryKey,
    queryFn: () => queryFn(),
    ...options,
    select: (data) => data.data,
  });
}

export function useApiMutation<TData, TVariables>({
  mutationFn,
  options,
}: UseApiMutationOptions<TData, TVariables>) {
  return useMutation<ApiResponse<TData>, Error, TVariables>({
    mutationFn,
    ...options,
  });
}

export function useAvailableClassesQuery() {
  return useQuery<ClassItem[]>({
    queryKey: ['available-classes'],
    queryFn: () => services.getClassService().getAvailableClasses().then(res => res.data),
  });
}

export function useClassDetailsQuery(classId?: string) {
  return useQuery<ClassItem | undefined>({
    queryKey: ['class-details', classId],
    queryFn: () => classId ? services.getClassService().getClassById(classId).then(res => res.data) : Promise.resolve(undefined),
    enabled: !!classId,
  });
}

export function useClassBookingDetailsQuery(classId?: string) {
  return useQuery({
    queryKey: ['class-booking-details', classId],
    queryFn: async () => {
      if (!classId) return null;
      const response = await fetch(`https://firefly-admin.cozmotech.ie/api/v1/class-bookings/details?classId=${classId}`, {
        headers: {
          'token': 'FfbhuYx_pSVRl7npG8wQIw',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch class booking details');
      const data = await response.json();
      return data.data?.classBooking;
    },
    enabled: !!classId,
  });
} 