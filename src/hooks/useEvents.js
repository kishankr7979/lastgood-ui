import api from '../api';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchEvents = async ({ pageParam = 0 }) => {
    try {
        const response = await api.get(`/change-events?limit=10&offset=${pageParam}`);
        if (response.data.success) {
            return {
                data: response.data.data,
                pagination: response.data.pagination
            };
        } else {
            throw new Error('API reported failure');
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message || 'Failed to fetch events');
    }
};

export const useEvents = () => {
    return useInfiniteQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage.pagination) return undefined;
            const limit = lastPage.pagination.limit || 10;
            const currentOffset = lastPage.pagination.offset || 0;
            const total = lastPage.pagination.total;
            const nextOffset = currentOffset + limit;
            
            return nextOffset < total ? nextOffset : undefined;
        },
    });
};
