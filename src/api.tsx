import axios from 'axios';

const api = axios.create({
    //baseURL: 'https://certifai-backend.onrender.com/certifai', 
    baseURL: 'http://localhost:8081/certifai',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
