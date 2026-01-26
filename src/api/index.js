import axios from 'axios';
import {API_BASE_URL} from "../constants/index.js";
const api = axios.create({
    baseURL: API_BASE_URL + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {

        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
            originalRequest._retryCount = originalRequest._retryCount || 0;

            if (originalRequest._retryCount < 3) {
                originalRequest._retryCount += 1;
                return api(originalRequest);
            } else {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
