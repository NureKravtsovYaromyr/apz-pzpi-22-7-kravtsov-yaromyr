import axios from "axios";
import { AuthResponse } from "../service/AppService";

export const API_URL = process.env.REACT_APP_API_URL;
console.log(API_URL)
const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
}, (error) => {
    return Promise.reject(error);
});
//* * 
$api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/token/refresh`, {
                withCredentials: true, 
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            localStorage.setItem('token', response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

            return $api.request(originalRequest);
        } catch (e) {
            console.log(e);
        }
    }

    return Promise.reject(error);
});
 
export default $api; 
