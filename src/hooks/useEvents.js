import api from '../api';
import { useQuery } from '@tanstack/react-query';

const fetchEvents = async () => {
    try {
        const response = await api.get('/change-events');
        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error('API reported failure');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch events');
    }
};

export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });
};
