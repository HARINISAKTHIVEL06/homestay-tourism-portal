import axios from 'axios';

const getBaseURL = () => import.meta.env.VITE_API_BASE_URL || '/api/v1';

const API = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('homestay_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('homestay_refresh_token');
                if (refreshToken) {
                    const res = await axios.post(`${getBaseURL()}/auth/refresh-token`, { token: refreshToken });
                    const newAccessToken = res.data.data.token;
                    localStorage.setItem('homestay_token', newAccessToken);
                    API.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    return API(originalRequest);
                }
            } catch (refreshErr) {
                localStorage.removeItem('homestay_token');
                localStorage.removeItem('homestay_refresh_token');
                localStorage.removeItem('homestay_user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default API;
