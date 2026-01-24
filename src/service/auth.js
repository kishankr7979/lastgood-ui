import api from "../api";


export const loginUser = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data.data;
}

export const resetPassword = async (id, password) => {
    const response = await api.post('/users/password/reset', { id, password })
    return response.data.data
}