import api from '../api';

export const getOrganization = async () => {
    const response = await api.get('/organization');
    return response.data.data;
};
