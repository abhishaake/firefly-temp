const API_URL = 'https://firefly-admin.cozmotech.ie/api/v1/workouts';
const API_TOKEN = 'FfbhuYx_pSVRl7npG8wQIw';
export class WorkoutService {
    async getWorkouts() {
        try {
            const response = await fetch(API_URL, {
                headers: {
                    'token': API_TOKEN,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch workouts');
            }
            const data = await response.json();
            // If the API returns workouts directly, use data; otherwise, adjust as needed
            return {
                data: data,
                status: response.status,
                message: 'Fetched from remote API',
            };
        }
        catch (error) {
            return {
                data: {},
                status: 500,
                message: error.message || 'Error fetching workouts',
            };
        }
    }
    async getWorkoutDetails(workoutId) {
        try {
            const response = await fetch(`https://firefly-admin.cozmotech.ie/api/v1/workouts/details?workoutId=${workoutId}`, {
                headers: {
                    'token': API_TOKEN,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch workout details');
            }
            const data = await response.json();
            return {
                data: data.data,
                status: response.status,
                message: 'Fetched workout details from remote API',
            };
        }
        catch (error) {
            return {
                data: {},
                status: 500,
                message: error.message || 'Error fetching workout details',
            };
        }
    }
}
