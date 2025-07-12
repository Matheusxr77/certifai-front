import axios from 'axios';

const apiWithoutAuthHeader = axios.create({
    baseURL: 'http://localhost:8080/certifai',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiWithoutAuthHeader.interceptors.request.use(
    (config) => {
        if (config.headers && config.headers['Authorization']) {
            delete config.headers['Authorization'];
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiWithoutAuthHeader;
