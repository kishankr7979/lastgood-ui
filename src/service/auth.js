import api from "../api";


export const loginUser = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data.data;
}

export const resetPassword = async (id, password) => {
    const response = await api.post('/users/password/reset', { id, password })
    return response.data.data
}

export const signupUser = async ({ email, password, role, org_name, org_slug }) => {
    const response = await api.post('/signup', { email, password, role, org_name, org_slug });
    return response.data;
}

export const verifyEmail = async (token) => {
    const response = await api.post('/verify-email', { token });
    return response.data.data;
}