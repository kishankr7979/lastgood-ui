import { create } from 'zustand';
import api from '../api';

const useOrgStore = create((set) => ({
    org: null,
    isLoading: false,
    error: null,

    fetchOrg: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/organization');
            if (response.data.success) {
                set({ org: response.data.data, isLoading: false });
            } else {
                set({ error: 'Failed to fetch organization', isLoading: false });
            }
        } catch (error) {
            set({ error: error.message || 'Failed to fetch organization', isLoading: false });
        }
    }
}));

export default useOrgStore;
