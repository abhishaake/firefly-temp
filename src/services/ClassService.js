import { BaseApiService } from './BaseApiService';
const mockClasses = [
    {
        classId: '1',
        className: 'Flow Mobility',
        date: '13 May,2025',
        startTimeEpoch: '1715580600', // Example epoch for 11:30 AM
        trainer: 'Anna Rowe',
        gymLocation: 'Dublin Central',
        workoutName: 'Workout Block 1',
        description: 'Mobility class',
    },
    {
        classId: '2',
        className: 'Cardio Crush',
        date: '13 May,2025',
        startTimeEpoch: '1715589600', // Example epoch for 01:00 PM
        trainer: 'Anna Rowe',
        gymLocation: 'Galway Bay',
        workoutName: 'Workout Block 1',
        description: 'Cardio class',
    },
    {
        classId: '3',
        className: 'Flow Mobility',
        date: '14 May,2025',
        startTimeEpoch: '1715661600', // Example epoch for 10:00 AM
        trainer: 'Anna Rowe',
        gymLocation: 'Cork Quay',
        workoutName: 'Workout Block 1',
        description: 'Mobility class',
    },
    {
        classId: '4',
        className: 'Cardio Crush',
        date: '14 May,2025',
        startTimeEpoch: '1715661600', // Example epoch for 10:00 AM
        trainer: 'Anna Rowe',
        gymLocation: 'Dublin Central',
        workoutName: 'Workout Block 1',
        description: 'Cardio class',
    },
    {
        classId: '5',
        className: 'Rock Endurance',
        date: '14 May,2025',
        startTimeEpoch: '1715661600', // Example epoch for 10:00 AM
        trainer: 'Anna Rowe',
        gymLocation: 'Limerick Park',
        workoutName: 'Workout Block 1',
        description: 'Endurance class',
    },
];
export class ClassService extends BaseApiService {
    async getClasses() {
        // return this.get<ClassItem[]>('/classes');
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));
        return {
            data: mockClasses,
            status: 200,
            message: 'Mock data',
        };
    }
    async getAvailableClasses() {
        const response = await fetch('http://localhost:8080/api/app/class/available', {
            headers: {
                'token': 'FfbhuYx_pSVRl7npG8wQIw',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch available classes');
        }
        const data = await response.json();
        return {
            data: data.data || [],
            status: response.status,
            message: data.message || '',
        };
    }
    async getClassById(classId) {
        const response = await fetch(`http://localhost:8080/api/app/class/${classId}`, {
            headers: {
                'token': 'FfbhuYx_pSVRl7npG8wQIw',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch class details');
        }
        const data = await response.json();
        return {
            data: data.data,
            status: response.status,
            message: data.message || '',
        };
    }
}
