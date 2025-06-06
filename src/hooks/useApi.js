import { useMutation, useQuery } from '@tanstack/react-query';
import { services } from '../services';
export function useApi({ queryKey, queryFn, options, }) {
    return useQuery({
        queryKey,
        queryFn: () => queryFn(),
        ...options,
        select: (data) => data.data,
    });
}
export function useApiMutation({ mutationFn, options, }) {
    return useMutation({
        mutationFn,
        ...options,
    });
}
export function useAvailableClassesQuery() {
    return useQuery({
        queryKey: ['available-classes'],
        queryFn: () => services.getClassService().getAvailableClasses().then(res => res.data),
    });
}
export function useClassDetailsQuery(classId) {
    return useQuery({
        queryKey: ['class-details', classId],
        queryFn: () => classId ? services.getClassService().getClassById(classId).then(res => res.data) : Promise.resolve(undefined),
        enabled: !!classId,
    });
}
export function useClassBookingDetailsQuery(classId) {
    return useQuery({
        queryKey: ['class-booking-details', classId],
        queryFn: async () => {
            if (!classId)
                return null;
            const response = await fetch(`http://localhost:8080/api/v1/class-bookings/details?classId=${classId}`, {
                headers: {
                    'token': 'FfbhuYx_pSVRl7npG8wQIw',
                },
            });
            if (!response.ok)
                throw new Error('Failed to fetch class booking details');
            const data = await response.json();
            return data.data?.classBooking;
        },
        enabled: !!classId,
    });
}
