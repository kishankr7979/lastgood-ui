import api from '../api';
import { useQuery } from '@tanstack/react-query';
import { useApiKeys } from './useApiKeys';

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
    const { hasApiKeys } = useApiKeys();

    return useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
        // Only enable the query if API keys exist.
        enabled: hasApiKeys,
    });
};
