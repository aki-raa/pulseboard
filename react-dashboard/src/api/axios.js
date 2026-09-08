import axios from 'axios';

const createApi = (baseURL) => {
    const instance = axios.create({ baseURL });
    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
    return instance;
};

export const authApi = createApi('http://localhost:8080');
export const locationApi = createApi('http://localhost:8082');
export const chatApi = createApi('http://localhost:8083');
export const alertApi = createApi('http://localhost:8084');

export default authApi;